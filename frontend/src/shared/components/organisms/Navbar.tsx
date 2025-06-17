import React from "react";
import NavLogo from "../molecules/NavLogo";
import UserMenu from "../molecules/UserMenu";

interface NavbarProps {
    userName: string;
    userEmail: string;
    avatarSrc: string;
    onSignOut: () => void;
    onToggleSidebar: () => void;
    appTitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({
    userName,
    userEmail,
    avatarSrc,
    onSignOut,
    onToggleSidebar,
    appTitle = "Banco de Bogotá",
}) => {
    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <NavLogo
                        onToggleSidebar={onToggleSidebar}
                        appTitle={appTitle}
                        logoHref="/dashboard"
                    />

                    <div className="flex items-center space-x-4">
                        <UserMenu
                            userName={userName}
                            userEmail={userEmail}
                            avatarSrc={avatarSrc}
                            onSignOut={onSignOut}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
