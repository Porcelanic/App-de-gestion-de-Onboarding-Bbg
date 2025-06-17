import React from "react";
import SidebarLink from "../molecules/SidebarLink";
import { FaRegUser, FaChalkboardTeacher } from "react-icons/fa";
import { ThemeToggle } from "../atoms/ThemeToggle";

interface SidebarNavItem {
    href: string;
    icon: React.ReactNode;
    text: string;
    isActive?: boolean;
}

interface SidebarProps {
    isOpen: boolean;
    navItems?: SidebarNavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    navItems: customNavItems,
}) => {
    const defaultNavItems: SidebarNavItem[] = [
        {
            href: "/dashboard/employee",
            icon: (
                <FaRegUser className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            ),
            text: "Empleados",
            isActive: window.location.pathname.startsWith(
                "/dashboard/employee"
            ),
        },
        {
            href: "/dashboard/onboarding",
            icon: (
                <FaChalkboardTeacher className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            ),
            text: "Onboarding",
            isActive: window.location.pathname.startsWith(
                "/dashboard/onboarding"
            ),
        },
    ];

    const navItems = customNavItems || defaultNavItems;

    return (
        <aside
            id="logo-sidebar"
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between`}
            aria-label="Sidebar"
        >
            <div className="px-3 pb-4 overflow-y-auto">
                <ul className="space-y-2 font-medium">
                    {navItems.map((item) => (
                        <SidebarLink
                            key={item.text}
                            href={item.href}
                            icon={item.icon}
                            text={item.text}
                            isActive={item.isActive}
                        />
                    ))}
                </ul>
            </div>
            <div className="p-4 border-t border-gray-200 dark:text-white dark:border-gray-700 flex flex-row justify-center items-center gap-2">
                <ThemeToggle />
                <span>Cambiar tema</span>
            </div>
        </aside>
    );
};

export default Sidebar;
