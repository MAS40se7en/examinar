import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const TableHeader = ({
    name,
    sort_field = null,
    children,
    sortable = true,
    sort_direction = null,
    sortChanged = () => {},
    className,
}) => {
    return (
        <th className="">
            <div
                onClick={(e) => sortChanged(name)}
                className="flex items-center gap-4 px-3 py-2 text-nowrap cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-100/20 "
            >
                {children}
                {sortable && (
                    <div className="">
                        <FaChevronUp
                            className={`text-[0.8rem]
                 ${
                     sort_field === name && sort_direction === "asc"
                         ? "text-blue-600 font-extrabold"
                         : ""
                 }
 
             `}
                        />
                        <FaChevronDown
                            className={`text-[0.8rem]
                 ${
                     sort_field === name && sort_direction === "desc"
                         ? "text-blue-600 font-extrabold"
                         : ""
                 }
 
             `}
                        />
                    </div>
                )}
            </div>
        </th>
    );
};

export default TableHeader;
