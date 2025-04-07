import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeader from "@/Components/TableHeader";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const AdminDashboard = ({ projects, auth, queryParams = null, success }) => {
    const [confirmingProjectDeletion, setConfirmingProjectDeletion] =
        useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    queryParams = queryParams || {};
    const [search, setSearch] = useState("");
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route("dashboard"), {
            search: search,
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
        router.get(route("dashboard"), queryParams);
    };
    const confirmProjectDeletion = (project) => {
        setConfirmingProjectDeletion(true);
        setProjectToDelete(project);
    };

    const deleteProject = () => {
        if (projectToDelete) {
            router.delete(route("project.destroy", projectToDelete.id));
        }
        closeModal();
    };

    const closeModal = () => {
        setConfirmingProjectDeletion(false);
        setProjectToDelete(null);
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

    const AdminList = ({ admins }) => {
        if (!admins || admins.length === 0) {
            return <li className="list-none">No Admins Assigned</li>;
        }

        if (admins.length === 1) {
            return <li className="list-none">{admins[0].name}</li>;
        }

        const firstAdmin = admins[0];
        const remainingCount = admins.length - 1;

        return (
            <li className="list-none">
                {firstAdmin.name}
                {remainingCount > 0 && `, +${remainingCount} more`}
            </li>
        );
    };

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="overflow-hidden sm:rounded-lg">
                    <h2 className="font-extrabold px-3 text-3xl pb-4 dark:text-white">
                        My Projects
                    </h2>
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

                    <div className="p-6 text-gray-900 rounded-3xl bg-[#f6f6f6] dark:bg-[#141414] dark:text-white dark:border-[#242424]">
                        <div className="ml-16">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex mb-4 gap-4  md:w-3/4 "
                            >
                                <input
                                    type="text"
                                    placeholder="Search by project name, group name, or admin name"
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] rounded-xl w-full md:w-3/4"
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-blue-500 text-white rounded-xl px-4 hover:bg-blue-600"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                        <div className="overflow-auto">
                            <table className="table-auto w-full text-left">
                                <thead className="border-b-4 border-b-[#898279] dark:border-b-[#312f2d]">
                                    <tr>
                                        <TableHeader
                                            name="id"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            ID
                                        </TableHeader>
                                        <TableHeader
                                            name="name"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Project Name
                                        </TableHeader>
                                        <th className="px-3 py-2">
                                            Project Admin
                                        </th>
                                        <TableHeader
                                            name="user_group"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            User Group
                                        </TableHeader>
                                        <TableHeader
                                            name="start_date"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Start Date
                                        </TableHeader>
                                        <TableHeader
                                            name="deadline"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={
                                                queryParams.sort_direction
                                            }
                                            sortChanged={sortChanged}
                                        >
                                            Deadline
                                        </TableHeader>
                                        <th className="text-nowrap px-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {projects ? (
                                        projects.data.map((project) => (
                                            <tr key={project.id}>
                                                <td className="border-r-2 py-2 px-3 dark:border-r-[#312f2d]">
                                                    {project.id}
                                                </td>
                                                <td className="border-r-2 py-2 px-3 dark:border-r-[#312f2d]">
                                                    <Link
                                                        href={route(
                                                            "project.show",
                                                            project.id
                                                        )}
                                                        className="py-2 px-2 hover:bg-white dark:hover:bg-[#3e3e3e]"
                                                    >
                                                        {project.name}
                                                    </Link>
                                                </td>
                                                <td className="border-r-2  py-2 px-3 dark:border-r-[#312f2d]">
                                                    <AdminList
                                                        admins={
                                                            project.project_admins
                                                        }
                                                    />
                                                </td>
                                                <td className="border-r-2  py-2 px-3 dark:border-r-[#312f2d]">
                                                    {project.user_group
                                                        ? project.user_group
                                                              .name
                                                        : "N/A"}
                                                </td>
                                                <td className="border-r-2 py-2 px-3 text-nowrap dark:border-r-[#312f2d]">
                                                    {project.start_date}
                                                </td>
                                                <td className="border-r-2 py-2 px-3 text-nowrap dark:border-r-[#312f2d]">
                                                    {project.deadline}
                                                </td>
                                                <td className="py-2 px-3 flex gap-3">
                                                    <Link
                                                        href={route(
                                                            "project.edit",
                                                            project.id
                                                        )}
                                                        className="bg-opacity-80 dark:bg-opacity-30 text-white font-semibold mr-2 hover:bg-blue-900 hover:no-underline bg-blue-600 py-2 px-3 rounded-xl"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            confirmProjectDeletion(
                                                                project
                                                            )
                                                        }
                                                        className="text-white bg-opacity-80 dark:bg-opacity-30 font-semibold hover:bg-red-900 hover:no-underline bg-red-500 py-2 px-3 rounded-xl"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="py-4 text-center"
                                            >
                                                No projects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <Modal
                                show={confirmingProjectDeletion}
                                onClose={closeModal}
                            >
                                <div className="p-6">
                                    <h2 className="dark:text-white">
                                        Are you sure you want to delete the
                                        project{" "}
                                        <span className="font-extrabold">
                                            "{projectToDelete?.name}"
                                        </span>
                                    </h2>
                                    <div className="mt-6 flex justify-end">
                                        <SecondaryButton onClick={closeModal}>
                                            Cancel
                                        </SecondaryButton>

                                        <DangerButton
                                            className="ms-3"
                                            onClick={deleteProject}
                                        >
                                            Delete Project
                                        </DangerButton>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                    {/* pagination */}
                    <Pagination links={projects.links} auth={auth} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
