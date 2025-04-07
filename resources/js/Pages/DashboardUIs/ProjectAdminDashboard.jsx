import Pagination from "@/Components/Pagination";
import { Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import TableHeader from "@/Components/TableHeader";

const ProjectAdminDashboard = ({
    auth,
    administeredProjects,
    queryParams = null,
}) => {
    const [search, setSearch] = useState("");
    queryParams = queryParams || {};
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route("project.admin"), {
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
        router.get(route("project.admin"), queryParams);
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
            bgClass="user-bglight"
            bgDarkClass="user-bgdark"
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden  sm:rounded-lg">
                        <div className="flex justify-between items-center">
                            <h2 className="font-extrabold px-3  text-3xl pb-4 dark:text-white">
                                My Projects
                            </h2>
                            <Link
                                href={route("dashboard")}
                                className="pb-2 hover:text-white hover:underline dark:text-white"
                            >
                                Projects to start
                            </Link>
                        </div>
                        <div className="p-6 text-gray-900 overflow-auto rounded-3xl border-gray-300 bg-[#f6f6f6] dark:bg-[#141414] dark:text-white dark:border-[#242424] min-h-[600px] max-h-[700px]">
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
                            <div className=" overflow-auto">
                                <table className="table-auto w-full text-left overflow-scroll">
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
                                                Project Name
                                            </TableHeader>
                                            <th className="text-nowrap px-3">
                                                Description
                                            </th>
                                            <TableHeader
                                                name="user_group"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                User Group
                                            </TableHeader>
                                            <TableHeader
                                                name="created_by"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Created By
                                            </TableHeader>
                                            <TableHeader
                                                name="start_date"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Start Date
                                            </TableHeader>
                                            <TableHeader
                                                name="deadline"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
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
                                        {administeredProjects.data.length >
                                        0 ? (
                                            administeredProjects.data.map(
                                                (project, index) => (
                                                    <tr
                                                        key={index}
                                                        className=""
                                                    >
                                                        <td className="border-r-2 py-2 px-3 dark:border-r-[#312f2d]">
                                                            {project.id}
                                                        </td>
                                                        <td className="border-r-2 py-2 px-3  dark:border-r-[#312f2d]">
                                                            <Link
                                                                href={route(
                                                                    "project.show",
                                                                    project.id
                                                                )}
                                                                className="py-2 px-2 hover:bg-white  dark:hover:bg-[#3e3e3e]"
                                                            >
                                                                {project.name}
                                                            </Link>
                                                        </td>
                                                        <td className="border-r-2 text py-2 px-3 dark:border-r-[#312f2d]">
                                                            {project.description
                                                                .length > 50
                                                                ? project.description.slice(
                                                                      0,
                                                                      50
                                                                  ) + "..."
                                                                : project.description}
                                                        </td>
                                                        <td className="border-r-2 py-2 px-3 dark:border-r-[#312f2d]">
                                                            {
                                                                project
                                                                    .user_group
                                                                    .name
                                                            }
                                                        </td>
                                                        <td className="border-r-2 text-nowrap py-2 px-3 dark:border-r-[#312f2d]">
                                                            {
                                                                project
                                                                    .created_by
                                                                    .name
                                                            }
                                                        </td>
                                                        <td className="border-r-2 py-2 px-3 text-nowrap dark:border-r-[#312f2d]">
                                                            {project.start_date}
                                                        </td>
                                                        <td className="border-r-2 dark:border-r-[#312f2d] py-2 px-3 text-nowrap">
                                                            {project.deadline}
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <Link
                                                                href={route(
                                                                    "project.show",
                                                                    project.id
                                                                )}
                                                                className="bg-blue-500 dark:bg-blue-500/60 px-3 py-2 text-nowrap rounded-xl hover:bg-blue-700 dark:hover:bg-blue-700/60 text-white"
                                                            >
                                                                Manage Project
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="py-4 text-center text-gray-500 dark:text-gray-400"
                                                >
                                                    No Projects found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* pagination */}
                        <Pagination
                            links={administeredProjects.links}
                            auth={auth}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProjectAdminDashboard;
