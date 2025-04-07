import TextInput from "@/Components/TextInput";
import { FaRegCircle } from "react-icons/fa";

const OptionList = ({ options, onOptionChange, onRemoveOption }) => (
    <>
        {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
                <FaRegCircle className="text-gray-400" />
                <TextInput
                    value={option}
                    onChange={(e) => onOptionChange(e, index)}
                    className="w-72 dark:bg-[#1b1b1b] dark:border-[#3e3d3f] rounded-xl h-8"
                    required
                />
                {index >= 2 && (
                    <button
                        onClick={() => onRemoveOption(index)}
                        className="flex max-w-20 dark:bg-[#242424] dark:border-[#3e3d3f] dark:hover:bg-[#3d3c3c] text-sm items-center gap-2 border bg-[#f3f3f3] px-3 py-1 rounded-xl font-bold border-[#b9b9b9] hover:bg-[#d8d8d8] focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                    >
                        Remove
                    </button>
                )}
            </div>
        ))}
    </>
);

export default OptionList;
