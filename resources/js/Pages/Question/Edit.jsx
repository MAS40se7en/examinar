import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";

import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import QuestionTypeButton from "./Components/QuestionTypeButton";
import QuestionBodyInput from "./Components/QuestionBodyInput";
import OptionList from "./Components/OptionList";

const Edit = ({ question, auth }) => {
    const { data, setData, patch, processing, errors } = useForm({
        question_body: question.question_body || "",
        question_body_type: question.question_body_type || "text",
        possible_answers: Array.isArray(question.possible_answers)
            ? question.possible_answers
            : JSON.parse(question.possible_answers || "[]"),
        question_type: question.question_type || "",
        question_file: null,
    });

    const [activeQuestionBody, setActiveQuestionBody] = useState(
        data.question_body_type
    );
    const [activeQuestionType, setActiveQuestionType] = useState(
        data.question_type
    );

    useEffect(() => {
        setData("question_body_type", activeQuestionBody);
    }, [activeQuestionBody]);

    useEffect(() => {
        setData("question_type", activeQuestionType);
    }, [activeQuestionType]);

    const handleQuestionBodyChange = (e) => {
        setData("question_body", e.target.value);
    };

    const handleQuestionTypeChange = (type) => {
        setActiveQuestionType(type);
        if (type === "multiple_choice") {
            if (!data.possible_answers || data.possible_answers.length < 2) {
                setData("possible_answers", ["", ""]);
            }
        } else {
            setData("possible_answers", []);
        }
    };

    const handleOptionChange = (e, index) => {
        const newAnswers = [...data.possible_answers];
        newAnswers[index] = e.target.value;
        setData("possible_answers", newAnswers);
    };

    const handleAddOption = () => {
        if (data.possible_answers.length < 4) {
            setData("possible_answers", [...data.possible_answers, ""]);
        }
    };

    const handleRemoveOption = (index) => {
        if (data.possible_answers.length > 2) {
            const newAnswers = [...data.possible_answers];
            newAnswers.splice(index, 1);
            setData("possible_answers", newAnswers);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        patch(route("question.update", question.id), {
            question_body: data.question_body,
            question_type: data.question_type,
            possible_answers: data.possible_answers,
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
            bgClass={`create-project-bglight`}
            bgDarkClass={`create-project-bgdark`}
        >
            <Head title="Edit Questions" />
            <div className="py-12">
                <div className="sm:px-6  lg:px-8">
                    <div className="sm:rounded-lg flex flex-col items-center w-full ">
                        <div className="font-extrabold px-3 w-full  lg:w-[900px]  text-4xl pb-4 dark:text-white">
                            Edit Question
                        </div>
                        <div className="p-6 text-gray-900 border rounded-3xl  border-gray-300 bg-[#d9d9d9] dark:bg-[#141414] dark:text-white dark:border-[#242424] w-full lg:w-[900px] overflow-scroll">
                            <form onSubmit={onSubmit}>
                                <div className="flex gap-10">
                                    <div className="text-nowrap font-bold w-32">
                                        Question Body
                                    </div>
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="flex gap-32 text-sm font-bold text-nowrap">
                                            <QuestionTypeButton
                                                type="text"
                                                activeType={activeQuestionBody}
                                                setActiveType={
                                                    setActiveQuestionBody
                                                }
                                            >
                                                Text
                                            </QuestionTypeButton>
                                            <QuestionTypeButton
                                                type="image"
                                                activeType={activeQuestionBody}
                                                setActiveType={
                                                    setActiveQuestionBody
                                                }
                                            >
                                                Image
                                            </QuestionTypeButton>
                                            <QuestionTypeButton
                                                type="audio"
                                                activeType={activeQuestionBody}
                                                setActiveType={
                                                    setActiveQuestionBody
                                                }
                                            >
                                                Audio
                                            </QuestionTypeButton>
                                        </div>
                                        <QuestionBodyInput
                                            type={activeQuestionBody}
                                            value={data.question_body || ""}
                                            onChange={handleQuestionBodyChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-10 mt-6">
                                    <div className="text-nowrap w-32 font-bold">
                                        Question Type
                                    </div>
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="flex gap-20 text-sm font-bold text-nowrap">
                                            <QuestionTypeButton
                                                type="multiple_choice"
                                                activeType={activeQuestionType}
                                                setActiveType={
                                                    handleQuestionTypeChange
                                                }
                                            >
                                                Multiple Choice
                                            </QuestionTypeButton>
                                            <QuestionTypeButton
                                                type="text"
                                                activeType={activeQuestionType}
                                                setActiveType={
                                                    handleQuestionTypeChange
                                                }
                                            >
                                                Text
                                            </QuestionTypeButton>
                                            <QuestionTypeButton
                                                type="image_highlight"
                                                activeType={activeQuestionType}
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
                                                            data.possible_answers
                                                        }
                                                        onOptionChange={
                                                            handleOptionChange
                                                        }
                                                        onRemoveOption={
                                                            handleRemoveOption
                                                        }
                                                    />
                                                    {data.possible_answers
                                                        .length < 4 && (
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
                                            {activeQuestionType === "text" && (
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
                                <div className="flex justify-end mt-6">
                                    <div className="flex gap-4 items-center">
                                        <Link
                                            href={route(
                                                "project.show",
                                                question.project_id
                                            )}
                                            className="border bg-[#BBB18B] px-6 py-1 rounded-xl font-bold border-[#9e9e9e] dark:bg-[#4b4429] dark:border-[#3e3d3f] dark:hover:bg-[#776c41] hover:bg-[#9c8c4e] focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="border bg-[#BBB18B] px-6 py-1 rounded-xl font-bold border-[#9e9e9e] dark:bg-[#4b4429] dark:border-[#3e3d3f] dark:hover:bg-[#776c41] hover:bg-[#9c8c4e] focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
