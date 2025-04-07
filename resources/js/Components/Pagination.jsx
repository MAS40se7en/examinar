import { Link } from "@inertiajs/react";
import React from "react";

const Pagination = ({ links, auth }) => {
    return (
        <nav className="text-center mt-4">
            <ul className="inline-flex items-center font-bold space-x-2">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.url || ""}
                            className={`inline-block py-2 px-3 rounded-lg text-xs ${
                                link.active
                                    ? ` ${
                                          auth.user.role === "user"
                                              ? "text-white bg-black"
                                              : "text-black bg-white"
                                      }`
                                    : link.url
                                    ? `${
                                          auth.user.role === "user"
                                              ? "text-black hover:text-white hover:bg-black dark:text-white"
                                              : "text-white hover:bg-white hover:text-black"
                                      } `
                                    : `${
                                          auth.user.role === "user"
                                              ? "text-black cursor-not-allowed dark:text-white"
                                              : "text-white cursor-not-allowed"
                                      } `
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        ></Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
