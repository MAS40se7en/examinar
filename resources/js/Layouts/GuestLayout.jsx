import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { TbBrightnessUp, TbMoonFilled } from "react-icons/tb";
import { useState, useEffect } from "react";

export default function Guest({ children, icon }) {
    // setting dark mode
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    // get theme on load
    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    // toggle between the modes
    const toggleMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };
    return (
        <div
            className={`min-h-screen  flex flex-col pt-6 sm:pt-0 bglight ${
                darkMode ? "bgdark" : ""
            }`}
        >
            <div className="mt-10 px-10 flex justify-end fixed right-0">
                <button onClick={toggleMode}>
                    {darkMode ? (
                        <TbBrightnessUp className="text-xl text-white " />
                    ) : (
                        <TbMoonFilled className="text-xl" />
                    )}
                </button>
            </div>
            <div className="min-h-screen flex flex-col justify-center md:flex-row md:justify-between pt-6 sm:pt-0">
                <div className="w-full sm:max-w-md md:ml-8 order-1 md:order-none  px-6 py-4 md:mt-32  overflow-hidden sm:rounded-lg">
                    {children}
                </div>
                <div className="w-full  sm:max-w-md flex items-center justify-center md:items-start  px-6 py-4 md:mt-32  overflow-hidden sm:rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );
}
