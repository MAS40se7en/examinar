import React, { useEffect, useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import Modal from "@/Components/Modal";

const ResultsModal = ({
    resultsModal,
    closeResults,
    searchCompletedUsers,
    setSearchCompletedUsers,
    searchInCompleteUsers,
    setSearchInCompleteUsers,
    filteredCompletedUsers,
    filteredInCompleteUsers,
    userGroupUsers,
    completedUsers,
    project,
    questions,
    editSuccess,
    sessionCompletedUsers,
    canMarkAsComplete,
}) => {
    const [exportMessage, setExportMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showEditSuccess, setEditSuccess] = useState(false);
    const [isEmpty, SetIsEmpty] = useState(false);
    const [allowEdit, setAllowEdit] = useState(project.allow_edit);
    const hasQuestions = questions.length > 0;

    const exportProject = (e) => {
        e.preventDefault();
        if (completedUsers.length === 0) {
            setExportMessage("No result to export.");
            SetIsEmpty(true);
            setShowSuccess(false);
            return;
        }
        const exportUrl = route("project.export", project.id);
        window.location.href = exportUrl;
        SetIsEmpty(false);
        setShowSuccess(true);
        setExportMessage(
            "Export process has been initiated. Please check your downloads."
        );
    };

    const handleCheckboxChange = (e) => {
        const newAllowEdit = e.target.checked;
        setAllowEdit(newAllowEdit);

        router.post(
            route("project.updateAllowEdit", project.id),
            { allow_edit: newAllowEdit },
            {
                onSuccess: () => {
                    console.log("Allow edit successful");
                },
                onError: (error) => {
                    console.error("Error updating settings:", error);
                },
            }
        );
    };

    const markAsCompleted = () => {
        router.post(route("project.complete", project.id), {
            onSuccess: () => {
                console.log('Project marked as completed successfully');
            },
            onError: (error) => {
                console.error("Error updating project:", error);
            },
        });
    };

    const markAsIncomplete = () => {
        router.post(
            route('project.incomplete', project.id),
            {
                onSuccess: () => {
                    console.log('Project marked as incomplete successfully');
                },
                onError: (error) => {
                    console.error('Error updating project status:', error);
                },
            }
        );
    };

    useEffect(() => {
        if (exportMessage) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [exportMessage]);

    useEffect(() => {
        if (editSuccess) {
            setEditSuccess(true);
            const timer = setTimeout(() => {
                setEditSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [editSuccess]);

    return (
        <Modal
            show={resultsModal}
            onClose={closeResults}
            className="h-3/4 overflow-scroll"
            maxWidth="4xl"
        >
            <div className="px-5 flex flex-col gap-1 py-6 dark:text-white">
                <Transition
                    show={showSuccess}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className={`${
                            isEmpty ? "bg-red-500" : "bg-emerald-500"
                        } py-2 mb-4 px-4 text-white rounded`}
                    >
                        {exportMessage}
                    </div>
                </Transition>
                <Transition
                    show={showEditSuccess}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="bg-emerald-500 py-2 mb-4 px-4 text-white rounded">
                        {editSuccess}
                    </div>
                </Transition>
                <h1 className="text-3xl font-bold px-3 py-4">
                    {hasQuestions
                        ? "Project Results"
                        : "No Questions Available"}
                </h1>
                {hasQuestions && (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex mb-4 gap-4 w-full">
                                <input
                                    type="text"
                                    placeholder="Search completed users by name or email"
                                    value={searchCompletedUsers}
                                    onChange={(e) =>
                                        setSearchCompletedUsers(e.target.value)
                                    }
                                    className="border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] rounded-xl w-full"
                                />
                            </div>
                            <div className="flex mb-4 gap-4 w-full">
                                <input
                                    type="text"
                                    placeholder="Search not completed users by name or email"
                                    value={searchInCompleteUsers}
                                    onChange={(e) =>
                                        setSearchInCompleteUsers(e.target.value)
                                    }
                                    className="border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] rounded-xl w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {/* Completed Users Table */}
                            <div className="border-2 dark:border-white/30 rounded-xl overflow-auto h-96">
                                <table className="table-auto w-full text-left">
                                    <thead className="border-b-2 dark:border-b-white/40 w-full bg-white dark:bg-[#141414] dark:drop-shadow-md dark:shadow-[#242424] dark:text-white dark:border-b-[#312f2d]">
                                        <tr>
                                            <th className="px-3 py-2">
                                                Completed
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="px-3 py-2 border-t-2 dark:border-t-white/40 text-left">
                                                User name
                                            </th>
                                            <th className="px-3 py-2 border-t-2 dark:border-t-white/40 dark:border-l-white/40 border-l-2">
                                                Email
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCompletedUsers.length > 0 ? (
                                            filteredCompletedUsers.map(
                                                (user, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b-2 border-black/10 dark:border-white/40"
                                                    >
                                                        <td className="border-r-2 border-t-2 py-2 dark:border-t-white/40 px-3 text-nowrap dark:border-r-white/40">
                                                            <Link
                                                                href={route(
                                                                    "user.answers",
                                                                    {
                                                                        user: user.id,
                                                                        project:
                                                                            project.id,
                                                                    }
                                                                )}
                                                                className="hover:underline hover:text-blue-500"
                                                            >
                                                                {user.name}
                                                            </Link>
                                                        </td>
                                                        <td className="border-r-2 border-t-2 py-2 dark:border-t-white/40 px-3 text-nowrap dark:border-r-white/40">
                                                            {user.email}
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    className="py-2 text-center"
                                                    colSpan="2"
                                                >
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Incomplete Users Table */}
                            <div className="border-2 dark:border-white/30 rounded-xl overflow-auto h-96">
                                <table className="w-full">
                                    <thead className="border-b-2 border-b-[#898279] dark:border-b-white/40 w-full bg-white dark:bg-[#141414] dark:drop-shadow-md dark:shadow-[#242424] dark:text-white dark:border-b-[#312f2d]">
                                        <tr>
                                            <th className="px-3 py-2">
                                                Not Completed
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="px-3 py-2 border-t-2 dark:border-t-white/40 text-left">
                                                User name
                                            </th>
                                            <th className="px-3 py-2 border-t-2 dark:border-t-white/40 dark:border-l-white/40 border-l-2">
                                                Email
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInCompleteUsers.length > 0 ? (
                                            filteredInCompleteUsers.map(
                                                (user, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b-2 border-black/10 dark:border-white/40"
                                                    >
                                                        <td className="border-r-2 border-t-2 py-2 dark:border-t-white/40 px-3 text-nowrap dark:border-r-white/40">
                                                            {user.name}
                                                        </td>
                                                        <td className="border-r-2 border-t-2 py-2 dark:border-t-white/40 px-3 text-nowrap dark:border-r-white/40">
                                                            {user.email}
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    className="py-2 text-center"
                                                    colSpan="2"
                                                >
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Section for Sessions Where Users Have Completed */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-4">
                                Session Completion Status
                            </h2>
                            {Object.keys(sessionCompletedUsers).length > 0 ? (
                                Object.keys(sessionCompletedUsers).map(
                                    (sessionId) => {
                                        const sessionUsers =
                                            sessionCompletedUsers[sessionId];
                                        return (
                                            <div
                                                key={sessionId}
                                                className="mb-6"
                                            >
                                                <h3 className="text-xl font-semibold">
                                                    Session {sessionId}:
                                                </h3>
                                                <div className=" max-h-32 overflow-scroll">
                                                    <table className="w-full overflow-scroll border">
                                                        <thead className="border-b-2 border-b-[#898279] dark:border-b-white/40 w-full bg-white dark:bg-[#141414] dark:drop-shadow-md dark:shadow-[#242424] dark:text-white dark:border-b-[#312f2d]">
                                                            <tr>
                                                                <th className="px-3 py-2 border-t-2 dark:border-t-white/40 text-left">
                                                                    User name
                                                                </th>
                                                                <th className="px-3 py-2 border-t-2 dark:border-t-white/40 dark:border-l-white/40 border-l-2">
                                                                    Email
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {sessionUsers.map(
                                                                (
                                                                    user,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="border-b-2 border-black/10 dark:border-white/40"
                                                                    >
                                                                        <td className="border-r-2 border-t-2 py-2 dark:border-t-white/40 px-3 text-nowrap dark:border-r-white/40">
                                                                            {
                                                                                user.name
                                                                            }
                                                                        </td>
                                                                        <td className="border-r-2 border-t-2 py-2 dark:border-t-white/40 px-3 text-nowrap dark:border-r-white/40">
                                                                            {
                                                                                user.email
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            ) : (
                                <p>No users have completed a session</p>
                            )}
                        </div>

                        {/* Summary and Action Buttons */}
                        <div className="mt-10 flex gap-3">
                            <h2 className="font-bold">
                                Number of Participants:
                            </h2>
                            <p className="font-bold">{userGroupUsers.length}</p>
                        </div>
                        <div className="flex gap-3">
                            <h2 className="font-bold">Project completed by:</h2>
                            <p>{completedUsers.length}</p>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between gap-2 md:sticky bottom-0 md:pb-2 md:pt-4 md:border-t bg-white dark:bg-[#141414]">
                            <div className="flex items-center gap-4">
                                <label htmlFor="allow-edit">
                                    Allow users to edit their answers
                                </label>
                                <input
                                    type="checkbox"
                                    id="allow-edit"
                                    checked={allowEdit}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={closeResults}
                                    className="bg-red-600 px-3 py-1 text-white hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 rounded-xl"
                                >
                                    Close
                                </button>

                                {!project.completed &&
                                canMarkAsComplete && (
                                                <div>
                                                    <button
                                                        onClick={() => markAsCompleted()}
                                                        className="bg-black text-white px-3 py-1 rounded-xl dark:bg-white dark:text-black"
                                                    >
                                                        Mark as Completed
                                                    </button>
                                                </div>
                                            )}
                                {project.completed && (
                                                <div>
                                                    <button
                                                        onClick={() => markAsIncomplete()}
                                                        className="bg-black text-white px-3 py-1 rounded-xl dark:bg-white dark:text-black"
                                                    >
                                                        Mark as not Complete
                                                    </button>
                                                </div>
                                            )}

                                <button
                                    onClick={exportProject}
                                    className="text-white px-3 py-1 bg-green-600 hover:bg-green-700 dark:hover:bg-green-900 dark:bg-green-700 rounded-xl"
                                >
                                    Export Results
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ResultsModal;
