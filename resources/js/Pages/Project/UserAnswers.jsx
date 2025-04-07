import Pagination from "@/Components/Pagination";
import { Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import TableHeader from "@/Components/TableHeader";

const UserAnswers = ({ answers, user, project, auth }) => {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    User Answers
                </h2>
            }
            bgClass="admin-bglight"
            bgDarkClass="admin-bgdark"
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden sm:rounded-lg">
                        <div className="flex justify-between items-center">
                            <h2 className="font-extrabold px-3 text-3xl pb-4 dark:text-white">
                                {" "}
                                User Answers
                            </h2>
                            <h2 className="text-xl font-bold mr-5 dark:text-white">
                                {user.name}
                            </h2>
                        </div>
                        <p className="pb-4 px-3 text-xl dark:text-white">
                            Project Name: {project.name}
                        </p>
                        <div className="overflow-auto">
                            {answers ? (
                                answers.data.map((answer, index) => (
                                    <div
                                        key={index}
                                        className="p-6 text-gray-900 border overflow-auto mb-3 rounded-3xl border-gray-300 bg-[#f6f6f6] dark:bg-[#141414] dark:text-white dark:border-[#242424] min-h-[150px] max-h-[500px]"
                                    >
                                        <p className="opacity-60 mb-3">
                                            Question type:
                                            <span className="pl-1">
                                                {" "}
                                                {answer.question
                                                    .question_type ===
                                                    "multiple_choice" && (
                                                    <span>Multiple Choice</span>
                                                )}
                                                {answer.question
                                                    .question_type ===
                                                    "text" && <span>Text</span>}
                                                {answer.question
                                                    .question_type ===
                                                    "image_highlight" && (
                                                    <span>Image Highlight</span>
                                                )}
                                            </span>
                                        </p>
                                        <p className="text-lg">
                                            {index + 1}.{" "}
                                            {answer.question.question_body}
                                        </p>

                                        <p className="">
                                            Answer: {answer.answer_body}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div></div>
                            )}
                        </div>
                        <Pagination links={answers.links} auth={auth} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UserAnswers;
