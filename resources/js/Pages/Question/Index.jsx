import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { TbArrowLeft } from "react-icons/tb";
import { FaCircle, FaPlus, FaRegCircle, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { FaThumbsUp } from "react-icons/fa6";
import { Transition } from "@headlessui/react";

export default function Index({
    auth,
    questions,
    project,
    success,
    savedAnswers,
    info,
    session,
    questionIds,
}) {
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [thankYouModal, setThankYouModal] = useState(false);
    const lastQuestion = activeQuestionIndex === questions.length - 1;
    const firstQuestion = activeQuestionIndex === 0;
    const question = questions[activeQuestionIndex];
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        answers: savedAnswers || [],
        project_id: project.id,
    });

    const [isDone, setIsDone] = useState(false);
    const showModal = () => setIsDone(true);
    const closeModal = () => setIsDone(false);

    const closeThankYouModal = () => {
        setThankYouModal(false);
        router.get(route("project.show", project.id));
    };
    const handleOptionClick = (option) => {
        setData("answers", [
            ...data.answers.filter(
                (answer) => answer.question_id !== question.id
            ),
            {
                question_id: question.id,
                answer_body: option,
                user_id: auth.user.id,
                submitted_at: new Date().toISOString(),
            },
        ]);
    };

    const handleTextInputChange = (e) => {
        setData("answers", [
            ...data.answers.filter(
                (answer) => answer.question_id !== question.id
            ),
            {
                question_id: question.id,
                answer_body: e.target.value,
                user_id: auth.user.id,
                submitted_at: new Date().toISOString(),
            },
        ]);
    };

    const handlePreviousQuestion = () => {
        setActiveQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNextQuestion = () => {
        setActiveQuestionIndex((prevIndex) =>
            Math.min(prevIndex + 1, questions.length - 1)
        );
    };

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("answers.store"), {
            data: { answers: data.answers, project_id: data.project_id },
            onSuccess: () => {
                closeModal();
                setThankYouModal(true);
            },
            onError: (errors) => {
                console.log("Submission errors:", errors);
            },
        });
    };
    useEffect(() => {
        if (success) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    useEffect(() => {
        if (info) {
            setShowInfo(true);
            const timer = setTimeout(() => {
                setShowInfo(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [info]);
    useEffect(() => {
        if (error) {
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Questions
                </h2>
            }
            bgClass={`start-question-bglight`}
            bgDarkClass={`start-question-bgdark`}
        >
            <Head title="Questions" />
            <div className="py-12">
                <div className="mt-24 mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden sm:rounded-lg">
                        <div className="flex flex-col lg:flex-row gap-10">
                            <div className="flex flex-col gap-3 dark:text-white lg:max-w-[400px]">
                                <h2 className="font-extrabold text-4xl">
                                    {project.name}
                                </h2>
                                <div className="">
                                    <p className="text-right">
                                        Start Date: {session.start_date}
                                    </p>
                                    <p className="text-right">
                                        End Date: {session.end_date}
                                    </p>
                                </div>
                                <div className="flex flex-col justify-between bg-[#d9d9d9] dark:bg-[#141414] dark:border-[#252525] p-6 rounded-2xl border w-full lg:w-96 h-72 overflow-auto">
                                    <div>
                                        <div className="border-b-4 font-extrabold text-xl border-b-[#898279] pb-1 dark:border-b-[#312f2d]">
                                            Questions
                                        </div>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {questions.map(
                                                (question, index) => (
                                                    <div
                                                        className="flex gap-1"
                                                        key={index}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                setActiveQuestionIndex(
                                                                    index
                                                                )
                                                            }
                                                            className={`px-2 rounded-lg ${
                                                                index ===
                                                                activeQuestionIndex
                                                                    ? "bg-blue-400 text-white dark:bg-[#1E2843] dark:border-none"
                                                                    : "bg-transparent hover:bg-blue-400 hover:text-white"
                                                            }`}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-6">
                                            <button
                                                disabled={firstQuestion}
                                                onClick={handlePreviousQuestion}
                                                className={`flex items-center ${
                                                    firstQuestion
                                                        ? "cursor-not-allowed"
                                                        : ""
                                                }`}
                                            >
                                                <MdKeyboardDoubleArrowLeft />
                                                Previous
                                            </button>
                                            <button
                                                disabled={lastQuestion}
                                                onClick={handleNextQuestion}
                                                className={`flex items-center ${
                                                    lastQuestion
                                                        ? "cursor-not-allowed"
                                                        : ""
                                                }`}
                                            >
                                                Next
                                                <MdKeyboardDoubleArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#d9d9d9] dark:bg-[#141414] dark:text-white dark:border-[#252525] border rounded-xl p-8 flex flex-col justify-between items-start gap-4 w-full min-h-[450px]">
                                <form onSubmit={onSubmit} className="w-full">
                                    {questions.length > 0 ? (
                                        <div className="w-full h-full">
                                            <h2 className="text-xl py-4">
                                                <span className="pr-2">
                                                    {activeQuestionIndex + 1}.
                                                </span>
                                                {question.question_body}
                                            </h2>
                                            {question.question_type ===
                                                "multiple_choice" &&
                                                (Array.isArray(
                                                    question.possible_answers
                                                )
                                                    ? question.possible_answers
                                                    : JSON.parse(
                                                          question.possible_answers
                                                      )
                                                ).map((option, index) => (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOptionClick(
                                                                option
                                                            )
                                                        }
                                                        className="flex items-center gap-4 mb-4"
                                                        key={index}
                                                    >
                                                        {data.answers.find(
                                                            (answer) =>
                                                                answer.question_id ===
                                                                    question.id &&
                                                                answer.answer_body ===
                                                                    option
                                                        ) ? (
                                                            <FaCircle className="text-blue-400 rounded-full border-2 border-black dark:border-white" />
                                                        ) : (
                                                            <FaRegCircle />
                                                        )}
                                                        {option}
                                                    </button>
                                                ))}

                                            {question.question_type ===
                                                "text" && (
                                                <textarea
                                                    id={`question-text-${question.id}`}
                                                    value={
                                                        data.answers.find(
                                                            (answer) =>
                                                                answer.question_id ===
                                                                question.id
                                                        )?.answer_body || ""
                                                    }
                                                    onChange={
                                                        handleTextInputChange
                                                    }
                                                    className="w-full rounded-xl flex dark:bg-[#1b1b1b] dark:border-[#3e3d3f] dark:border min-h-44  overflow-scroll"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        "Loading"
                                    )}
                                    <div className="flex items-end gap-4 justify-end w-full mt-6">
                                        <button
                                            type="button"
                                            disabled={lastQuestion}
                                            onClick={handleNextQuestion}
                                            className={`${
                                                lastQuestion
                                                    ? "cursor-not-allowed hover:bg-none"
                                                    : "hover:bg-[#4c70cb] dark:hover:bg-[#2a3b69]"
                                            } flex items-center border rounded-xl bg-[#425993] dark:bg-[#1E2843] dark:border-none  px-5 py-1  text-white
                                                `}
                                        >
                                            Next
                                            <MdKeyboardDoubleArrowRight />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={showModal}
                                            className="flex items-center border rounded-xl bg-[#425993] dark:bg-[#1E2843] dark:border-none dark:hover:bg-[#2a3b69] px-5 py-1 hover:bg-[#4c70cb] text-white"
                                        >
                                            Finish
                                            <MdKeyboardDoubleArrowRight />
                                        </button>
                                    </div>
                                    <Modal show={isDone} onClose={closeModal}>
                                        <div className="p-6">
                                            <Transition
                                                show={showError}
                                                enter="transition-opacity duration-300"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="transition-opacity duration-300"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <div className="text-red-500">
                                                    {error}
                                                </div>
                                            </Transition>
                                            <h2 className="dark:text-white">
                                                Are you sure you want to submit?
                                            </h2>
                                            <div className="mt-6 flex justify-end gap-4">
                                                <button
                                                    type="button"
                                                    onClick={closeModal}
                                                    className="px-4 py-1 font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    No
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    onClick={onSubmit}
                                                    className="px-4 py-1 font-bold rounded-lg bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    Yes
                                                </button>
                                            </div>
                                        </div>
                                    </Modal>
                                </form>
                                <Modal
                                    show={thankYouModal}
                                    onClose={closeThankYouModal}
                                >
                                    <div className="p-6 flex items-center justify-center flex-col">
                                        <Transition
                                            show={showSuccess}
                                            enter="transition-opacity duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="transition-opacity duration-300"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="bg-emerald-500 py-2 mb-4 px-4 text-white rounded">
                                                {success}
                                            </div>
                                        </Transition>
                                        <Transition
                                            show={showInfo}
                                            enter="transition-opacity duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="transition-opacity duration-300"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="bg-emerald-500 py-2 mb-4 px-4 text-white rounded">
                                                {info}
                                            </div>
                                        </Transition>
                                        {success ? (
                                            <h2 className="dark:text-white">
                                                Thank you for your submission!
                                                Your answers have been
                                                successfully recorded.
                                            </h2>
                                        ) : (
                                            <h2 className="dark:text-white">
                                                Feel Free to come back later.
                                            </h2>
                                        )}

                                        <FaThumbsUp className="text-4xl" />
                                        <div className="mt-6 flex justify-end w-full pr-8 gap-4">
                                            <button
                                                type="button"
                                                onClick={closeThankYouModal}
                                                className="px-4 py-1 font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
