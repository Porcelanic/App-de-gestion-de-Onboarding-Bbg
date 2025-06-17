import React from "react";
import { EmployeeWithOnboardings } from "../../pages/DashboardEmployeePage";
import { formatDate } from "../../../../utils/dateUtils";
import { Button } from "../../../../shared/components/atoms/Button";

export interface EmployeeRowProps {
    employee: EmployeeWithOnboardings;
    index: number;
    isExpanded: boolean;
    onToggleOnboardings: (employeeEmail: string) => void;
    onOpenEditModal: (employee: EmployeeWithOnboardings) => void;
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({
    employee,
    index,
    isExpanded,
    onToggleOnboardings,
    onOpenEditModal,
}) => (
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
            {employee.name}
        </th>
        <td className="px-6 py-4">{employee.employeeEmail}</td>
        <td className="px-6 py-4">{formatDate(employee.hireDate)}</td>
        <td className="px-6 py-4">{employee.onboardings.length}</td>
        <td className="px-6 py-4 flex gap-2 justify-center">
            <Button onClick={() => onOpenEditModal(employee)}>
                Editar empleado
            </Button>
            <Button onClick={() => onToggleOnboardings(employee.employeeEmail)}>
                {isExpanded ? "Ocultar onboardings" : "Ver onboardings"}
            </Button>
        </td>
    </tr>
);
