import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";

import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";

import QuestionsCard from "./Components/QuestionsCard";
import QuestionTypeButton from "./Components/QuestionTypeButton";
import QuestionBodyInput from "./Components/QuestionBodyInput";
import OptionList from "./Components/OptionList";

export default function Create({ auth, projectId, project }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeQuestionBody, setActiveQuestionBody] = useState("text");
    const [activeQuestionType, setActiveQuestionType] =
        useState("multiple_choice");

    const { data, setData, post, processing, errors } = useForm({
        questions: [
            {
                question_body: "",
                question_body_type: "text",
                possible_answers: ["", ""],
                question_type: "multiple_choice",
                question_file: null,
            },
        ],
    });

    // Validate current index
    const isValidIndex =
        currentIndex >= 0 && currentIndex < data.questions.length;
    const currentQuestion = isValidIndex ? data.questions[currentIndex] : {};
    const possibleAnswers = currentQuestion?.possible_answers || [];

    useEffect(() => {
        const currentQuestion = data.questions[currentIndex];
        if (currentQuestion) {
            setActiveQuestionBody(currentQuestion.question_body_type || "text");
            setActiveQuestionType(currentQuestion.question_type);
        }
    }, [currentIndex]);

    // Handle addition of new question
    const handleAddQuestion = () => {
        const newQuestions = [
            ...data.questions,
            {
                question_body: "",
                possible_answers: ["", ""],
                question_type: "multiple_choice",
                question_file: null,
            },
        ];
        setData("questions", newQuestions);
        setCurrentIndex(newQuestions.length - 1);
        setActiveQuestionBody("text");
        setActiveQuestionType("multiple_choice");
    };

    // Handle change in question body
    const handleQuestionBodyChange = (e) => {
        const newQuestions = [...data.questions];
        if (newQuestions[currentIndex]) {
            newQuestions[currentIndex].question_body = e.target.value;
            setData("questions", newQuestions);
        }
    };

    // Handle change in question type
    const handleQuestionTypeChange = (type) => {
        const newQuestions = [...data.questions];
        if (newQuestions[currentIndex]) {
            newQuestions[currentIndex].question_type = type;
            if (type === "multiple_choice") {
                if (
                    !newQuestions[currentIndex].possible_answers ||
                    newQuestions[currentIndex].possible_answers.length < 2
                ) {
                    newQuestions[currentIndex].possible_answers = ["", ""];
                }
            } else {
                newQuestions[currentIndex].possible_answers = [];
            }
            setData("questions", newQuestions);
            setActiveQuestionType(type);
        }
    };

    // Handle option change
    const handleOptionChange = (e, index) => {
        const newQuestions = [...data.questions];
        if (newQuestions[currentIndex]) {
            newQuestions[currentIndex].possible_answers[index] = e.target.value;
            setData("questions", newQuestions);
        }
    };

    // Handle addition of option
    const handleAddOption = () => {
        if (
            data.questions[currentIndex] &&
            data.questions[currentIndex].possible_answers.length < 4
        ) {
            const newQuestions = [...data.questions];
            newQuestions[currentIndex].possible_answers.push("");
            setData("questions", newQuestions);
        }
    };

    // Handle removal of option
    const handleRemoveOption = (index) => {
        if (
            data.questions[currentIndex] &&
            data.questions[currentIndex].possible_answers.length > 2
        ) {
            const newQuestions = [...data.questions];
            newQuestions[currentIndex].possible_answers.splice(index, 1);
            setData("questions", newQuestions);
        }
    };

    // Handle question removal
    const handleRemoveQuestion = () => {
        if (data.questions.length > 1) {
            const newQuestions = data.questions.filter(
                (_, index) => index !== currentIndex
            );
            setData("questions", newQuestions);
            setCurrentIndex(Math.max(0, currentIndex - 1));
        }
    };

    // Handle form submission
    const onSubmit = (e) => {
        console.log(errors);
        e.preventDefault();
        post(route("questions.store", { project_id: projectId }), {
            data: data.questions,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Questions
                </h2>
            }
            bgClass={`question-bglight`}
            bgDarkClass={`question-bgdark`}
        >
            <Head title="Questions" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden  sm:rounded-lg">
                        <div className="flex flex-col lg:flex-row gap-10  ">
                            <QuestionsCard
                                data={data}
                                groupName={project.user_group.name}
                                createdAt={project.created_at}
                                createdBy={project.created_by.name}
                                currentIndex={currentIndex}
                                setCurrentIndex={setCurrentIndex}
                                handleAddQuestion={handleAddQuestion}
                            />

                            <div className="bg-[#d9d9d9] dark:bg-[#141414] dark:text-white dark:border-[#252525]  border rounded-xl p-8 flex flex-col gap-10 overflow-scroll lg:w-3/4 min-h-3/4">
                                <form onSubmit={onSubmit}>
                                    <div className="flex gap-10">
                                        <div className="text-nowrap font-bold w-32">
                                            Question Body
                                        </div>
                                        <div className="flex flex-col gap-4  w-full">
                                            <div className="flex gap-32 text-sm font-bold text-nowrap">
                                                <QuestionTypeButton
                                                    type="text"
                                                    activeType={
                                                        activeQuestionBody
                                                    }
                                                    setActiveType={
                                                        setActiveQuestionBody
                                                    }
                                                >
                                                    Text
                                                </QuestionTypeButton>
                                                <QuestionTypeButton
                                                    type="image"
                                                    activeType={
                                                        activeQuestionBody
                                                    }
                                                    setActiveType={
                                                        setActiveQuestionBody
                                                    }
                                                >
                                                    Image
                                                </QuestionTypeButton>
                                                <QuestionTypeButton
                                                    type="audio"
                                                    activeType={
                                                        activeQuestionBody
                                                    }
                                                    setActiveType={
                                                        setActiveQuestionBody
                                                    }
                                                >
                                                    Audio
                                                </QuestionTypeButton>
                                            </div>
                                            {/* question body inputs */}
                                            <QuestionBodyInput
                                                type={activeQuestionBody}
                                                value={
                                                    data.questions[currentIndex]
                                                        ?.question_body || ""
                                                }
                                                onChange={
                                                    handleQuestionBodyChange
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-10 mt-6">
                                        <div className="text-nowrap w-32 font-bold">
                                            Question Type
                                        </div>
                                        <div className="flex flex-col gap-4  w-full">
                                            <div className="flex gap-20 text-sm font-bold text-nowrap">
                                                <QuestionTypeButton
                                                    type="multiple_choice"
                                                    activeType={
                                                        activeQuestionType
                                                    }
                                                    setActiveType={
                                                        handleQuestionTypeChange
                                                    }
                                                >
                                                    Multiple Choice
                                                </QuestionTypeButton>
                                                <QuestionTypeButton
                                                    type="text"
                                                    activeType={
                                                        activeQuestionType
                                                    }
                                                    setActiveType={
                                                        handleQuestionTypeChange
                                                    }
                                                >
                                                    Text
                                                </QuestionTypeButton>
                                                <QuestionTypeButton
                                                    type="image_highlight"
                                                    activeType={
                                                        activeQuestionType
                                                    }
                                                    setActiveType={
                                                        handleQuestionTypeChange
                                                    }
                                                >
                                                    Image Highlight
                                                </QuestionTypeButton>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {activeQuestionType ===
                                                    "multiple_choice" && (
                                                    <>
                                                        <OptionList
                                                            options={
                                                                possibleAnswers
                                                            }
                                                            onOptionChange={
                                                                handleOptionChange
                                                            }
                                                            onRemoveOption={
                                                                handleRemoveOption
                                                            }
                                                        />
                                                        {possibleAnswers.length <
                                                            4 && (
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    handleAddOption
                                                                }
                                                                className="flex w-32 dark:bg-[#242424] dark:border-[#3e3d3f] dark:hover:bg-[#3d3c3c] text-sm items-center gap-2 border bg-[#f3f3f3] px-3 py-1 rounded-xl font-bold border-[#b9b9b9] hover:bg-[#d8d8d8] focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                                            >
                                                                <FaPlus /> Add
                                                                Option
                                                            </button>
                                                        )}
                                                    </>
                                                )}

                                                {activeQuestionType ===
                                                    "text" && (
                                                    <p className="text-green-700 ml-4">
                                                        Text Type Selected
                                                    </p>
                                                )}
                                                {activeQuestionType ===
                                                    "image_highlight" && (
                                                    <p className="text-green-700 ml-4">
                                                        Image Highlight Type
                                                        Selected
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {data.questions.length > 1 && (
                                        <div className="mt-8">
                                            <button
                                                type="button"
                                                onClick={handleRemoveQuestion}
                                                className="bg-red-500 px-3 rounded-xl py-1 text-white hover:bg-red-700"
                                            >
                                                Remove Question
                                            </button>
                                        </div>
                                    )}
                                    <div className="lg:absolute lg:bottom-16 lg:right-28 flex justify-end mt-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="border bg-[#BBB18B] px-6 py-1 rounded-xl font-bold border-[#9e9e9e] dark:bg-[#4b4429] dark:border-[#3e3d3f] dark:hover:bg-[#776c41]  hover:bg-[#9c8c4e] focus:outline-none focus:ring-1  transition ease-in-out duration-150"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
