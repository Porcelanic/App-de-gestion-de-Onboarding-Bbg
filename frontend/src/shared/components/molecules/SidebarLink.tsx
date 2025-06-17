import React from "react";

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    text: string;
    isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
    href,
    icon,
    text,
    isActive,
}) => {
    return (
        <li>
            <a
                href={href}
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
            >
                {icon}
                <span className="ms-3">{text}</span>
            </a>
        </li>
    );
};

export default SidebarLink;
