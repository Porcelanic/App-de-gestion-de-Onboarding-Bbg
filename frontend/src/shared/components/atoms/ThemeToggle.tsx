import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export const ThemeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg focus:outline-none"
            onClick={toggleTheme}
            aria-label={
                isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            }
            type="button"
        >
            {isDarkMode ? (
                <FaMoon className="w-6 h-6 text-sky-500 dark:text-yellow-300" />
            ) : (
                <FaSun className="w-6 h-6 text-yellow-400 dark:text-sky-300" />
            )}
        </button>
    );
};
