import React, { useState, useEffect } from "react";
import { getOnboardings } from "../services/onboarding";
import { getOnboardingTypes } from "../services/onboardingType";
import { getEmployeeOnboardings } from "../services/employeeOnboarding";
import DashboardTemplate from "../../../shared/templates/DashboardTemplate";
import { DashboardOnboarding } from "../components/children/DashboardOnboarding";

export interface EmployeeDetail {
    employeeEmail: string;
    name: string;
    hireDate: string;
    terminationDate: string | null;
    roleId: number;
    roleTitle: string;
}

export interface EmployeeOnboarding {
    done: boolean;
    employee: EmployeeDetail;
}

export interface OnboardingWithEmployees {
    onboardingId: number;
    name: string;
    startDate: string;
    endDate: string;
    typeId: number;
    onboardingType: {
        typeId: number;
        name: string;
        description: string;
    };
    onboardings: EmployeeOnboarding[];
}

export const DashboardOnboardingPage: React.FC = () => {
    const [onboardings, setOnboardings] = useState<OnboardingWithEmployees[]>(
        []
    );
    const [onboardingTypeNames, setOnboardingTypeNames] = useState<string[]>(
        []
    );
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    const currentUser = {
        userName: username,
        userEmail: email,
        avatarSrc: "",
    };

    const handleSignOut = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        window.location.href = "/login";
    };

    const fetchOnboardings = async () => {
        try {
            const onboardingsData = await getOnboardings();

            const onboardingsWithEmployees = await Promise.all(
                onboardingsData.map(async (onboarding: any) => {
                    const employees = await getEmployeeOnboardings(
                        onboarding.onboardingId
                    );
                    return {
                        ...onboarding,
                        onboardings: employees,
                    };
                })
            );

            onboardingsWithEmployees.sort(
                (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
            );
            setOnboardings(onboardingsWithEmployees);
        } catch (error) {
            console.error(
                "Error fetching onboardings or their employees:",
                error
            );
        }
    };

    const fetchOnboardingTypes = async () => {
        try {
            const types = await getOnboardingTypes();
            setOnboardingTypeNames(types.map((t: any) => t.name));
        } catch (error) {
            console.error("Error fetching onboarding types:", error);
        }
    };

    useEffect(() => {
        fetchOnboardings();
        fetchOnboardingTypes();
    }, []);

    useEffect(() => {
        if (onboardings.length > 0) {
            console.log("Onboardings fetched:", onboardings);
        }
        if (onboardingTypeNames.length > 0) {
            console.log("Onboarding type names fetched:", onboardingTypeNames);
        }
    }, [onboardings, onboardingTypeNames]);

    return (
        <DashboardTemplate
            userName={currentUser.userName}
            userEmail={currentUser.userEmail}
            avatarSrc={currentUser.avatarSrc}
            onSignOut={handleSignOut}
        >
            <DashboardOnboarding
                onboardings={onboardings}
                onboardingTypeNames={onboardingTypeNames}
                onOnboardingChange={fetchOnboardings}
            />
        </DashboardTemplate>
    );
};
