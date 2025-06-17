import React, { useState, useEffect, useRef } from "react";
import Avatar from "../atoms/Avatar";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

interface UserMenuProps {
    userName: string;
    userEmail: string;
    avatarSrc: string;
    onSignOut: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
    userName,
    userEmail,
    avatarSrc,
    onSignOut,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center">
            <div className="flex items-center ms-3 relative">
                <div>
                    <button
                        type="button"
                        onClick={toggleMenu}
                        className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        id="user-menu-button"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                    >
                        <span className="sr-only">Open user menu</span>
                        <Avatar
                            src={avatarSrc}
                            alt="User Avatar"
                            className="h-8 w-8 text-slate-900 dark:text-white"
                        />
                    </button>
                </div>
                {isOpen && (
                    <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 top-full z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                        id="dropdown-user"
                        style={{ top: "100%" }}
                    >
                        <div className="px-4 py-3">
                            <p className="text-sm text-gray-900 dark:text-white">
                                <FaUser className="inline mr-2" /> {userName}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                {userEmail}
                            </p>
                        </div>
                        <div className="py-1">
                            <button
                                onClick={onSignOut}
                                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                <FaSignOutAlt className="mr-2" /> Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;
