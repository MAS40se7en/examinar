import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { Transition } from "@headlessui/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TableHeader from "@/Components/TableHeader";

export default function Index({ auth, users, queryParams = null, success }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    queryParams = queryParams || {};
    // Search and sort states
    const [search, setSearch] = useState("");
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
        router.get(route("user.index"), queryParams);
    };
    const confirmUserDeletion = (user) => {
        setConfirmingUserDeletion(true);
        setUserToDelete(user);
    };

    const deleteUser = () => {
        if (userToDelete) {
            router.delete(route("user.destroy", userToDelete.id));
        }
        closeModal();
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setUserToDelete(null);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route("user.index"), {
            search,
        });
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

    const UserRoleDropDown = ({ user }) => {
        const handleRoleChange = (event) => {
            const newRole = event.target.value;

            router.patch(route("user.update", { user: user.id }), {
                role: newRole,
            });
        };

        return (
            <SelectInput value={user.role} onChange={handleRoleChange}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </SelectInput>
        );
    };

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
            <Transition
                show={showSuccess}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="bg-emerald-500 mt-4 ml-44 mx-44 py-2 mb-4 px-4 text-white rounded">
                    {success}
                </div>
            </Transition>

            <div className="py-12 flex flex-col lg:flex-row lg:gap-10 md:px-10 lg:px-0 justify-center">
                <div className="p-6 text-gray-900 order-1 lg:order-none rounded-3xl bg-[#f6f6f6] dark:bg-[#141414] dark:text-white dark:border-[#242424] lg:w-2/4 min-h-[40rem]">
                    <div className="h-[600px] overflow-scroll">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex mb-4 gap-4 sticky top-0 w-full bg-[#f6f6f6] dark:bg-[#141414] pb-4 shadow-md"
                        >
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={search}
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

                        <table className="w-full text-center">
                            <thead className="sticky top-0 bg-[#f6f6f6] dark:bg-[#141414] border-b-4 border-b-[#898279] dark:border-b-[#312f2d]">
                                <tr className="">
                                    <th></th>
                                    <TableHeader
                                        name="name"
                                        sort_field={queryParams.sort_field}
                                        sort_direction={
                                            queryParams.sort_direction
                                        }
                                        sortChanged={sortChanged}
                                    >
                                        Users
                                    </TableHeader>
                                    <th className="text-nowrap px-3">Role</th>
                                    <th className="text-nowrap px-3"></th>
                                </tr>
                            </thead>

                            <tbody className="">
                                {users.data.length > 0 ? (
                                    users.data.map((user, index) => (
                                        <tr key={index} className="">
                                            <td className="border-r-2 py-2 px-3 dark:border-r-[#312f2d]">
                                                {index + 1}
                                            </td>
                                            <td className="border-r-2 py-2 text-left px-3 dark:border-r-[#312f2d]">
                                                <Link
                                                    href={route(
                                                        "user.show",
                                                        user.id
                                                    )}
                                                    className="p-2 hover:bg-black/10 px-4 rounded-xl dark:hover:bg-[#242424]"
                                                >
                                                    {user.name}
                                                </Link>
                                            </td>
                                            <td className="border-r-2 text-center py-2 px-3 dark:border-r-[#312f2d]">
                                                <UserRoleDropDown user={user} />
                                            </td>
                                            <td className="py-2 px-3 flex justify-between">
                                                <button
                                                    onClick={() =>
                                                        confirmUserDeletion(
                                                            user
                                                        )
                                                    }
                                                    className="text-white bg-opacity-80 dark:bg-opacity-30 font-semibold hover:bg-red-900 hover:no-underline bg-red-500 py-2 px-3 rounded-xl"
                                                >
                                                    Delete User
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-4">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Modal
                            show={confirmingUserDeletion}
                            onClose={closeModal}
                        >
                            <div className="p-6">
                                <h2 className="dark:text-white">
                                    Are you sure you want to delete this User{" "}
                                    <span className="font-extrabold">
                                        "{userToDelete?.name}"
                                    </span>
                                </h2>
                                <div className="mt-6 flex justify-end">
                                    <SecondaryButton onClick={closeModal}>
                                        Cancel
                                    </SecondaryButton>

                                    <DangerButton
                                        className="ms-3"
                                        onClick={deleteUser}
                                    >
                                        Delete User
                                    </DangerButton>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
                <div className="flex flex-col ml-8 lg:ml-0 justify-end mb-6 lg:mb-32 gap-4 dark:text-white font-bold">
                    <h2 className="text-4xl font-extrabold">User Management</h2>
                    <p>Change Roles</p>
                    <ul className="list-disc">
                        <li className="">Admin</li>
                        <li>User</li>
                    </ul>
                    <p>Remove a user from the system.</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
