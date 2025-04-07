import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import { Transition } from "@headlessui/react";
import { Head, Link, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Create from "./Create";
import Edit from "./Edit";
import TableHeader from "@/Components/TableHeader";

const UserGroup = ({
    users,
    auth,
    success,
    userGroups,
    queryParams = null,
}) => {
    const [confirmingUserGroupDeletion, setConfirmingUserGroupDeletion] =
        useState(false);
    const [userGroupToDelete, setUserGroupToDelete] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [groupForm, setGroupForm] = useState(false);
    const [groupToEdit, setGroupToEdit] = useState(false);
    const [groupEditForm, setGroupEditForm] = useState(false);
    const [searchGroups, setSearchGroups] = useState("");
    queryParams = queryParams || {};
    const handleSearchChange = (e) => {
        setSearchGroups(e.target.value);
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route("groups.index"), {
            search_groups: searchGroups,
            sort_by: queryParams.sort_field,
            sort_direction: queryParams.sort_direction,
        });
    };
    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("groups.index"), queryParams);
    };
    const editGroup = (group) => {
        setGroupEditForm(true);
        setGroupToEdit(group);
        setGroupForm(false);
    };

    const closeEditForm = () => {
        setGroupEditForm(false);
    };
    const showUserGroupForm = () => {
        setGroupForm(true);
        setGroupEditForm(false);
    };
    const closeUserGroupForm = () => {
        setGroupForm(false);
    };
    const confirmUserGroupDeletion = (userGroup) => {
        setConfirmingUserGroupDeletion(true);
        setUserGroupToDelete(userGroup);
    };

    const deleteUserGroup = () => {
        if (userGroupToDelete) {
            router.delete(route("group.destroy", userGroupToDelete.id));
        }
        closeModal();
    };

    const closeModal = () => {
        setConfirmingUserGroupDeletion(false);
        setUserGroupToDelete(null);
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
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Users
                </h2>
            }
            bgClass={`users-bglight`}
            bgDarkClass={`users-bgdark`}
        >
            <Head title="Users" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden  sm:rounded-lg">
                        <div className="flex justify-end pb-2 ">
                            <button
                                onClick={showUserGroupForm}
                                className=" rounded-xl py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white  dark:text-white"
                            >
                                Create New User Group
                            </button>
                        </div>

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
                        <div className="flex flex-col md:flex-row md:gap-10 overflow-auto">
                            <div className="p-6 text-gray-900 order-1 md:order-none  rounded-3xl bg-[#f6f6f6] dark:bg-[#141414] dark:text-white dark:border-[#242424] lg:w-2/4 min-h-[40rem]">
                                <div className="overflow-auto h-[600px]">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex mb-4 gap-4 sticky top-0 w-full bg-[#f6f6f6] dark:bg-[#141414] pb-4 shadow-md"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search by group name"
                                            value={searchGroups}
                                            onChange={handleSearchChange}
                                            className="border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] rounded-xl w-3/4"
                                        />
                                        <button
                                            type="submit"
                                            className="p-2 bg-blue-500 text-white rounded-xl px-4 hover:bg-blue-600"
                                        >
                                            Search
                                        </button>
                                    </form>
                                    <table className="table-auto w-full text-left">
                                        <thead className="border-b-4 border-b-[#898279] dark:border-b-[#312f2d]">
                                            <tr>
                                                <TableHeader
                                                    name="id"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    ID
                                                </TableHeader>
                                                <TableHeader
                                                    name="name"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Group Name
                                                </TableHeader>
                                                <TableHeader
                                                    name="users"
                                                    sort_field={
                                                        queryParams.sort_field
                                                    }
                                                    sort_direction={
                                                        queryParams.sort_direction
                                                    }
                                                    sortChanged={sortChanged}
                                                >
                                                    Users
                                                </TableHeader>

                                                <th className="text-nowrap px-3">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {userGroups.length > 0 ? (
                                                userGroups.map(
                                                    (group, index) => (
                                                        <tr key={index}>
                                                            <td className="border-r-2 py-2 px-3 dark:border-r-[#312f2d]">
                                                                {group.id}
                                                            </td>
                                                            <td className="border-r-2 py-2 px-3 text-nowrap  dark:border-r-[#312f2d]">
                                                                {group.name}
                                                            </td>

                                                            <td className="border-r-2 text-center py-2 px-3 dark:border-r-[#312f2d]">
                                                                {
                                                                    group.users
                                                                        .length
                                                                }
                                                            </td>

                                                            <td className="py-2 px-3 flex gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        editGroup(
                                                                            group
                                                                        )
                                                                    }
                                                                    className="bg-opacity-80 dark:bg-opacity-30 text-white font-semibold mr-2 hover:bg-blue-900 hover:no-underline bg-blue-600 py-2 px-3 rounded-xl"
                                                                >
                                                                    {" "}
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        confirmUserGroupDeletion(
                                                                            group
                                                                        )
                                                                    }
                                                                    className="text-white bg-opacity-80 dark:bg-opacity-30 font-semibold hover:bg-red-900 hover:no-underline bg-red-500 py-2 px-3 rounded-xl"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="py-4 text-center"
                                                    >
                                                        No groups found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    <Modal
                                        show={confirmingUserGroupDeletion}
                                        onClose={closeModal}
                                    >
                                        <div className="p-6">
                                            <h2 className="dark:text-white">
                                                Are you sure you want to delete
                                                the User Group
                                                <span className="font-extrabold">
                                                    " {userGroupToDelete?.name}"
                                                </span>
                                            </h2>
                                            <div className="mt-6 flex justify-end">
                                                <SecondaryButton
                                                    onClick={closeModal}
                                                >
                                                    Cancel
                                                </SecondaryButton>

                                                <DangerButton
                                                    className="ms-3"
                                                    onClick={deleteUserGroup}
                                                >
                                                    Delete Group
                                                </DangerButton>
                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                            {groupForm && (
                                <Create
                                    closeUserGroupForm={closeUserGroupForm}
                                    users={users}
                                />
                            )}
                            {groupEditForm && (
                                <Edit
                                    closeEditForm={closeEditForm}
                                    users={users}
                                    group={groupToEdit}
                                />
                            )}
                        </div>

                        {/* pagination */}
                        {/* <Pagination links={userGroupss.links} auth={auth} /> */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UserGroup;
