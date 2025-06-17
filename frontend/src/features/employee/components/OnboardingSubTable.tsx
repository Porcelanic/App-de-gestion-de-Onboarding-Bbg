import React, { useState } from "react";
import {
    EmployeeWithOnboardings,
    EmployeeOnboarding,
} from "../pages/DashboardEmployeePage";
import { formatDate } from "../../../utils/dateUtils";
import { updateEmployeeOnboarding } from "../services/employeeOnboarding";
import { Modal } from "../../../shared/components/atoms/Modal";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export interface OnboardingSubTableProps {
    employee: EmployeeWithOnboardings;
    onEmployeeChange: () => void;
}

export const OnboardingSubTable: React.FC<OnboardingSubTableProps> = ({
    employee,
    onEmployeeChange,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);

    const handleMarkCompleted = async (onboardingId: number) => {
        try {
            await updateEmployeeOnboarding(
                employee.employeeEmail,
                onboardingId,
                { done: true }
            );
            setModalTitle("Éxito");
            setModalMessage("Se ha marcado el onboarding como completado.");
            setModalIcon(
                <FaCheckCircle className="w-12 h-12 text-green-600" />
            );
            setIsModalOpen(true);
        } catch (error) {
            console.error(
                "Error al marcar el onboarding como completado:",
                error
            );
            setModalTitle("Error");
            setModalMessage("No se pudo marcar como completado.");
            setModalIcon(<FaTimesCircle className="w-12 h-12 text-red-600" />);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        onEmployeeChange();
    };

    if (employee.onboardings.length === 0) {
        return (
            <tr className="bg-gray-100 dark:bg-slate-700 border-b dark:border-slate-600 border-gray-200">
                <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                    Este empleado no tiene onboardings asignados.
                </td>
            </tr>
        );
    }

    return (
        <>
            <tr className="bg-gray-100 dark:bg-slate-700 border-b dark:border-slate-600 border-gray-200">
                <td colSpan={6} className="p-0 text-center">
                    <div className="p-4">
                        <h4 className="text-md text-left font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Onboardings de {employee.name}:
                        </h4>
                        <table className="w-full text-sm text-gray-600 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-slate-800 dark:text-slate-300">
                                <tr>
                                    <th className="px-4 py-2 text-center">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-2 text-center">
                                        Tipo de Onboarding
                                    </th>
                                    <th className="px-4 py-2 text-center">
                                        Fecha Inicio
                                    </th>
                                    <th className="px-4 py-2 text-center">
                                        Fecha Fin
                                    </th>
                                    <th className="px-4 py-2 text-center">
                                        Estado
                                    </th>
                                    <th className="px-4 py-2 text-center">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {employee.onboardings.map(
                                    (empOnboarding: EmployeeOnboarding) => (
                                        <tr
                                            key={
                                                empOnboarding.onboarding
                                                    .onboardingId
                                            }
                                            className="border-b border-gray-200 dark:border-slate-600 hover:bg-gray-300 dark:hover:bg-slate-600"
                                        >
                                            <td className="px-4 py-2">
                                                {empOnboarding.onboarding.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {
                                                    empOnboarding.onboarding
                                                        .onboardingType.name
                                                }
                                            </td>
                                            <td className="px-4 py-2">
                                                {formatDate(
                                                    empOnboarding.onboarding
                                                        .startDate
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {formatDate(
                                                    empOnboarding.onboarding
                                                        .endDate
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {empOnboarding.done
                                                    ? "Completado"
                                                    : "Pendiente"}
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() =>
                                                        handleMarkCompleted(
                                                            empOnboarding
                                                                .onboarding
                                                                .onboardingId
                                                        )
                                                    }
                                                    className={`font-medium hover:underline ${
                                                        empOnboarding.done
                                                            ? "text-gray-500 cursor-not-allowed"
                                                            : "text-green-600 dark:text-green-500"
                                                    }`}
                                                    disabled={
                                                        empOnboarding.done
                                                    }
                                                >
                                                    {empOnboarding.done
                                                        ? "Completado"
                                                        : "Marcar como completada"}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                message={modalMessage}
                icon={modalIcon}
            />
        </>
    );
};
