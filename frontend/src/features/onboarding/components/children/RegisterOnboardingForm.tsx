import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { createOnboarding } from "../../services/onboarding";
import { getOnboardingTypes } from "../../services/onboardingType";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button } from "../../../../shared/components/atoms/Button";
import { Input } from "../../../../shared/components/atoms/Input";
import { Select } from "../../../../shared/components/atoms/Select";
import { Modal } from "../../../../shared/components/atoms/Modal";
import { OnboardingWithEmployees } from "../../pages/DashboardOnboardingPage";

interface RegisterOnboardingFormProps {
    onRegistered: () => void;
    onboardings: OnboardingWithEmployees[];
}

interface OnboardingType {
    typeId: number;
    name: string;
    description: string;
}

const validationSchema = yup.object({
    name: yup.string().max(50, "Máx 50 caracteres").required("Requerido"),
    startDate: yup.date().required("Requerido"),
    endDate: yup.date().required("Requerido"),
    typeId: yup.number().required("Selecciona un tipo"),
});

export const RegisterOnboardingForm: React.FC<RegisterOnboardingFormProps> = ({
    onRegistered,
    onboardings,
}) => {
    const [types, setTypes] = useState<OnboardingType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        getOnboardingTypes().then(setTypes);
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            startDate: "",
            endDate: "",
            typeId: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (new Date(values.startDate) > new Date(values.endDate)) {
                setModalTitle("Error");
                setModalMessage(
                    "La fecha de fin no puede ser antes de la fecha de inicio."
                );
                setModalIcon(
                    <FaTimesCircle className="w-12 h-12 text-red-600" />
                );
                setIsModalOpen(true);
                setIsSuccess(false);
                return;
            }

            const nameExists = onboardings.some(
                (o) =>
                    o.name.trim().toLowerCase() ===
                    values.name.trim().toLowerCase()
            );
            if (nameExists) {
                setModalTitle("Error");
                setModalMessage("Ya existe un onboarding con ese nombre.");
                setModalIcon(
                    <FaTimesCircle className="w-12 h-12 text-red-600" />
                );
                setIsModalOpen(true);
                setIsSuccess(false);
                return;
            }
            try {
                await createOnboarding({
                    name: values.name,
                    startDate: values.startDate,
                    endDate: values.endDate,
                    typeId: Number(values.typeId),
                });
                setModalTitle("Éxito");
                setModalMessage("Onboarding registrado correctamente.");
                setModalIcon(
                    <FaCheckCircle className="w-12 h-12 text-green-600" />
                );
                setIsModalOpen(true);
                setIsSuccess(true);
            } catch (error) {
                setModalTitle("Error");
                setModalMessage("Error al registrar onboarding.");
                setModalIcon(
                    <FaTimesCircle className="w-12 h-12 text-red-600" />
                );
                setIsModalOpen(true);
                setIsSuccess(false);
            }
        },
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (isSuccess) {
            onRegistered();
        }
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <Input
                    type="text"
                    name="name"
                    label="Nombre"
                    placeholder="Nombre del onboarding"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-xs">
                        {formik.errors.name}
                    </div>
                )}

                <Input
                    type="date"
                    name="startDate"
                    label="Fecha inicio"
                    placeholder=""
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                    <div className="text-red-500 text-xs">
                        {formik.errors.startDate}
                    </div>
                )}

                <Input
                    type="date"
                    name="endDate"
                    label="Fecha fin"
                    placeholder=""
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                    <div className="text-red-500 text-xs">
                        {formik.errors.endDate}
                    </div>
                )}

                <Select
                    name="typeId"
                    label="Tipo de onboarding"
                    value={formik.values.typeId}
                    onChange={formik.handleChange}
                    options={[
                        { value: "", label: "Selecciona un tipo" },
                        ...types.map((type) => ({
                            value: type.typeId,
                            label: type.name,
                        })),
                    ]}
                />
                {formik.touched.typeId && formik.errors.typeId && (
                    <div className="text-red-500 text-xs">
                        {formik.errors.typeId}
                    </div>
                )}

                <Button type="submit">Registrar</Button>
            </form>
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
