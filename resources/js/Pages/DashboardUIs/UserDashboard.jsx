import Pagination from "@/Components/Pagination";
import TableHeader from "@/Components/TableHeader";
import { Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";

const UserDashboard = ({ projects, auth, queryParams = null, error }) => {
    const [search, setSearch] = useState("");

    queryParams = queryParams || {};
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
                <div className="overflow-hidden  sm:rounded-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="font-extrabold px-3  text-3xl pb-4 dark:text-white">
                            My Projects
                        </h2>
                        <Link
                            href={route("project.admin")}
                            className="pb-2 hover:text-white hover:underline dark:text-white"
                        >
                            Projects you administer
                        </Link>
                    </div>
                    <div className="p-6 text-gray-900 overflow-auto rounded-3xl border-gray-300 bg-[#f6f6f6] dark:bg-[#141414] dark:text-white dark:border-[#242424] min-h-[600px] max-h-[700px]">
                        <div className="ml-16">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex mb-4 gap-4  md:w-2/4 "
                            >
                                <input
                                    type="text"
                                    placeholder="Search project name or admin name"
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="border-[#bcbcbc] border dark:border-[#3e3d3f] dark:bg-[#1b1b1b] rounded-xl w-full  md:w-3/4"
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
                                        <th className="text-nowrap px-3">
                                            Description
                                        </th>
                                        <th className="px-3 py-2">
                                            Project Admin
                                        </th>
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
                                        <th className="text-nowrap px-3 items-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {projects.data.length > 0 ? (
                                        projects.data.map((project, index) => (
                                            <tr key={index}>
                                                <td className="border-r-2 py-2 px-3 dark:border-r-[#312f2d]">
                                                    {project.id}
                                                </td>
                                                <td className="border-r-2 py-2 px-3 text-left dark:border-r-[#312f2d]">
                                                    <Link
                                                        href={route(
                                                            "project.show",
                                                            project.id
                                                        )}
                                                        className="py-2 px-2 hover:bg-white  dark:hover:bg-[#3e3e3e]"
                                                    >
                                                        {project.name.length >
                                                        50
                                                            ? project.name.slice(
                                                                  0,
                                                                  50
                                                              ) + "..."
                                                            : project.name}
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
                                                <td className="border-r-2  py-2 px-3 text-nowrap dark:border-r-[#312f2d]">
                                                    <AdminList
                                                        admins={
                                                            project.project_admins
                                                        }
                                                    />
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
                                                        className="px-6 py-2 rounded-xl text-white dark:bg-green-700 dark:hover:bg-green-800 hover:bg-green-700 bg-green-500"
                                                    >
                                                        Start
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="py-4 text-center "
                                            >
                                                No Projects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination links={projects.links} auth={auth} />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
