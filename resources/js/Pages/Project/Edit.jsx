import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import InputError from "@/Components/InputError";
import { FaXmark } from "react-icons/fa6";
import Modal from "@/Components/Modal";

export default function Edit({
    auth,
    users,
    project,
    projectAdmins,
    userGroups,
}) {
    const { data, setData, patch, errors, processing } = useForm({
        name: project.name || "",
        description: project.description || "",
        project_admin: project.project_admin,
        group_id: project.group_id || "",
        start_date: project.start_date || "",
        deadline: project.deadline || "",
    });

    const [displayUsers, setDisplayUsers] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(projectAdmins || []);
    const [selectedGroup, setSelectedGroup] = useState(
        project.user_group || null
    );
    const [displayUserGroups, setDisplayUserGroups] = useState(false);
    const [searchAdmin, setSearchAdmin] = useState("");
    const [searchGroup, setSearchGroup] = useState("");

    const filteredUsers = users.data.filter(
        (user) =>
            user.name.toLowerCase().includes(searchAdmin.toLowerCase()) ||
            user.email.toLowerCase().includes(searchAdmin.toLowerCase())
    );

    const handleUserSelection = (user) => {
        setSelectedUsers((prevSelectedUsers) => {
            const updatedUsers = prevSelectedUsers.find(
                (selectedUser) => selectedUser.id === user.id
            )
                ? prevSelectedUsers.filter(
                      (selectedUser) => selectedUser.id !== user.id
                  )
                : [...prevSelectedUsers, user];

            setData(
                "project_admin",
                updatedUsers.map((u) => u.id)
            );
            return updatedUsers;
        });
    };

    const filterUserGroups = () => {
        const selectedUserIdsSet = new Set(
            selectedUsers.map((user) => user.id)
        );

        if (selectedUserIdsSet.size === 0) {
            return userGroups.data.filter((group) =>
                group.name.toLowerCase().includes(searchGroup.toLowerCase())
            );
        } else {
            return userGroups.data
                .filter((group) => {
                    const groupUsers = Array.isArray(group.users)
                        ? group.users
                        : [];
                    const hasSelectedUser = groupUsers.some((id) =>
                        selectedUserIdsSet.has(id)
                    );

                    return !hasSelectedUser;
                })
                .filter((group) =>
                    group.name.toLowerCase().includes(searchGroup.toLowerCase())
                );
        }
    };

    const filteredGroups = filterUserGroups();

    const handleProjectAdmins = () => {
        setData(
            "project_admin",
            selectedUsers.map((user) => user.id)
        );
        closeUsers();
    };

    const showUsers = () => {
        setDisplayUsers(true);
    };
    const closeUsers = () => {
        setDisplayUsers(false);
    };

    const handleRemoveUser = (userToRemove) => {
        setSelectedUsers((prevSelectedUsers) => {
            const updatedUsers = prevSelectedUsers.filter(
                (user) => user.id !== userToRemove.id
            );
            setData(
                "project_admin",
                updatedUsers.map((u) => u.id)
            );
            return updatedUsers;
        });
    };

    const handleUserGroup = (userGroup, e) => {
        e.preventDefault();
        setSelectedGroup(userGroup);
        setData("group_id", userGroup.id);
        closeUserGroups();
    };

    const showUserGroups = () => {
        setDisplayUserGroups(true);
    };
    const closeUserGroups = () => {
        setDisplayUserGroups(false);
    };

    const handleRemoveGroup = () => {
        setSelectedGroup(null);
        setData("group_id", "");
    };

    const onSubmit = (e) => {
        e.preventDefault();

        patch(route("project.update", project.id), {
            onSuccess: () => {
                console.log("Project updated");
            },
            onError: () => {
                console.log("please fix the data submitted");
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Users
                </h2>
            }
            bgClass={`create-project-bglight`}
            bgDarkClass={`create-project-bgdark`}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="sm:px-6  lg:px-8">
                    <div className="sm:rounded-lg flex flex-col items-center w-full ">
                        <div className="font-extrabold px-3 w-full  lg:w-3/4  text-4xl pb-4 dark:text-white">
                            Update Project
                        </div>
                        <div className="p-6 text-gray-900 border rounded-3xl  border-gray-300 bg-[#d9d9d9] dark:bg-[#141414] dark:text-white dark:border-[#242424] w-full lg:w-3/4">
                            <form onSubmit={onSubmit}>
                                <div className="flex items-center gap-4 md:gap-16 mt-6">
                                    <div className="text-nowrap md:w-32 text-md  font-bold">
                                        Created By:
                                    </div>
                                    <div className="text-nowrap  font-bold">
                                        {auth.user.name}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-14 mt-4">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Project Name:"
                                        className="text-nowrap w-40 font-bold"
                                    />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className=" border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] rounded-xl w-full h-8"
                                        required
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2 text-nowrap"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row mt-4 md:gap-14">
                                    <InputLabel
                                        htmlFor="description"
                                        value="Project Description:"
                                        className=" text-nowrap w-32 font-bold"
                                    />
                                    <textarea
                                        id="description"
                                        type="text"
                                        placeholder="type description text here..."
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl  border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] min-h-64 max-h-64 overflow-scroll"
                                        required
                                    />
                                    <InputError
                                        message={errors.description}
                                        className="mt-2 text-nowrap"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-14 mt-4">
                                    <InputLabel
                                        htmlFor="project_admin"
                                        value="Project Admin:"
                                        className="text-nowrap w-32 font-bold"
                                    />

                                    <Modal
                                        show={displayUsers}
                                        onClose={closeUsers}
                                        className="h-3/4 overflow-scroll rounded-xl"
                                    >
                                        <div className="p-12">
                                            <div className="flex flex-col mb-4 gap-4 sticky top-0 pt-10 border-b border-b-[#bebfbf] w-full bg-white dark:bg-[#141414] dark:text-white pb-4 ">
                                                <div className=" text-xl font-bold ">
                                                    Select Users
                                                </div>
                                                <TextInput
                                                    type="text"
                                                    placeholder="Search users by name or email"
                                                    value={searchAdmin}
                                                    onChange={(e) =>
                                                        setSearchAdmin(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] rounded-xl w-full h-8"
                                                />
                                            </div>
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map(
                                                    (user, index) => (
                                                        <div
                                                            key={user.id}
                                                            className="flex gap-2 items-center pb-4 justify-between "
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {" "}
                                                                <p className="w-6 dark:text-white">
                                                                    {index + 1}.
                                                                </p>
                                                                <InputLabel
                                                                    htmlFor={`user-${user.id}`}
                                                                    value={
                                                                        user.name
                                                                    }
                                                                />
                                                            </div>
                                                            <TextInput
                                                                type="checkbox"
                                                                id={`user-${user.id}`}
                                                                className="w-6 h-6"
                                                                checked={selectedUsers.some(
                                                                    (
                                                                        selectedUser
                                                                    ) =>
                                                                        selectedUser.id ===
                                                                        user.id
                                                                )}
                                                                onChange={() =>
                                                                    handleUserSelection(
                                                                        user
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <p className="dark:text-white text-center">
                                                    No Users found
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex md:sticky bottom-0 pt-4 dark:border-t-[#373636] bg-white dark:bg-[#141414] px-12 pb-4 border-t border-t-[#cccaca] justify-end gap-4 mt-6">
                                            <button
                                                onClick={closeUsers}
                                                className=" bg-red-500  px-6 py-1 rounded-xl font-bold text-white dark:bg-red-700 dark:hover:bg-red-500   hover:bg-red-700 focus:outline-none focus:ring-1  transition ease-in-out duration-150"
                                            >
                                                Close
                                            </button>
                                            <button
                                                onClick={handleProjectAdmins}
                                                className=" text-white bg-green-500 px-6 py-1 rounded-xl font-bold   dark:hover:bg-green-700  hover:bg-green-700 focus:outline-none focus:ring-1  transition ease-in-out duration-150"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </Modal>
                                    <button
                                        type="button"
                                        onClick={showUsers}
                                        className="flex items-center justify-center h-8 w-44 mt-3 lg:mt-0  text-nowrap text-white bg-green-500 px-6 rounded-xl font-bold dark:hover:bg-green-700 hover:bg-green-700 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                    >
                                        Manage
                                    </button>
                                    <InputError
                                        message={errors.project_admin}
                                        className="mt-2 text-nowrap"
                                    />
                                </div>

                                {selectedUsers.length > 0 ? (
                                    <div className="flex  lg:ml-44 flex-col gap-2  mt-4">
                                        {selectedUsers.map((selectedUser) => (
                                            <div
                                                key={selectedUser.id}
                                                className="flex p-2 lg:ml-2 bg-[#f9f7f7d3] dark:bg-[#242424]  justify-between rounded-xl border-[#c3c3c3] dark:border-white/10 pr-7 border  w-96"
                                            >
                                                <div className="flex gap-2 items-center">
                                                    <p className="border-r w-8  text-center border-r-[#cfcfcf] dark:border-r-white">
                                                        {selectedUser.id}
                                                    </p>
                                                    <p className="text-nowrap font-bold">
                                                        {selectedUser.name}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="text-red-500 font-bold ml-10 hover:bg-red-300 dark:hover:bg-white hover:rounded-lg px-2"
                                                    onClick={() =>
                                                        handleRemoveUser(
                                                            selectedUser
                                                        )
                                                    }
                                                >
                                                    <FaXmark />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className=" mt-2 text-red-400">
                                        Please select at least one project
                                        admin!
                                    </p>
                                )}
                                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-14 mt-4">
                                    <label
                                        htmlFor="group_id"
                                        className="text-nowrap w-32 font-bold"
                                    >
                                        User Group:
                                    </label>

                                    <Modal
                                        show={displayUserGroups}
                                        onClose={closeUserGroups}
                                        className="h-3/4 overflow-scroll rounded-xl"
                                    >
                                        <div className="pb-6">
                                            <div className="sticky flex flex-col px-10  pb-4 bg-white top-0 pt-10 border-b dark:bg-[#141414] dark:text-white dark:border-b-[#373636] border-b-[#cccaca] mb-4 text-xl font-bold ">
                                                <div className="flex items-center justify-between">
                                                    <h1>Select A User Group</h1>
                                                    <button
                                                        onClick={
                                                            closeUserGroups
                                                        }
                                                        className="text-red-500 p-2 mb-2 font-bold ml-10 hover:bg-red-300 dark:hover:bg-white hover:rounded-xl"
                                                    >
                                                        <FaXmark />
                                                    </button>
                                                </div>

                                                <TextInput
                                                    type="text"
                                                    placeholder="Search by group name"
                                                    value={searchGroup}
                                                    onChange={(e) =>
                                                        setSearchGroup(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] rounded-xl w-full h-8"
                                                />
                                            </div>
                                            {filteredGroups.length > 0 ? (
                                                filteredGroups.map(
                                                    (userGroup, index) => (
                                                        <div
                                                            key={userGroup.id}
                                                            className="flex gap-2 items-center px-12 pb-2  "
                                                        >
                                                            <InputLabel
                                                                htmlFor={`userGroup-${userGroup.id}`}
                                                                className="p-1 hover:bg-black/10 px-3 rounded-xl  dark:hover:bg-[#434242] hover:cursor-pointer"
                                                                value={
                                                                    userGroup.name
                                                                }
                                                                onClick={(e) =>
                                                                    handleUserGroup(
                                                                        userGroup,
                                                                        e
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <p className="dark:text-white text-center">
                                                    No Groups found
                                                </p>
                                            )}
                                        </div>
                                    </Modal>
                                    <button
                                        type="button"
                                        onClick={showUserGroups}
                                        className="flex items-center justify-center h-8 w-44 mt-3 lg:mt-0 text-nowrap text-white bg-green-500 px-6 rounded-xl font-bold dark:hover:bg-green-700 hover:bg-green-700 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                    >
                                        Manage
                                    </button>
                                </div>
                                <div className="flex  lg:ml-44 flex-col gap-2 md:flex-row md:items-center md:gap-14 mt-4">
                                    {selectedGroup ? (
                                        <div className="flex p-2 lg:ml-2 bg-[#f9f7f7d3] dark:bg-[#242424]  justify-between rounded-xl border-[#c3c3c3] dark:border-white/10 pr-7 border  w-96">
                                            <div className="flex gap-2 items-center">
                                                <p className="border-r w-8 border-r-[#cfcfcf] text-center dark:border-r-white">
                                                    {selectedGroup.id}
                                                </p>
                                                <p className="text-nowrap font-bold">
                                                    {selectedGroup.name}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="text-red-500 font-bold ml-10 hover:bg-red-300 dark:hover:bg-white hover:rounded-lg px-2"
                                                onClick={handleRemoveGroup}
                                            >
                                                <FaXmark />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className=" text-red-400">
                                            Please select a user group!
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-14 mt-6">
                                    <div className="text-nowrap w-32 font-bold">
                                        <InputLabel
                                            htmlFor="start_date"
                                            value="Start Date:"
                                        />
                                    </div>
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        name="start_date"
                                        className="rounded-xl w-full md:w-72 h-8 dark:bg-[#1b1b1b] border-none focus:outline-none focus:ring-0"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                "start_date",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.start_date}
                                        className="mt-2 text-nowrap"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-14 mt-6">
                                    <div className="text-nowrap w-32 font-bold">
                                        <InputLabel
                                            htmlFor="deadline"
                                            value="Deadline:"
                                        />
                                    </div>
                                    <TextInput
                                        id="deadline"
                                        type="date"
                                        name="deadline"
                                        className="rounded-xl w-full md:w-72 h-8 dark:bg-[#1b1b1b] border-none focus:outline-none focus:ring-0"
                                        value={data.deadline}
                                        onChange={(e) =>
                                            setData("deadline", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.deadline}
                                        className="mt-2 text-nowrap"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href={route("project.show", project.id)}
                                        type="submit"
                                        className=" bg-red-500  px-6 py-1 rounded-xl font-bold text-white  dark:bg-red-700 dark:hover:bg-red-500   hover:bg-red-700 focus:outline-none focus:ring-1  transition ease-in-out duration-150"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        disabled={processing}
                                        type="submit"
                                        className=" text-white bg-green-500 px-6 py-1 rounded-xl font-bold   dark:hover:bg-green-700  hover:bg-green-700 focus:outline-none focus:ring-1  transition ease-in-out duration-150"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
