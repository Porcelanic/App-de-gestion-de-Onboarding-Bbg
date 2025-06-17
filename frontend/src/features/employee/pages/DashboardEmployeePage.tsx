import React, { useState, useEffect } from "react";
import { getEmployees } from "../services/employee";
import { getEmployeeOnboardings } from "../services/employeeOnboarding";
import { getOnboardings } from "../../onboarding/services/onboarding";
import { getOnboardingTypes } from "../../onboarding/services/onboardingType";
import { DashboardEmployee } from "../components/children/DashboardEmployee";
import DashboardTemplate from "../../../shared/templates/DashboardTemplate";

export interface OnboardingDetail {
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
}

export interface EmployeeOnboarding {
    done: boolean;
    onboarding: OnboardingDetail;
}

export interface EmployeeWithOnboardings {
    employeeEmail: string;
    name: string;
    hireDate: string;
    terminationDate: string | null;
    roleId: number;
    roleTitle: string;
    onboardings: EmployeeOnboarding[];
}

export const DashboardEmployeePage: React.FC = () => {
    const [employees, setEmployees] = useState<EmployeeWithOnboardings[]>([]);
    const [uniqueOnboardingNames, setUniqueOnboardingNames] = useState<
        string[]
    >([]);
    const [uniqueOnboardingTypeNames, setUniqueOnboardingTypeNames] = useState<
        string[]
    >([]);
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

    const fetchEmployees = async () => {
        try {
            const employeesData = await getEmployees();
            const employeesWithOnboardings = await Promise.all(
                employeesData.map(async (employee) => {
                    const onboardingsData = await getEmployeeOnboardings(
                        employee.employeeEmail
                    );
                    return {
                        ...employee,
                        onboardings: onboardingsData,
                    };
                })
            );
            setEmployees(employeesWithOnboardings);
        } catch (error) {
            console.error(
                "Error fetching employees or their onboardings:",
                error
            );
        }
    };

    const fetchOnboardingTypes = async () => {
        try {
            const onboardingTypesData = await getOnboardingTypes();
            onboardingTypesData.sort((a, b) => a.name.localeCompare(b.name));
            setUniqueOnboardingTypeNames(
                onboardingTypesData.map((type) => type.name)
            );
        } catch (error) {
            console.error("Error fetching onboarding types:", error);
        }
    };

    const fetchOnboardings = async () => {
        try {
            const onboardingsData = await getOnboardings();
            onboardingsData.sort((a, b) => a.name.localeCompare(b.name));
            setUniqueOnboardingNames(
                onboardingsData.map((onboarding) => onboarding.name)
            );
        } catch (error) {
            console.error("Error fetching onboardings:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchOnboardingTypes();
    }, []);

    useEffect(() => {
        fetchOnboardings();
    }, []);

    /*
    useEffect(() => {
        if (employees.length > 0) {
            console.log("Employees state updated:", employees);
        }
        if (uniqueOnboardingNames.length > 0) {
            console.log("Unique Onboarding Names:", uniqueOnboardingNames);
        }
        if (uniqueOnboardingTypeNames.length > 0) {
            console.log(
                "Unique Onboarding Type Names:",
                uniqueOnboardingTypeNames
            );
        }
    }, [employees, uniqueOnboardingNames, uniqueOnboardingTypeNames]);
    */

    const handleAddEmployee = () => {
        fetchEmployees();
    };

    const handleDeleteEmployee = () => {
        fetchEmployees();
    };

    return (
        <DashboardTemplate
            userName={currentUser.userName}
            userEmail={currentUser.userEmail}
            avatarSrc={currentUser.avatarSrc}
            onSignOut={handleSignOut}
        >
            <DashboardEmployee
                employees={employees}
                onEmployeeChange={handleAddEmployee}
                uniqueOnboardingNames={uniqueOnboardingNames}
                uniqueOnboardingTypeNames={uniqueOnboardingTypeNames}
            />
        </DashboardTemplate>
    );
};
