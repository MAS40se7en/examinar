import React from "react";

const QuestionTypeButton = ({ type, activeType, setActiveType, children }) => {
    const handleClick = () => {
        if (activeType !== type) {
            setActiveType(type);
        }
    };
    return (
        <button
            type="button"
            onClick={handleClick}
            className={`border px-8 py-1 rounded-xl  ${
                activeType === type
                    ? "bg-white dark:bg-[#d9d9d9] dark:text-black  border-[#b9b9b9]"
                    : "border-transparent"
            }  `}
        >
            {children}
        </button>
    );
};

export default QuestionTypeButton;
