import TextInput from "@/Components/TextInput";
import React from "react";

const QuestionBodyInput = ({ type, value, onChange }) => {
    switch (type) {
        case "text":
            return (
                <textarea
                    value={value}
                    onChange={onChange}
                    id="question_body"
                    placeholder="type question text here..."
                    className="w-full rounded-xl dark:bg-[#1b1b1b] dark:border-[#3e3d3f] dark:border min-h-44 max-h-44 overflow-scroll"
                />
            );
        case "image":
        case "audio":
            return (
                <div className="">
                    <textarea
                        id="question_body"
                        placeholder="type question text here..."
                        className="w-full rounded-xl dark:bg-[#1b1b1b] dark:border-[#3e3d3f] dark:border min-h-44 max-h-44 overflow-scroll"
                    />
                    <TextInput
                        type="file"
                        id="question_file"
                        name="question_file"
                        accept={type === "image" ? "image/*" : "audio/*"}
                    />
                </div>
            );
        default:
            return null;
    }
};

export default QuestionBodyInput;
