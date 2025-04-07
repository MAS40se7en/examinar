import Pagination from "@/Components/Pagination";
import { Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import TableHeader from "@/Components/TableHeader";
import Create from "./Create";
import Modal from "@/Components/Modal";
import { Transition } from "@headlessui/react";
import Edit from "./Edit";

const Index = ({
    auth,
    project,
    sessions,
    userGroup,
    totalQuestions,
    assignedQuestions,
    questionsLeft,
    numberOfUsersInGroup,
    defaultStartDate,
    isStartDateDisabled,
    success,
    deleteButton,
}) => {
    console.log("sessions", sessions);
    console.log("project", project);
    console.log("total questions", totalQuestions);
    console.log("assginedQuestions", assignedQuestions);
    console.log("questions left", questionsLeft);
    const [createSession, setCreateSession] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [sessionToEdit, setSessionToEdit] = useState(false);
    const [sessionEditForm, setSessionEditForm] = useState(false);
    const [confirmingSessionDeletion, setConfirmingSessionDeletion] =
        useState(false);

    const [showSuccess, setShowSuccess] = useState(false);
    const showCreateSession = () => {
        setCreateSession(true);
        setSessionEditForm(false);
    };
    const closeCreateSession = () => setCreateSession(false);
    const confirmSessionDeletion = (session) => {
        setConfirmingSessionDeletion(true);
        setSessionToDelete(session);
    };

    const editSession = (session) => {
        setSessionEditForm(true);
        setSessionToEdit(session);
        setCreateSession(false);
        console.log(session);
    };

    const closeEditSession = () => setSessionEditForm(false);
    const deleteSession = () => {
        if (sessionToDelete) {
            router.delete(
                route("session.destroy", [project.id, sessionToDelete.id])
            );
        }
        closeDeleteModal();
        setSessionEditForm(false);
        setCreateSession(false);
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

    const closeDeleteModal = () => {
        setConfirmingSessionDeletion(false);
        setSessionToDelete(null);
    };

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
                        <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-0  gap-2">
                            <div className=" w-full order-1 md:order-none">
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
                                <h2 className="font-extrabold px-3 text-3xl  pb-4 dark:text-white">
                                    {" "}
                                    Sessions
                                </h2>

                                <div className="pb-4">
                                    <p className="px-3 font-extrabold dark:text-white text-xl ">
                                        Project Name:{" "}
                                        <Link
                                            href={route(
                                                "project.show",
                                                project.id
                                            )}
                                            className="py-2 px-2 rounded-xl hover:underline hover:bg-white dark:hover:bg-[#3e3e3e]"
                                        >
                                            {project.name}
                                        </Link>
                                    </p>
                                    <p className="px-3 font-extrabold dark:text-white text-md">
                                        Start Date: {project.start_date}
                                    </p>
                                    <p className="px-3 font-extrabold dark:text-white text-md pb-2 ">
                                        End Date: {project.deadline}
                                    </p>
                                    <ul className="font-bold px-6 list-disc dark:text-white">
                                        <li>Group Name: {userGroup.name}</li>
                                        <li>
                                            Number of Questions:{" "}
                                            {totalQuestions}
                                        </li>
                                        <li>
                                            Number of Questions Assigned:{" "}
                                            {assignedQuestions}
                                        </li>
                                        <li>
                                            Number of Questions left:{" "}
                                            {questionsLeft}
                                        </li>
                                        <li>
                                            Number of Users in the User Group:{" "}
                                            {numberOfUsersInGroup}
                                        </li>
                                    </ul>
                                </div>

                                <div className="overflow-auto w-full grid grid-flow-row xl:grid-cols-2  ">
                                    {sessions.data.length ? (
                                        sessions.data.map((session, index) => (
                                            <div
                                                key={index}
                                                className="p-6 text-gray-900 border overflow-auto mb-3  rounded-3xl border-gray-300 bg-[#f6f6f6] dark:bg-[#141414] dark:text-white dark:border-[#242424] min-h-[150px] max-h-[500px]  xl:w-96 "
                                            >
                                                <ul className="font-bold">
                                                    <li>
                                                        Session: {session.id}
                                                    </li>

                                                    <li>
                                                        Start Date:{" "}
                                                        {session.start_date}
                                                    </li>
                                                    <li>
                                                        End Date:{" "}
                                                        {session.end_date}
                                                    </li>
                                                    <li>
                                                        Number of Questions
                                                        Assigned Per User:{" "}
                                                        {
                                                            session.number_of_questions
                                                        }
                                                    </li>
                                                </ul>
                                                <div className="flex items-center gap-4 mt-4">
                                                    <button
                                                        onClick={() =>
                                                            editSession(session)
                                                        }
                                                        className="text-white  dark:bg-opacity-30 font-semibold hover:bg-green-900  bg-green-500 py-1 px-3 rounded-xl"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            confirmSessionDeletion(
                                                                session
                                                            )
                                                        }
                                                        className="text-white bg-opacity-80 dark:bg-opacity-30 font-semibold hover:bg-red-900  bg-red-500 py-1 px-3 rounded-xl"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                            <div className=" min-w-96 ">
                                <div className="flex  justify-end">
                                    <button
                                        onClick={showCreateSession}
                                        className="bg-green-500 px-4 py-1 rounded-lg hover:bg-green-700 text-white"
                                    >
                                        Create Session
                                    </button>
                                </div>

                                <div className="">
                                    {createSession && (
                                        <Create
                                            auth={auth}
                                            project={project}
                                            userGroup={userGroup}
                                            defaultStartDate={defaultStartDate}
                                            isStartDateDisabled={
                                                isStartDateDisabled
                                            }
                                            closeCreateSession={
                                                closeCreateSession
                                            }
                                            success={success}
                                        />
                                    )}
                                    {sessionEditForm && (
                                        <Edit
                                            auth={auth}
                                            project={project}
                                            userGroup={userGroup}
                                            defaultStartDate={defaultStartDate}
                                            isStartDateDisabled={
                                                isStartDateDisabled
                                            }
                                            success={success}
                                            session={sessionToEdit}
                                            closeEditSession={closeEditSession}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pb-4 ">
                            <Modal
                                show={confirmingSessionDeletion}
                                onClose={closeDeleteModal}
                                className="p-6"
                            >
                                <div className="flex flex-col justify-center items-center dark:text-white">
                                    <h2 className="text-lg font-semibold">
                                        Confirm Deletion
                                    </h2>
                                    <p className="mt-4">
                                        Are you sure you want to delete this
                                        session?
                                    </p>
                                    <div className="flex gap-4 mt-4">
                                        <button
                                            onClick={closeDeleteModal}
                                            className="bg-white px-4 py-1 rounded-xl hover:bg-[#919393] text-black"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={deleteSession}
                                            className="bg-red-600 px-4 py-1 rounded-xl hover:bg-red-700 text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                        {sessions.data.length > 0 && (
                            <Pagination links={sessions.links} auth={auth} />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
