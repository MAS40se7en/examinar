import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { Transition } from "@headlessui/react";
import { Link } from "@inertiajs/react";
import React from "react";

const QuestionsModal = ({
    displayQuestions,
    closeModal,
    showDeleteSuccess,
    questions,
    confirmQuestionDeletion,
}) => {
    return (
        <Modal
            show={displayQuestions}
            onClose={closeModal}
            className="h-3/4 overflow-scroll"
        >
            <div className="p-6">
                <Transition
                    show={showDeleteSuccess}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="bg-green-500 py-2 z-10 mb-4 px-4 text-white rounded">
                        Question deleted successfully
                    </div>
                </Transition>
                <table className="table-auto w-full text-left">
                    <thead className="border-b-4 border-b-[#898279] shadow-md w-full bg-white dark:bg-[#141414] dark:drop-shadow-md dark:shadow-[#242424] dark:text-white md:sticky top-0 dark:border-b-[#312f2d]">
                        <tr>
                            <th className="text-nowrap pt-10 px-3">ID</th>
                            <th className="text-nowrap pt-10 text-left px-3">
                                Question Body
                            </th>
                            <th className="text-nowrap pt-10 text-center px-3">
                                Question Type
                            </th>
                            <th className="text-nowrap pt-10 text-center px-3">
                                Created At
                            </th>
                            <th className="text-nowrap pt-10 px-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="dark:text-white">
                        {questions.map((question, index) => (
                            <tr key={index}>
                                <td className="border-r-2 py-2 px-3 dark:border-r-[#312f2d]">
                                    {index + 1}
                                </td>
                                <td className="border-r-2 py-2 px-3 dark:border-r-[#312f2d]">
                                    {question.question_body.length > 20
                                        ? question.question_body.slice(0, 10) +
                                          "..."
                                        : question.question_body}
                                </td>
                                <td className="border-r-2 text-center py-2 px-3 dark:border-r-[#312f2d]">
                                    {question.question_type}
                                </td>
                                <td className="border-r-2 text-center py-2 px-3 dark:border-r-[#312f2d]">
                                    {new Date(
                                        question.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-3 flex">
                                    <Link
                                        href={route(
                                            "question.edit",
                                            question.id
                                        )}
                                        className="bg-opacity-80 dark:bg-opacity-30 text-white font-semibold mr-2 hover:bg-blue-900 hover:no-underline bg-blue-600 py-1 px-3 rounded-xl"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() =>
                                            confirmQuestionDeletion(question)
                                        }
                                        className="text-white bg-opacity-80 dark:bg-opacity-30 font-semibold hover:bg-red-900 hover:no-underline bg-red-500 py-1 px-3 rounded-xl"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex md:sticky bottom-0 pt-4 dark:border-t-[#373636] bg-white dark:bg-[#141414] px-12 pb-4 border-t border-t-[#cccaca] justify-end gap-4 mt-6">
                    <SecondaryButton
                        onClick={closeModal}
                        className="hover:bg-[#cecfce]"
                    >
                        Close
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
};

export default QuestionsModal;
