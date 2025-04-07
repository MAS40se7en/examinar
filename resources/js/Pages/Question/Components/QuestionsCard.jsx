import React from "react";
import { FaPlus } from "react-icons/fa6";
import {
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const QuestionsCard = ({
    data,
    currentIndex,
    setCurrentIndex,
    handleAddQuestion,
    groupName,
    createdBy,
    createdAt,
}) => {
    const handlePreviousQuestion = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = prevIndex - 1;
            return Math.max(newIndex, 0);
        });
    };
    const handleNextQuestion = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            return Math.min(newIndex, data.questions.length - 1);
        });
    };
    const lastQuestion = currentIndex === data.questions.length - 1;
    const firstQuestion = currentIndex === 0;
    const question = data.questions[currentIndex];
    return (
        <div className="flex flex-col gap-3 dark:text-white">
            <h2 className="font-extrabold text-4xl">Add Questions</h2>
            <p className="font-bold">
                User Group: <span>{groupName}</span>
            </p>
            <p className="font-bold">
                Created By: <span>{createdBy}</span>
            </p>
            <p className="font-bold">
                Created At:{" "}
                <span>{new Date(createdAt).toLocaleDateString()}</span>
            </p>
            <div className="flex flex-col justify-between bg-[#d9d9d9] dark:bg-[#141414] dark:border-[#252525] p-6 rounded-2xl border lg:w-96 max-w-96 h-72">
                <div>
                    <div className="border-b-4 font-extrabold text-xl border-b-[#898279] dark:border-b-[#312f2d]">
                        Questions
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {data.questions.map((_, index) => (
                            <div className="flex gap-1" key={index}>
                                <button
                                    onClick={() => setCurrentIndex(index)}
                                    className={`px-3 rounded-lg hover:bg-blue-700 dark:text-white ${
                                        index === currentIndex
                                            ? "bg-blue-500 text-white"
                                            : "text-black"
                                    }`}
                                >
                                    {" "}
                                    {index + 1}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex gap-6 ">
                        <button
                            disabled={firstQuestion}
                            onClick={handlePreviousQuestion}
                            className={`flex items-center ${
                                firstQuestion ? "cursor-not-allowed" : ""
                            }`}
                        >
                            <MdKeyboardDoubleArrowLeft />
                            Previous
                        </button>
                        <button
                            disabled={lastQuestion}
                            onClick={handleNextQuestion}
                            className={`flex items-center ${
                                lastQuestion ? "cursor-not-allowed" : ""
                            }`}
                        >
                            Next
                            <MdKeyboardDoubleArrowRight />{" "}
                        </button>
                    </div>
                    <button
                        onClick={handleAddQuestion}
                        className="flex items-center gap-2 border bg-[#f3f3f3] dark:bg-[#242424] dark:border-[#3e3d3f] px-3 py-1 rounded-xl font-bold border-[#b9b9b9] hover:bg-[#d8d8d8] dark:hover:bg-[#3d3c3c] focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                    >
                        <FaPlus /> Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionsCard;
