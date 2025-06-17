import React, { useState } from "react";
import { OnboardingWithEmployees } from "../../pages/DashboardOnboardingPage";
import { Button } from "../../../../shared/components/atoms/Button";
import { formatDate } from "../../../../utils/dateUtils";
import { EmployeeSubTable } from "./EmployeeSubTable";
import { deleteOnboarding } from "../../services/onboarding";

// Puedes reemplazar estos modales por tu propio componente de Modal si tienes uno
const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({
  open,
  onClose,
  title,
  children,
}) =>
  !open ? null : (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <div className="mb-4">{children}</div>
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );

interface OnboardingRowProps {
  onboarding: OnboardingWithEmployees;
  index: number;
  isExpanded: boolean;
  onOnboardingChange: () => void;
  onToggleExpand: () => void;
  onOpenEditModal: (onboarding: OnboardingWithEmployees) => void;
  onDelete: (onboarding: OnboardingWithEmployees) => void;
}

export const OnboardingRow: React.FC<OnboardingRowProps> = ({
  onboarding,
  index,
  isExpanded,
  onToggleExpand,
  onOpenEditModal,
  onOnboardingChange,
  onDelete,
}) => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDelete = async () => {
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
    <>
      <tr
        className={`${
          index % 2 === 0
            ? "bg-white dark:bg-gray-900"
            : "bg-gray-50 dark:bg-gray-800"
        } border-b dark:border-gray-700 border-gray-200`}
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {onboarding.name}
        </th>
        <td className="px-6 py-4">{onboarding.onboardingType.name}</td>
        <td className="px-6 py-4">{formatDate(onboarding.startDate)}</td>
        <td className="px-6 py-4">{formatDate(onboarding.endDate)}</td>
        <td className="px-6 py-4">{onboarding.onboardings.length}</td>
        <td className="px-6 py-4 flex gap-2 justify-center">
          <Button onClick={() => onOpenEditModal(onboarding)}>
            Editar
          </Button>
          <Button onClick={() => onDelete(onboarding)}>
            Eliminar
          </Button>
          <Button onClick={onToggleExpand}>
            {isExpanded ? "Ocultar empleados" : "Ver empleados"}
          </Button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <EmployeeSubTable onboarding={onboarding} onOnboardingChange={onOnboardingChange} />
          </td>
        </tr>
      )}
      <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)} title="Error">
        <p>No se puede eliminar el onboarding porque tiene empleados asignados.</p>
      </Modal>
      <Modal open={showSuccessModal} onClose={handleSuccessModalClose} title="Éxito">
        <p>Onboarding eliminado con éxito.</p>
      </Modal>
    </>
  );
};