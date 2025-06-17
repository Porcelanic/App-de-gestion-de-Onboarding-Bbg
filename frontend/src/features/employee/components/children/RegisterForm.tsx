import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "../../../../shared/components/atoms/Input";
import { Button } from "../../../../shared/components/atoms/Button";
import { register } from "../../services/employee";
import {
    FaUserPlus,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { Modal } from "../../../../shared/components/atoms/Modal";
import { RegisterEmployeeData } from "../../types/RegisterEmployeeData";
import { ThemeToggle } from "../../../../shared/components/atoms/ThemeToggle";

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
        .required("La contraseña es requerida"),
    confirmPassword: yup
        .string()
        .oneOf(
            [yup.ref("password"), undefined],
            "Las contraseñas deben coincidir"
        )
        .required("La confirmación de la contraseña es requerida"),
});

export const RegisterForm: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik<
        RegisterEmployeeData & { confirmPassword: string }
    >({
        initialValues: {
            name: "",
            employeeEmail: "",
            hireDate: "",
            password: "",
            confirmPassword: "",
            roleId: 1,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await register({ ...values, roleId: 1 });
                setModalTitle("Éxito");
                setModalMessage("Usuario registrado correctamente.");
                setModalIcon(
                    <FaCheckCircle className="w-12 h-12 text-slate-900 dark:text-white" />
                );
                setIsModalOpen(true);
                setIsSuccess(true);
            } catch (error) {
                console.log(error);
                setModalTitle("Error");
                setModalMessage(
                    "Error al registrar usuario. Prueba usando otro correo."
                );
                setModalIcon(
                    <FaTimesCircle className="w-12 h-12 text-slate-900 dark:text-white" />
                );
                setIsModalOpen(true);
                setIsSuccess(false);
            }
        },
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (isSuccess) {
            window.location.href = "/login";
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formik.isValid) {
            setModalTitle("Error");
            setModalMessage("Por favor, corrige los errores en el formulario.");
            setModalIcon(
                <FaTimesCircle className="w-12 h-12 text-slate-900 dark:text-white" />
            );
            setIsModalOpen(true);
        } else {
            formik.handleSubmit(e);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="px-8 py-4"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSubmit(e);
                    }
                }}
            >
                <div>
                    <Input
                        type="text"
                        placeholder="Nombre completo"
                        label="Ingresa tu nombre"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="name"
                        maxLength={50}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="text-red-500 text-sm mb-2">
                            {formik.errors.name}
                        </div>
                    ) : null}
                </div>
                <div>
                    <Input
                        type="email"
                        placeholder="Correo electrónico"
                        label="Ingresa tu correo electrónico"
                        value={formik.values.employeeEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="employeeEmail"
                        maxLength={100}
                    />
                    {formik.touched.employeeEmail &&
                    formik.errors.employeeEmail ? (
                        <div className="text-red-500 text-sm mb-2">
                            {formik.errors.employeeEmail}
                        </div>
                    ) : null}
                </div>
                <div>
                    <Input
                        type="date"
                        placeholder="Fecha de contratación"
                        label="Fecha de contratación"
                        value={formik.values.hireDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="hireDate"
                    />
                    {formik.touched.hireDate && formik.errors.hireDate ? (
                        <div className="text-red-500 text-sm mb-2">
                            {formik.errors.hireDate}
                        </div>
                    ) : null}
                </div>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        label="Ingresa tu contraseña"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="password"
                        maxLength={50}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-12 cursor-pointer text-slate-900 transform -translate-y-1/2 dark:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-sm mb-2">
                            {formik.errors.password}
                        </div>
                    ) : null}
                </div>
                <div className="relative">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar contraseña"
                        label="Confirma tu contraseña"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="confirmPassword"
                        maxLength={50}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-12 cursor-pointer text-slate-900 transform -translate-y-1/2 dark:text-white"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                        <div className="text-red-500 text-sm mb-2">
                            {formik.errors.confirmPassword}
                        </div>
                    ) : null}
                </div>
                <Button type="submit" className="whitespace-nowrap mt-8">
                    <FaUserPlus className="w-4 h-4 mr-2" />
                    Registrar usuario
                </Button>
                <p className="pt-4 text-center text-sm font-light text-slate-900 dark:text-white">
                    ¿Ya tienes cuenta?
                    <a
                        href="/login"
                        className="font-medium pl-2 text-slate-900 hover:underline dark:text-white"
                    >
                        Ingrese aquí
                    </a>
                </p>
                <div className="flex items-center justify-center mt-2">
                    <span className="mr-2 text-slate-900 dark:text-white text-sm">
                        Tema:
                    </span>
                    <ThemeToggle />
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
