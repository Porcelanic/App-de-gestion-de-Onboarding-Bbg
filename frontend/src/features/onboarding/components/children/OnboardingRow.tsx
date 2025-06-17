import React from "react";
import { OnboardingWithEmployees } from "../../pages/DashboardOnboardingPage";
import { Button } from "../../../../shared/components/atoms/Button";
import { formatDate } from "../../../../utils/dateUtils";
import { EmployeeSubTable } from "./EmployeeSubTable";

interface OnboardingRowProps {
  onboarding: OnboardingWithEmployees;
  index: number;
  isExpanded: boolean;
  onOnboardingChange: () => void;
  onToggleExpand: () => void;
  onOpenEditModal: (onboarding: OnboardingWithEmployees) => void;
}

export const OnboardingRow: React.FC<OnboardingRowProps> = ({
  onboarding,
  index,
  isExpanded,
  onToggleExpand,
  onOpenEditModal,
  onOnboardingChange,
}) => (
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
  </>
);