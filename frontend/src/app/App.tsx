import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { LoginPage } from "../features/employee/pages/LoginPage";
import { RegisterPage } from "../features/employee/pages/RegisterPage";
import { DashboardEmployeePage } from "../features/employee/pages/DashboardEmployeePage";
import { Modal } from "../shared/components/atoms/Modal";
import { DashboardOnboardingPage } from "../features/onboarding/pages/DashboardOnboardingPage";
import CalendarPage from "../features/calendar/CalendarPage";

const App: React.FC = () => {
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            document.body.setAttribute("data-theme", "dark");
        } else {
            document.body.setAttribute("data-theme", "light");
        }
    }, []);

    useEffect(() => {
        const handleSessionExpired = () => {
            setIsSessionExpired(true);
        };

        window.addEventListener("sessionExpired", handleSessionExpired);

        return () => {
            window.removeEventListener("sessionExpired", handleSessionExpired);
        };
    }, []);

    const handleCloseModal = () => {
        setIsSessionExpired(false);
        window.location.href = "/login";
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route
                    path="/dashboard/employee"
                    element={
                        localStorage.getItem("accessToken") ? (
                            <DashboardEmployeePage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/dashboard/onboarding"
                    element={
                        localStorage.getItem("accessToken") ? (
                            <DashboardOnboardingPage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/dashboard"
                    element={<Navigate to="/dashboard/employee" />}
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
            <Modal
                isOpen={isSessionExpired}
                onClose={handleCloseModal}
                title="Sesión expirada"
                message="Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
            />
        </Router>
    );
};

export default App;
