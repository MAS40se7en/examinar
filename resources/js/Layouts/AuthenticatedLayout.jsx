import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import {
    TbBrightnessUp,
    TbBrightnessUpFilled,
    TbMoonFilled,
} from "react-icons/tb";

export default function Authenticated({
    user,
    children,
    bgClass,
    bgDarkClass,
}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    const toggleMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };
    return (
        <div className={`min-h-screen ${darkMode ? bgDarkClass : bgClass} `}>
            <nav className="pt-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 dark:text-white">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-white" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex items-center">
                                <div className="font-extrabold">
                                    {user.role === "admin" ? "ADMIN" : ""}
                                </div>
                                <button onClick={toggleMode} className="">
                                    {darkMode ? (
                                        <TbBrightnessUp className="text-white  " />
                                    ) : (
                                        <TbMoonFilled className="" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center gap-1 sm:ms-6">
                            <NavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                                userRole={user.role}
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                href={route("dashboard.completed_projects")}
                                active={route().current(
                                    "dashboard.completed_projects"
                                )}
                                userRole={user.role}
                            >
                                Completed Projects
                            </NavLink>
                            {user.role === "admin" && (
                                <NavLink
                                    href={route("project.create")}
                                    active={route().current("project.create")}
                                >
                                    Create Project
                                </NavLink>
                            )}
                            {user.role === "admin" && (
                                <>
                                    <NavLink
                                        href={route("user.index")}
                                        active={route().current("user.index")}
                                    >
                                        User Administration
                                    </NavLink>
                                    <NavLink
                                        href={route("groups.index")}
                                        active={route().current("groups.index")}
                                    >
                                        User Groups
                                    </NavLink>
                                </>
                            )}
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className={`${
                                                    user.role === "user"
                                                        ? "hover:text-white"
                                                        : "hover:text-gray-700"
                                                } inline-flex items-center  px-3 py-2 text-sm leading-4 font-medium rounded-md  dark:text-white dark:hover:text-gray-400   focus:outline-none transition ease-in-out duration-150`}
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center gap-2 sm:hidden">
                            <button onClick={toggleMode} className="">
                                {darkMode ? (
                                    <TbBrightnessUp className="text-white h-5 w-5 " />
                                ) : (
                                    <TbMoonFilled className="h-5 w-5" />
                                )}
                            </button>
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block " : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink>
                            Completed Projects
                        </ResponsiveNavLink>
                        {user.role === "admin" && (
                            <ResponsiveNavLink
                                href={route("project.create")}
                                active={route().current("project.create")}
                            >
                                Create Project
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}
