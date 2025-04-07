import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    userRole,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center px-1 mt-0.5 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? `${
                          userRole === "user"
                              ? "text-white border-[#dcbc0a]"
                              : "text-[#896a0e] dark:text-[#dcbc0a] border-[#white]"
                      } `
                    : "border-transparent  hover:text-gray-500 hover:border-gray-300 focus:text-gray-200 focus:border-gray-300 ") +
                className
            }
        >
            {children}
        </Link>
    );
}
