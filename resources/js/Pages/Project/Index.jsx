import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Transition } from "@headlessui/react";
import { Head, Link, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import QuestionsModal from "./Components/QuestionsModal";
import ResultsModal from "./Components/ResultsModal";
import { FaExclamationCircle } from "react-icons/fa";

export default function Project({
    auth,
    project,
    currentUser,
    questions,
    isSystemAdmin,
    projectAdminNames,
    userGroupUsers,
    completedUsers,
    completed,
    canMarkAsCompleted,
    incompleteUsers,
    sessionCompletedUsers,
    hasCompletedSession,
    hasStartedProject,
    success,
    editSuccess,
    numberOfQuestions,
    isSessionStarted,
    showStartButton,
    showContinueButton,
    showEditButton,
    sessionCompleteNoEdit,
    sessions,
    projectCompletionPercentage,
    assignedQuestionsCount,
    nextSessionStartDate,
    isNextSessionAccessible,
    sessionProgress,
    canMarkAsComplete
}) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [displayQuestions, setDisplayQuestions] = useState(false);
    const [confirmingQuestionDeletion, setConfirmingQuestionDeletion] =
        useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [resultsModal, setResultsModal] = useState(false);

    const projectAdmins = project.project_admin;
    const isMultipleAdmins = projectAdmins.length > 1;
    const isProjectAdmin = projectAdmins.includes(auth.user.id);
    const [searchCompletedUsers, setSearchCompletedUsers] = useState("");
    const [searchInCompleteUsers, setSearchInCompleteUsers] = useState("");
    const hasSessions = sessions.length > 0;

    completedUsers = hasSessions ? completedUsers : [];
    incompleteUsers = hasSessions ? incompleteUsers : [];
    const showResults = () => {
        setResultsModal(true);
    };

    const closeResults = () => {
        setResultsModal(false);
    };

    const showModal = () => {
        setDisplayQuestions(true);
    };

    const closeModal = () => {
        setDisplayQuestions(false);
    };

    const confirmQuestionDeletion = (question) => {
        setConfirmingQuestionDeletion(true);
        setQuestionToDelete(question);
    };

    const deleteQuestion = () => {
        if (questionToDelete) {
            router.delete(route("question.destroy", questionToDelete.id), {
                onSuccess: () => {
                    setShowDeleteSuccess(true);
                    closeDeleteModal();
                    setTimeout(() => setShowDeleteSuccess(false), 3000);
                },
                onError: (error) => {
                    console.error("Failed to delete question:", error);
                },
            });
        }
    };

    const closeDeleteModal = () => {
        setConfirmingQuestionDeletion(false);
        setQuestionToDelete(null);
    };

    useEffect(() => {
        if (success) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const filteredCompletedUsers = completedUsers.filter(
        (user) =>
            user.name
                .toLowerCase()
                .includes(searchCompletedUsers.toLowerCase()) ||
            user.email
                .toLowerCase()
                .includes(searchCompletedUsers.toLowerCase())
    );
    const filteredInCompleteUsers = incompleteUsers.filter(
        (user) =>
            user.name
                .toLowerCase()
                .includes(searchInCompleteUsers.toLowerCase()) ||
            user.email
                .toLowerCase()
                .includes(searchInCompleteUsers.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Project
                </h2>
            }
            bgClass={`project-bglight`}
            bgDarkClass={`project-bgdark`}
        >
            <Head title="Project" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Transition
                        show={showSuccess}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="bg-emerald-500 py-2 mb-4 px-4 text-white rounded">
                            {success}
                        </div>
                    </Transition>

                    <div className="overflow-hidden sm:rounded-lg">
                        <h2 className="font-extrabold px-3 text-3xl pb-4 dark:text-white">
                            {project.name}
                        </h2>
                        <div className="p-10 text-gray-900 rounded-3xl bg-[#f6f6f6] dark:bg-[#141414] border dark:border-[#242424] dark:text-white">
                            <div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                                        <div className="gap-1 text-xl">
                                            <div className="flex flex-col gap-2">
                                                <h3>
                                                    {isMultipleAdmins
                                                        ? "Project Admins:"
                                                        : "Project Admin:"}
                                                </h3>
                                                <p className="font-extrabold flex flex-wrap gap-1 text-lg max-w-3/4">
                                                    {projectAdminNames.length >
                                                    0
                                                        ? projectAdminNames.map(
                                                              (
                                                                  admin,
                                                                  index
                                                              ) => (
                                                                  <span
                                                                      key={
                                                                          admin.id
                                                                      }
                                                                      className="py-1 px-2 border-2 border-black/15 dark:border-white/10 rounded-2xl"
                                                                  >
                                                                      {
                                                                          admin.name
                                                                      }
                                                                      {index <
                                                                          projectAdminNames.length -
                                                                              1}
                                                                  </span>
                                                              )
                                                          )
                                                        : "No Admins Assigned"}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 text-sm opacity-50 mt-2">
                                                <h3>Created By:</h3>
                                                <p>{project.created_by.name}</p>
                                            </div>
                                        </div>
                                        <div className="opacity ">
                                            <div className="flex gap-2 flex-nowrap text-nowrap">
                                                <h3 className="font-bold">
                                                    Start Date:
                                                </h3>
                                                <p className="font-extrabold">
                                                    {project.start_date}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 flex-nowrap text-nowrap">
                                                <h3 className="font-bold">
                                                    Deadline:
                                                </h3>
                                                <p className="font-extrabold">
                                                    {project.deadline}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="font-extrabold text-xl">
                                            Description
                                        </h2>
                                        <p className="min-h-64 px-2 py-2 rounded-xl max-h-96 border dark:border-[#353535] overflow-auto">
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-10 lg:gap-2">
                                        <div className="flex flex-col gap-2">
                                            {(isSystemAdmin ||
                                                isProjectAdmin) && (
                                                <p>
                                                    Total Questions:{" "}
                                                    <span className="font-bold">
                                                        {numberOfQuestions}
                                                    </span>
                                                </p>
                                            )}

                                            {!isSystemAdmin &&
                                                !isProjectAdmin && (
                                                    <p>
                                                        Number of Assigned
                                                        Questions:{" "}
                                                        <span className="font-bold">
                                                            {
                                                                assignedQuestionsCount
                                                            }
                                                        </span>
                                                    </p>
                                                )}

                                            <p>
                                                User Group:{" "}
                                                <span className="font-extrabold">
                                                    {project.user_group.name}
                                                </span>
                                            </p>
                                            {(isSystemAdmin ||
                                                isProjectAdmin) && (
                                                <p>
                                                    Participants:{" "}
                                                    <span className="font-bold">
                                                        {userGroupUsers.length}
                                                    </span>
                                                </p>
                                            )}

                                            {!isSystemAdmin &&
                                                !isProjectAdmin &&
                                                sessionProgress &&
                                                Object.keys(
                                                    sessionProgress
                                                ).map((sessionId) => (
                                                    <div key={sessionId}>
                                                        <p>
                                                            Completed
                                                            Session(%):{" "}
                                                            {sessionProgress[
                                                                sessionId
                                                            ][
                                                                currentUser.id
                                                            ].toFixed(0)}
                                                            %
                                                        </p>
                                                    </div>
                                                ))}
                                                <p>
                                                    {" "}
                                                    Completed Project(%):
                                                    <span className="font-bold pl-1">
                                                        {projectCompletionPercentage.toFixed(
                                                            0
                                                        )}
                                                        %
                                                    </span>
                                                </p>
                                        </div>
                                        <div>
                                            {isSystemAdmin ? (
                                                <div className="flex flex-col md:flex-row gap-3">
                                                    <button
                                                        onClick={showResults}
                                                        className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                    >
                                                        View Results
                                                    </button>
                                                    {!project.completed && (
                                                        <>
                                                            <button
                                                                onClick={
                                                                    showModal
                                                                }
                                                                className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                            >
                                                                Edit Questions
                                                            </button>
                                                            <Link
                                                                href={route(
                                                                    "question.create",
                                                                    {
                                                                        project_id:
                                                                            project.id,
                                                                    }
                                                                )}
                                                                className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                            >
                                                                Add Questions
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "project.edit",
                                                                    project.id
                                                                )}
                                                                className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                            >
                                                                Edit Project
                                                            </Link>

                                                            <Link
                                                                href={route(
                                                                    "session.index",
                                                                    {
                                                                        project:
                                                                            project.id,
                                                                    }
                                                                )}
                                                                className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                            >
                                                                Sessions
                                                            </Link>
                                                            {}
                                                            <Link
                                                                href={route(
                                                                    "question.index",
                                                                    {
                                                                        project:
                                                                            project.id,
                                                                    }
                                                                )}
                                                                className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                            >
                                                                Start
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                isProjectAdmin && (
                                                    <div className="flex flex-col md:flex-row gap-3">
                                                        <button
                                                            onClick={
                                                                showResults
                                                            }
                                                            className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                        >
                                                            View Results
                                                        </button>
                                                        {!project.completed && (
                                                            <>
                                                                <button
                                                                    onClick={
                                                                        showModal
                                                                    }
                                                                    className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                                >
                                                                    Edit
                                                                    Questions
                                                                </button>
                                                                <Link
                                                                    href={route(
                                                                        "question.create",
                                                                        {
                                                                            project_id:
                                                                                project.id,
                                                                        }
                                                                    )}
                                                                    className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                                >
                                                                    Add
                                                                    Questions
                                                                </Link>

                                                                <Link
                                                                    href={route(
                                                                        "session.index",
                                                                        {
                                                                            project:
                                                                                project.id,
                                                                        }
                                                                    )}
                                                                    className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                                >
                                                                    Sessions
                                                                </Link>
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                            {project.completed ? (
                                                <>
                                                    <div className="my-3">
                                                        <p className="border-2 py-2 px-3 rounded-full border-black/15 dark:border-white/10">
                                                            This Project is
                                                            completed!
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {sessions.length > 0 ? (
                                                        <>
                                                            {!hasCompletedSession ? (
                                                                <>
                                                                    {isSessionStarted ? (
                                                                        <>
                                                                            {!isProjectAdmin &&
                                                                                !isSystemAdmin &&
                                                                                !hasStartedProject && (
                                                                                    <>
                                                                                        {showStartButton ? (
                                                                                            <div className="flex items-end justify-end">
                                                                                                <Link
                                                                                                    href={route(
                                                                                                        "question.index",
                                                                                                        {
                                                                                                            project:
                                                                                                                project.id,
                                                                                                        }
                                                                                                    )}
                                                                                                    className="bg-black  px-3  dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                                                                >
                                                                                                    Start
                                                                                                </Link>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="flex gap-2 mt-4">
                                                                                                <FaExclamationCircle />
                                                                                                <p className="-mt-1">
                                                                                                    No
                                                                                                    Session
                                                                                                    started
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            {!isProjectAdmin &&
                                                                                !isSystemAdmin &&
                                                                                hasStartedProject &&
                                                                                showContinueButton && (
                                                                                    <div className="flex items-end justify-end">
                                                                                        <Link
                                                                                            href={route(
                                                                                                "question.index",
                                                                                                {
                                                                                                    project:
                                                                                                        project.id,
                                                                                                }
                                                                                            )}
                                                                                            className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                                                        >
                                                                                            Continue
                                                                                        </Link>
                                                                                    </div>
                                                                                )}
                                                                            {!isProjectAdmin &&
                                                                                !isSystemAdmin && (
                                                                                    <>
                                                                                        {showEditButton && (
                                                                                            <div className="flex items-end justify-end">
                                                                                                <Link
                                                                                                    href={route(
                                                                                                        "question.index",
                                                                                                        {
                                                                                                            project:
                                                                                                                project.id,
                                                                                                        }
                                                                                                    )}
                                                                                                    className="bg-black  px-3   text-center dark:bg-white dark:text-black dark:hover:bg-white/90  py-2 rounded-xl hover:bg-black/80 text-white"
                                                                                                >
                                                                                                    Edit
                                                                                                    Answers
                                                                                                </Link>
                                                                                            </div>
                                                                                        )}
                                                                                        {sessionCompleteNoEdit && (
                                                                                            <div>
                                                                                                <p>
                                                                                                    You
                                                                                                    have
                                                                                                    completed
                                                                                                    the
                                                                                                    Session
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                        </>
                                                                    ) : (
                                                                        <div className="flex gap-2 mt-4">
                                                                            <FaExclamationCircle />
                                                                            <p className="-mt-1">
                                                                                No
                                                                                Session
                                                                                started
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <div>
                                                                    <p>
                                                                        Project
                                                                        Completed
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {!isSystemAdmin &&
                                                                !isProjectAdmin && (
                                                                    <div className="text-right mt-3">
                                                                        {nextSessionStartDate &&
                                                                            !isNextSessionAccessible && (
                                                                                <p className="font-extrabold">
                                                                                    Next
                                                                                    session
                                                                                    starts
                                                                                    :{" "}
                                                                                    {
                                                                                        nextSessionStartDate
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                    </div>
                                                                )}
                                                        </>
                                                    ) : (
                                                        <div className="flex gap-2 mt-4">
                                                            <FaExclamationCircle />
                                                            <p className="-mt-1">
                                                                No Sessions
                                                                created
                                                            </p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal for Viewing Questions */}
                <QuestionsModal
                    displayQuestions={displayQuestions}
                    closeModal={closeModal}
                    showDeleteSuccess={showDeleteSuccess}
                    questions={questions}
                    confirmQuestionDeletion={confirmQuestionDeletion}
                />

                {/* Modal for Confirming Deletion */}
                <Modal
                    show={confirmingQuestionDeletion}
                    onClose={closeDeleteModal}
                    className="p-6"
                >
                    <div className="flex flex-col justify-center items-center dark:text-white">
                        <h2 className="text-lg font-semibold">
                            Confirm Deletion
                        </h2>
                        <p className="mt-4">
                            Are you sure you want to delete this question?
                        </p>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={closeDeleteModal}
                                className="bg-white px-4 py-1 rounded-xl hover:bg-[#919393] text-black"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteQuestion}
                                className="bg-red-600 px-4 py-1 rounded-xl hover:bg-red-700 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Modal for Viewing Results */}
                <ResultsModal
                    resultsModal={resultsModal}
                    closeResults={closeResults}
                    searchCompletedUsers={searchCompletedUsers}
                    setSearchCompletedUsers={setSearchCompletedUsers}
                    searchInCompleteUsers={searchInCompleteUsers}
                    setSearchInCompleteUsers={setSearchInCompleteUsers}
                    filteredCompletedUsers={filteredCompletedUsers}
                    filteredInCompleteUsers={filteredInCompleteUsers}
                    userGroupUsers={userGroupUsers}
                    completedUsers={completedUsers}
                    project={project}
                    questions={questions}
                    editSuccess={editSuccess}
                    sessionCompletedUsers={sessionCompletedUsers}
                    numberOfQuestions={numberOfQuestions}
                    completed={completed}
                    canMarkAsComplete={canMarkAsComplete}
                />
            </div>
        </AuthenticatedLayout>
    );
}
