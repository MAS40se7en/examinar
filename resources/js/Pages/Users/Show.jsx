import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useRef } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { Transition } from "@headlessui/react";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import TableHeader from "@/Components/TableHeader";

export default function Show({
    auth,
    adminProjects,
    participantProjects,
    user,
}) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        patch,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        password: "",
        password_confirmation: "",
    });

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

    const updatePassword = (e) => {
        e.preventDefault();

        patch(route("user.password_update", user.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setDisplayPassword(false);
            },
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }
            },
        });
    };
    const [displayPassword, setDisplayPassword] = useState(false);
    const showResetPassword = () => setDisplayPassword(!displayPassword);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Profile
                </h2>
            }
            bgClass={`profile-bglight`}
            bgDarkClass={`profile-bgdark`}
        >
            <Head title="Profile" />

            <div className="py-12   ">
                <div className=" w-full flex flex-col  items-center justify-center sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-[#141414] w-3/4  shadow rounded-3xl ">
                        <section className={` dark:text-white`}>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Profile Information
                                </h2>
                                

                                <p className="mt-1 text-sm text-gray-600 dark:text-white">
                                    You can update the user's password here!
                                </p>
                            </header>

                            <form className="mt-6 space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center gap-5">
                                    <div className="flex items-center gap-5">
                                        <InputLabel
                                            value="Name:"
                                            className="md:w-32 "
                                        />
                                        <p className="font-bold">{user.name}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-5">
                                    <div className="flex items-center gap-5">
                                        <InputLabel
                                            value="Email:"
                                            className="md:w-32 "
                                        />
                                        <p className="font-bold">
                                            {user.email}
                                        </p>
                                    </div>
                                    {user.email_verified_at ? (
                                        <span className="text-green-700 block text-sm  dark:text-green-400">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="text-red-700 text-sm dark:text-red-500 ">
                                            Unverified
                                        </span>
                                    )}

                                    <InputError className="mt-2" />
                                </div>

                                <div className="flex items-center gap-5">
                                    <InputLabel
                                        htmlFor="role"
                                        value="Role:"
                                        className="md:w-32 "
                                    />
                                    <p className="font-bold">
                                        {user.role.toUpperCase()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 border-b-4 border-b-[#898279] py-4">
                                    <PrimaryButton
                                        type="button"
                                        onClick={showResetPassword}
                                        className="bg-green-600"
                                    >
                                        Reset Password
                                    </PrimaryButton>

                                    {/* <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-green-600">
                                            Saved.
                                        </p>
                                    </Transition> */}
                                </div>
                            </form>
                        </section>
                        {displayPassword && (
                            <section className={``}>
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Update Password
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-600 dark:text-white">
                                        Ensure your account is using a long,
                                        random password to stay secure.
                                    </p>
                                </header>

                                <form
                                    onSubmit={updatePassword}
                                    className="mt-6 space-y-6 w-full"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                                        <InputLabel
                                            htmlFor="password"
                                            value="New Password:"
                                            className="w-32"
                                        />

                                        <TextInput
                                            id="password"
                                            ref={passwordInput}
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            type="password"
                                            className="mt-1 block md:w-96  border-[#bcbcbc] dark:border-[#3e3d3f] dark:text-white dark:bg-[#1b1b1b]"
                                            autoComplete="new-password"
                                        />

                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center gap-5 w-full">
                                        <InputLabel
                                            htmlFor="password_confirmation"
                                            value="Confirm Password:"
                                            className="w-32 text-nowrap"
                                        />

                                        <TextInput
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            type="password"
                                            className="mt-1 block md:w-96  border-[#bcbcbc] dark:border-[#3e3d3f]  dark:text-white dark:bg-[#1b1b1b]"
                                            autoComplete="new-password"
                                        />

                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PrimaryButton
                                            className="bg-green-600"
                                            disabled={processing}
                                        >
                                            Save Password
                                        </PrimaryButton>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600">
                                                Saved.
                                            </p>
                                        </Transition>
                                    </div>
                                </form>
                            </section>
                        )}
                    </div>
                    <div className="p-4 rounded-3xl sm:p-8 bg-white dark:bg-[#141414] w-3/4  shadow">
                        <h1 className="mb-3 text-xl dark:text-white">
                            Admin of:
                        </h1>
                        <section className="dark:text-white overflow-auto">
                            <table className="table-auto w-full text-left">
                                <thead className="border-b-4 border-b-[#898279] dark:border-b-[#312f2d]">
                                    <tr>
                                        <th name="id">ID</th>
                                        <th name="name">Project Name</th>
                                        <th className="text-nowrap px-3">
                                            Description
                                        </th>
                                        <th name="admin">Project Admin</th>
                                        <th name="start_date">Start Date</th>
                                        <th name="deadline">Deadline</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {adminProjects ? (
                                        adminProjects.map((project, index) => (
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
                                                        className="py-2 hover:bg-white  dark:hover:bg-[#3e3e3e]"
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
                                                        className="bg-blue-500 dark:bg-blue-500/60 px-3 py-2 text-nowrap rounded-xl hover:bg-blue-700 dark:hover:bg-blue-700/60 text-white"
                                                    >
                                                        Manage Project
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
                        </section>
                    </div>
                    <div className="p-4 rounded-3xl sm:p-8 bg-white dark:bg-[#141414] w-3/4  shadow">
                        <h1 className="mb-3 text-xl dark:text-white">
                            Participant in:
                        </h1>
                        <section className="dark:text-white overflow-auto">
                            <table className="table-auto w-full text-left">
                                <thead className="border-b-4 border-b-[#898279] dark:border-b-[#312f2d]">
                                    <tr>
                                        <th name="id">ID</th>
                                        <th name="name">Project Name</th>
                                        <th className="text-nowrap px-3">
                                            Description
                                        </th>
                                        <th name="admin">Project Admin</th>
                                        <th name="start_date">Start Date</th>
                                        <th name="deadline">Deadline</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {participantProjects ? (
                                        participantProjects.map(
                                            (project, index) => (
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
                                                            className="py-2 hover:bg-white  dark:hover:bg-[#3e3e3e]"
                                                        >
                                                            {project.name
                                                                .length > 50
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
                                                colSpan="7"
                                                className="py-4 text-center "
                                            >
                                                No Projects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
