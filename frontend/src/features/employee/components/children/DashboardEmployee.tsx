import React, { useState, useMemo } from "react";
import { EmployeeWithOnboardings } from "../../pages/DashboardEmployeePage";
import { EmployeeRow } from "./EmployeeRow";
import { OnboardingSubTable } from "./OnboardingSubTable";
import { Button } from "../../../../shared/components/atoms/Button";
import { Modal } from "../../../../shared/components/atoms/Modal";
import { RegisterEmployeeForm } from "./RegisterEmployeeForm";
import { EditEmployeeForm } from "./EditEmployeeForm";

interface DashboardEmployeeProps {
    employees: EmployeeWithOnboardings[];
    onEmployeeChange: () => void;
    onDeleteEmployee: () => void;
    uniqueOnboardingNames: string[];
    uniqueOnboardingTypeNames: string[];
}

export const DashboardEmployee: React.FC<DashboardEmployeeProps> = ({
    employees,
    onEmployeeChange,

    uniqueOnboardingNames,
    uniqueOnboardingTypeNames,
}) => {
    const [expandedEmployeeEmail, setExpandedEmployeeEmail] = useState<
        string | null
    >(null);

    const [isRegisterEmployeeModalOpen, setIsRegisterEmployeeModalOpen] =
        useState(false);
    const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] =
        useState(false);
    const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] =
        useState<EmployeeWithOnboardings | null>(null);

    const [onboardingNameFilter, setOnboardingNameFilter] = useState("");
    const [onboardingStatusFilter, setOnboardingStatusFilter] = useState("");
    const [onboardingTypeFilter, setOnboardingTypeFilter] = useState("");

    const handleOpenRegisterEmployeeModal = () => {
        setIsRegisterEmployeeModalOpen(true);
    };

    const handleCloseRegisterEmployeeModal = () => {
        setIsRegisterEmployeeModalOpen(false);
    };

    const handleOpenEditEmployeeModal = (
        employeeToEdit: EmployeeWithOnboardings
    ) => {
        setSelectedEmployeeForEdit(employeeToEdit);
        setIsEditEmployeeModalOpen(true);
    };

    const handleCloseEditEmployeeModal = () => {
        setIsEditEmployeeModalOpen(false);
        setSelectedEmployeeForEdit(null);
    };

    const handleEmployeeUpdated = () => {
        onEmployeeChange();
        handleCloseEditEmployeeModal();
    };

    const handleToggleOnboardings = (employeeEmail: string) => {
        setExpandedEmployeeEmail((prevEmail) =>
            prevEmail === employeeEmail ? null : employeeEmail
        );
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            let matchesName = true;
            if (onboardingNameFilter) {
                matchesName = employee.onboardings.some(
                    (ob) => ob.onboarding.name === onboardingNameFilter
                );
            }

            let matchesStatus = true;
            if (onboardingStatusFilter) {
                if (onboardingStatusFilter === "Completado") {
                    matchesStatus = employee.onboardings.some((ob) => ob.done);
                } else if (onboardingStatusFilter === "Pendiente") {
                    matchesStatus = employee.onboardings.some((ob) => !ob.done);
                }
            }

            let matchesType = true;
            if (onboardingTypeFilter) {
                matchesType = employee.onboardings.some(
                    (ob) =>
                        ob.onboarding.onboardingType.name ===
                        onboardingTypeFilter
                );
            }

            return matchesName && matchesStatus && matchesType;
        });
    }, [
        employees,
        onboardingNameFilter,
        onboardingStatusFilter,
        onboardingTypeFilter,
    ]);

    if (employees.length === 0) {
        return (
            <div className="w-full p-4 text-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    No hay empleados registrados
                </h2>
                <Button type="submit" onClick={handleOpenRegisterEmployeeModal}>
                    Añadir Primer Empleado
                </Button>

                <Modal
                    isOpen={isRegisterEmployeeModalOpen}
                    onClose={handleCloseRegisterEmployeeModal}
                    title="Registrar empleado"
                    message=""
                >
                    <RegisterEmployeeForm onRegistered={onEmployeeChange} />
                </Modal>
            </div>
        );
    }

    const selectClasses =
        "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white";

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-800 shadow-md sm:rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Lista de Empleados
                </h2>
                <div>
                    <Button
                        type="submit"
                        onClick={handleOpenRegisterEmployeeModal}
                    >
                        Añadir Empleado
                    </Button>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label
                        htmlFor="onboardingNameFilterSelect"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Por nombre de Onboarding:
                    </label>
                    <select
                        id="onboardingNameFilterSelect"
                        value={onboardingNameFilter}
                        onChange={(e) =>
                            setOnboardingNameFilter(e.target.value)
                        }
                        className={selectClasses}
                    >
                        <option value="">Todos los nombres</option>
                        {uniqueOnboardingNames.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="onboardingStatusFilterSelect"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Por estado de Onboarding:
                    </label>
                    <select
                        id="onboardingStatusFilterSelect"
                        value={onboardingStatusFilter}
                        onChange={(e) =>
                            setOnboardingStatusFilter(e.target.value)
                        }
                        className={selectClasses}
                    >
                        <option value="">Todos los estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Completado">Completado</option>
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="onboardingTypeFilterSelect"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Por tipo de Onboarding:
                    </label>
                    <select
                        id="onboardingTypeFilterSelect"
                        value={onboardingTypeFilter}
                        onChange={(e) =>
                            setOnboardingTypeFilter(e.target.value)
                        }
                        className={selectClasses}
                    >
                        <option value="">Todos los tipos</option>
                        {uniqueOnboardingTypeNames.map((typeName) => (
                            <option key={typeName} value={typeName}>
                                {typeName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredEmployees.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No hay empleados que coincidan con los filtros aplicados.
                </p>
            )}

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email del Empleado
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Fecha de Contratación
                            </th>
                            <th scope="col" className="px-6 py-3">
                                # Onboardings
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    {filteredEmployees.length > 0 && (
                        <tbody>
                            {filteredEmployees.map((employee, index) => (
                                <React.Fragment key={employee.employeeEmail}>
                                    <EmployeeRow
                                        employee={employee}
                                        index={index}
                                        isExpanded={
                                            expandedEmployeeEmail ===
                                            employee.employeeEmail
                                        }
                                        onToggleOnboardings={
                                            handleToggleOnboardings
                                        }
                                        onOpenEditModal={
                                            handleOpenEditEmployeeModal
                                        }
                                    />
                                    {expandedEmployeeEmail ===
                                        employee.employeeEmail && (
                                        <OnboardingSubTable
                                            employee={employee}
                                            onEmployeeChange={onEmployeeChange}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
            <Modal
                isOpen={isRegisterEmployeeModalOpen}
                onClose={handleCloseRegisterEmployeeModal}
                title="Registrar empleado"
                message=""
            >
                <RegisterEmployeeForm onRegistered={onEmployeeChange} />
            </Modal>

            {selectedEmployeeForEdit && (
                <Modal
                    isOpen={isEditEmployeeModalOpen}
                    onClose={handleCloseEditEmployeeModal}
                    title="Editar empleado"
                    message=""
                >
                    <EditEmployeeForm
                        employee={selectedEmployeeForEdit}
                        onUpdated={handleEmployeeUpdated}
                        onCancel={handleCloseEditEmployeeModal}
                    />
                </Modal>
            )}
        </div>
    );
};
