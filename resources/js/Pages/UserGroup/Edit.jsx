import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

const Edit = ({ closeEditForm, users, group }) => {
    const { data, setData, patch, processing, errors } = useForm({
        name: "",
        users: [],
    });
    const [displayUsers, setDisplayUsers] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        if (group) {
            setData({
                name: group.name || "",
                users: Array.isArray(group.users) ? group.users : [],
            });
            setSelectedUsers(group.users || []);
        }
    }, [group]);

    const handleUserSelection = (userId) => {
        setSelectedUsers((prevSelectedUser) => {
            return prevSelectedUser.includes(userId)
                ? prevSelectedUser.filter((id) => id !== userId)
                : [...prevSelectedUser, userId];
        });
    };

    const handleAddUsersToGroup = () => {
        setData("users", selectedUsers);
        closeUsers();
    };

    const showUsers = () => {
        setDisplayUsers(true);
    };

    const closeUsers = () => {
        setDisplayUsers(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        patch(route("group.update", group.id), {
            onSuccess: () => {
                setData("name", "");
                setData("users", []);
                closeEditForm();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const filteredUsers = users.data.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="py-12">
            <div className="lg:px-8">
                <div className="sm:rounded-lg flex flex-col items-center w-full">
                    <div className="font-extrabold px-3 w-full text-4xl pb-4 dark:text-white">
                        Edit User Group
                    </div>
                    <div className="p-6 text-gray-900 border rounded-3xl border-gray-300 bg-[#f6f6f6] dark:bg-[#141414] dark:text-white w-full dark:border-[#242424]">
                        <form onSubmit={onSubmit}>
                            <div>
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6 mt-4">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Group Name:"
                                        className="text-nowrap font-bold"
                                    />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] rounded-xl w-full h-8"
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2 text-nowrap"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-14 mt-4">
                                    <InputLabel
                                        htmlFor=""
                                        value="Users:"
                                        className="text-nowrap w-32 font-bold"
                                    />
                                    <button
                                        onClick={showUsers}
                                        type="button"
                                        className="flex items-center justify-center h-8 w-full mt-3 md:mt-0 text-nowrap text-white bg-green-500 px-6 rounded-xl font-bold dark:hover:bg-green-700 hover:bg-green-700 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                    >
                                        Manage Users
                                    </button>

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
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
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
                                                            key={index}
                                                            className="flex gap-2 items-center pb-4 justify-between"
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
                                                                checked={selectedUsers.includes(
                                                                    user.id
                                                                )}
                                                                onChange={() =>
                                                                    handleUserSelection(
                                                                        user.id
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <p className="dark:text-white">
                                                    No users found
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex md:sticky bottom-0 pt-4 dark:border-t-[#373636] bg-white dark:bg-[#141414] px-12 pb-4 border-t border-t-[#cccaca] justify-end gap-4 mt-6">
                                            <button
                                                onClick={closeUsers}
                                                className="bg-red-500 px-6 py-1 rounded-xl font-bold text-white dark:bg-red-700 dark:hover:bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                            >
                                                Close
                                            </button>
                                            <button
                                                onClick={handleAddUsersToGroup}
                                                className="text-white bg-green-500 px-6 py-1 rounded-xl font-bold dark:hover:bg-green-700 hover:bg-green-700 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </Modal>
                                </div>
                                {selectedUsers.length > 0 && (
                                    <div className="mt-4 text-lg">
                                        Selected Users:{" "}
                                        <span>{selectedUsers.length}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={closeEditForm}
                                    className="bg-red-500 px-6 py-1 rounded-xl font-bold text-white dark:bg-red-700 dark:hover:bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="text-white bg-green-500 px-6 py-1 rounded-xl font-bold dark:hover:bg-green-700 hover:bg-green-700 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;
