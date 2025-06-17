import React, { useState } from "react";
import Navbar from "../components/organisms/Navbar";
import Sidebar from "../components/organisms/Sidebar";

interface DashboardTemplateProps {
    children: React.ReactNode;
    userName: string;
    userEmail: string;
    avatarSrc: string;
    onSignOut: () => void;
    appTitle?: string;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
    children,
    userName,
    userEmail,
    avatarSrc,
    onSignOut,
    appTitle,
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar
                userName={userName}
                userEmail={userEmail}
                avatarSrc={avatarSrc}
                onSignOut={onSignOut}
                onToggleSidebar={toggleSidebar}
                appTitle={appTitle}
            />
            <Sidebar isOpen={isSidebarOpen} />
            <main className="p-4 sm:ml-64">
                <div className="mt-14 w-full">{children}</div>
            </main>
        </div>
    );
};

export default DashboardTemplate;
