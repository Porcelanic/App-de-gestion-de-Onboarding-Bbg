import React from "react";
import DashboardTemplate from "../../shared/templates/DashboardTemplate";
import Calendar from "./Calendar";

const CalendarPage: React.FC = () => {
    const userName = localStorage.getItem("username") || "";
    const userEmail = localStorage.getItem("email") || "";
    const avatarSrc = "";

    const handleSignOut = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        window.location.href = "/login";
    };

    return (
        <DashboardTemplate
            userName={userName}
            userEmail={userEmail}
            avatarSrc={avatarSrc}
            onSignOut={handleSignOut}
            appTitle="Calendario"
        >
            <Calendar />
        </DashboardTemplate>
    );
};

export default CalendarPage;
