import React, { useState } from "react";
import {
  OnboardingWithEmployees,
  EmployeeOnboarding,
} from "../pages/DashboardOnboardingPage";
import { formatDate } from "../../../utils/dateUtils";
import { Button } from "../../../shared/components/atoms/Button";
import { Modal } from "../../../shared/components/atoms/Modal";
import { AssignEmployeeToOnboardingForm } from "./AssignEmployeeToOnboardingForm";
import { unassignEmployeeFromOnboarding } from "../services/employeeOnboarding";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface EmployeeSubTableProps {
  onboarding: OnboardingWithEmployees;
  onOnboardingChange: () => void;
}

export const EmployeeSubTable: React.FC<EmployeeSubTableProps> = ({
  onboarding,
  onOnboardingChange,
}) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);

  const handleUnassign = async (employeeEmail: string) => {
    try {
      await unassignEmployeeFromOnboarding(
        onboarding.onboardingId,
        employeeEmail
      );
      setModalTitle("Éxito");
      setModalMessage("El empleado fue desasignado del onboarding.");
      setModalIcon(<FaCheckCircle className="w-12 h-12 text-green-600" />);
      setIsModalOpen(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("No se pudo desasignar el empleado.");
      setModalIcon(<FaTimesCircle className="w-12 h-12 text-red-600" />);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onOnboardingChange();
  };

  return (
    <div className="bg-gray-100 dark:bg-slate-700 border-b dark:border-slate-600 border-gray-200">
      <div className="flex justify-end mb-2">
        <Button onClick={() => setIsAssignModalOpen(true)} className="mt-2">
          Asignar empleado a onboarding
        </Button>
      </div>
      <table className="w-full text-sm text-gray-600 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-2 text-center">Nombre</th>
            <th className="px-4 py-2 text-center">Email</th>
            <th className="px-4 py-2 text-center">Fecha de contratacion</th>
            <th className="px-4 py-2 text-center">Estado</th>
            <th className="px-4 py-2 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {onboarding.onboardings.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-2 text-center">
                No hay empleados asignados a este onboarding.
              </td>
            </tr>
          ) : (
            onboarding.onboardings.map((empOnboarding: EmployeeOnboarding) => (
              <tr key={empOnboarding.employee.employeeEmail}>
                <td className="px-4 py-2">{empOnboarding.employee.name}</td>
                <td className="px-4 py-2">
                  {empOnboarding.employee.employeeEmail}
                </td>
                <td className="px-4 py-2">
                  {formatDate(empOnboarding.employee.hireDate)}
                </td>
                <td className="px-4 py-2">
                  {empOnboarding.done ? (
                    <span className="text-green-600 font-semibold">
                      Completado
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <Button
                    onClick={() =>
                      handleUnassign(empOnboarding.employee.employeeEmail)
                    }
                  >
                    Desasignar empleado
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Asignar empleado a onboarding"
        message=""
      >
        <AssignEmployeeToOnboardingForm
          onboardingId={onboarding.onboardingId}
          onAssigned={onOnboardingChange}
          onClose={() => setIsAssignModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
        icon={modalIcon}
      />
    </div>
  );
};
