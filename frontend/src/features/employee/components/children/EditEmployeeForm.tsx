import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "../../../../shared/components/atoms/Input";
import { Button } from "../../../../shared/components/atoms/Button";
import { updateEmployee } from "../../services/employee";
import {
    FaSave,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { Modal } from "../../../../shared/components/atoms/Modal";
import { EmployeeWithOnboardings } from "../../pages/DashboardEmployeePage";
import { formatDateForInput } from "../../../../utils/dateUtils";
import { UpdateEmployeeData } from "../../types/UpdateEmployeeData";

export interface EditEmployeeFormValues {
    name: string;
    employeeEmail: string;
    hireDate: string;
    password?: string;
    roleId: number;
}

const validationSchema = yup.object({
    name: yup
        .string()
        .max(50, "El nombre no puede tener más de 50 caracteres")
        .required("El nombre es requerido"),
    employeeEmail: yup
        .string()
        .email("Debe ser un correo válido")
        .required("El correo es requerido"),
    hireDate: yup.date().required("La fecha de contratación es requerida"),
    password: yup
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(/[A-Z]/, "La contraseña debe tener al menos una mayúscula")
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "La contraseña debe tener al menos un carácter especial"
        )
        .optional(),
});

interface EditEmployeeFormProps {
    employee: EmployeeWithOnboardings;
    onUpdated: () => void;
    onCancel: () => void;
}

export const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({
    employee,
    onUpdated,
    onCancel,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik<EditEmployeeFormValues>({
        initialValues: {
            name: employee.name,
            employeeEmail: employee.employeeEmail,
            hireDate: formatDateForInput(employee.hireDate),
            password: "",
            roleId: employee.roleId,
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const dataToSubmit: UpdateEmployeeData = {
                name: values.name,
                hireDate: values.hireDate,
                roleId: values.roleId,
            };

            if (values.password) {
                dataToSubmit.password = values.password;
            }

            try {
                await updateEmployee(employee.employeeEmail, dataToSubmit);

                setModalTitle("Éxito");
                setModalMessage("Empleado actualizado correctamente.");
                setModalIcon(
                    <FaCheckCircle className="w-12 h-12 text-slate-900 dark:text-white" />
                );
                setIsModalOpen(true);
                setIsSuccess(true);
            } catch (error) {
                console.error("Error updating employee:", error);
                setModalTitle("Error");
                setModalMessage(
                    "Error al actualizar empleado. Intenta de nuevo."
                );
                setModalIcon(
                    <FaTimesCircle className="w-12 h-12 text-slate-900 dark:text-white" />
                );
                setIsModalOpen(true);
                setIsSuccess(false);
            }
        },
    });

    useEffect(() => {
        formik.setValues({
            name: employee.name,
            employeeEmail: employee.employeeEmail,
            hireDate: formatDateForInput(employee.hireDate),
            password: "",
            roleId: employee.roleId,
        });
    }, [employee]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (isSuccess) {
            onUpdated();
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formik.handleSubmit(e);
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="px-8 py-4 space-y-4"
                onKeyDown={(e) => {
                    if (
                        e.key === "Enter" &&
                        !e.metaKey &&
                        !e.ctrlKey &&
                        !e.shiftKey
                    ) {
                        const target = e.target as HTMLElement;
                        if (
                            target.tagName !== "TEXTAREA" &&
                            target.tagName !== "BUTTON"
                        ) {
                            handleSubmit(e as any);
                        }
                    }
                }}
            >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                    Editar Empleado
                </h3>
                <div>
                    <Input
                        type="text"
                        placeholder="Nombre completo del empleado"
                        label="Nombre completo del empleado"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="name"
                        maxLength={50}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="text-red-500 text-sm mt-1">
                            {formik.errors.name}
                        </div>
                    ) : null}
                </div>
                <div>
                    <Input
                        type="email"
                        placeholder="Correo electrónico del empleado"
                        label="Correo electrónico del empleado (no editable)"
                        value={formik.values.employeeEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="employeeEmail"
                        maxLength={100}
                        readOnly={true}
                        className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    />
                    {formik.touched.employeeEmail &&
                    formik.errors.employeeEmail ? (
                        <div className="text-red-500 text-sm mt-1">
                            {formik.errors.employeeEmail}
                        </div>
                    ) : null}
                </div>
                <div>
                    <Input
                        type="date"
                        placeholder="Fecha de contratación del empleado"
                        label="Fecha de contratación del empleado"
                        value={formik.values.hireDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="hireDate"
                    />
                    {formik.touched.hireDate && formik.errors.hireDate ? (
                        <div className="text-red-500 text-sm mt-1">
                            {formik.errors.hireDate}
                        </div>
                    ) : null}
                </div>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nueva contraseña (opcional)"
                        label="Nueva contraseña Temporal"
                        value={formik.values.password || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="password"
                        maxLength={50}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-slate-900 dark:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-sm mt-1">
                            {formik.errors.password}
                        </div>
                    ) : null}
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" className="whitespace-nowrap">
                        <FaSave className="w-4 h-4 mr-2" />
                        Guardar Cambios
                    </Button>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={modalTitle}
                    message={modalMessage}
                    icon={modalIcon}
                />
            </form>
        </>
    );
};
