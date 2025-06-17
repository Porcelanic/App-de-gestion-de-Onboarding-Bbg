import React from "react";
import { FaBars } from "react-icons/fa";

interface NavLogoProps {
    onToggleSidebar?: () => void;
    logoText?: string;
    logoHref?: string;
    appTitle?: string;
}

const NavLogo: React.FC<NavLogoProps> = ({
    onToggleSidebar,
    logoText = "",
    logoHref = "/",
    appTitle,
}) => {
    return (
        <div className="flex items-center justify-start rtl:justify-end">
            {onToggleSidebar && (
                <button
                    onClick={onToggleSidebar}
                    data-drawer-target="logo-sidebar"
                    data-drawer-toggle="logo-sidebar"
                    aria-controls="logo-sidebar"
                    type="button"
                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                    <span className="sr-only">Abrir sidebar</span>
                    <FaBars className="w-6 h-6" />
                </button>
            )}

            <a href={logoHref} className="flex ms-2 md:me-24 items-center">
                <img
                    src="../../../../logo.svg"
                    alt="Logo"
                    className="h-8 w-8 me-3"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    {appTitle || logoText}{" "}
                </span>
            </a>
        </div>
    );
};

export default NavLogo;
