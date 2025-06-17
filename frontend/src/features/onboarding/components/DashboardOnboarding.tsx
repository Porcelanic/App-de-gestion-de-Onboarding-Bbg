import React, { useState, useMemo } from "react";
import { Button } from "../../../shared/components/atoms/Button";
import { Modal } from "../../../shared/components/atoms/Modal";
import { RegisterOnboardingForm } from "./RegisterOnboardingForm";
import { EditOnboardingForm } from "./EditOnboardingForm";
import { OnboardingRow } from "./OnboardingRow";
import { OnboardingWithEmployees } from "../pages/DashboardOnboardingPage";
import { deleteOnboarding } from "../services/onboarding";

interface DashboardOnboardingProps {
    onboardings: OnboardingWithEmployees[];
    onboardingTypeNames: string[];
    onOnboardingChange: () => void;
}

export const DashboardOnboarding: React.FC<DashboardOnboardingProps> = ({
    onboardings,
    onboardingTypeNames,
    onOnboardingChange,
}) => {
    const [expandedOnboardingId, setExpandedOnboardingId] = useState<
        number | null
    >(null);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOnboarding, setSelectedOnboarding] =
        useState<OnboardingWithEmployees | null>(null);
    const [typeFilter, setTypeFilter] = useState("");

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [onboardingToDelete, setOnboardingToDelete] = useState<OnboardingWithEmployees | null>(null);

    const filteredOnboardings = useMemo(() => {
        if (!typeFilter) return onboardings;
        return onboardings.filter((o) => o.onboardingType.name === typeFilter);
    }, [onboardings, typeFilter]);

    const handleOpenEditModal = (onboarding: OnboardingWithEmployees) => {
        setSelectedOnboarding(onboarding);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedOnboarding(null);
    };

    const handleDeleteOnboarding = async (onboarding: OnboardingWithEmployees) => {
        if (onboarding.onboardings.length > 0) {
            setShowErrorModal(true);
            return;
        }
        try {
            await deleteOnboarding(onboarding.onboardingId);
            setShowSuccessModal(true);
        } catch (error) {
            setShowErrorModal(true);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        onOnboardingChange();
    };

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-800 shadow-md sm:rounded-lg">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Lista de Onboardings
                </h2>
                <div>
                    <Button
                        type="button"
                        onClick={() => setIsRegisterModalOpen(true)}
                    >
                        Añadir Onboarding
                    </Button>
                </div>
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filtrar por tipo:
                </label>
                <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="">Todos</option>
                    {onboardingTypeNames.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tipo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Fecha Inicio
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Fecha Fin
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Empleados
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOnboardings.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-4 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No hay onboardings que coincidan con el
                                    filtro.
                                </td>
                            </tr>
                        ) : (
                            filteredOnboardings.map((onboarding, idx) => (
                                <OnboardingRow
                                    key={onboarding.onboardingId}
                                    onboarding={onboarding}
                                    index={idx}
                                    isExpanded={
                                        expandedOnboardingId ===
                                        onboarding.onboardingId
                                    }
                                    onToggleExpand={() =>
                                        setExpandedOnboardingId(
                                            expandedOnboardingId ===
                                                onboarding.onboardingId
                                                ? null
                                                : onboarding.onboardingId
                                        )
                                    }
                                    onOnboardingChange={onOnboardingChange}
                                    onOpenEditModal={handleOpenEditModal}
                                    onDelete={handleDeleteOnboarding}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                title="Registrar onboarding"
                message=""
            >
                <RegisterOnboardingForm
                    onRegistered={onOnboardingChange}
                    onboardings={onboardings}
                />
            </Modal>
            {selectedOnboarding && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    title="Editar onboarding"
                    message=""
                >
                    <EditOnboardingForm
                        onboarding={selectedOnboarding}
                        onUpdated={() => {
                            onOnboardingChange();
                            handleCloseEditModal();
                        }}
                        onCancel={handleCloseEditModal}
                        onboardings={onboardings}
                    />
                </Modal>
            )}
            <Modal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="No se puede eliminar"
                message="No se puede eliminar este onboarding porque tiene empleados asignados o ha ocurrido un error."
            />
            <Modal
                isOpen={showSuccessModal}
                onClose={handleSuccessModalClose}
                title="Eliminado correctamente"
                message="El onboarding ha sido eliminado correctamente."
            />
        </div>
    );
};
