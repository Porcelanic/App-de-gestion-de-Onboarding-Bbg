import React, { useState } from "react";
import { assignEmployeeToOnboarding } from "../services/employeeOnboarding";
import { Button } from "../../../shared/components/atoms/Button";
import { Input } from "../../../shared/components/atoms/Input";
import { Modal } from "../../../shared/components/atoms/Modal";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface AssignEmployeeToOnboardingFormProps {
  onboardingId: number;
  onAssigned: () => void;
  onClose: () => void;
}

export const AssignEmployeeToOnboardingForm: React.FC<AssignEmployeeToOnboardingFormProps> = ({
  onboardingId,
  onAssigned,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setModalTitle("Error");
      setModalMessage("El email es requerido.");
      setModalIcon(<FaTimesCircle className="w-12 h-12 text-red-600" />);
      setIsModalOpen(true);
      setIsSuccess(false);
      return;
    }
    setIsSubmitting(true);
    try {
      await assignEmployeeToOnboarding({
        onboardingId,
        employeeEmail: email.trim(),
      });
      setModalTitle("Éxito");
      setModalMessage("Empleado asignado correctamente.");
      setModalIcon(<FaCheckCircle className="w-12 h-12 text-green-600" />);
      setIsModalOpen(true);
      setIsSuccess(true);
    } catch (error: any) {
      setModalTitle("Error");
      setModalMessage(
        error?.response?.data?.message ||
          "No se pudo asignar el empleado al onboarding."
      );
      setModalIcon(<FaTimesCircle className="w-12 h-12 text-red-600" />);
      setIsModalOpen(true);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      onAssigned();
      onClose();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="employeeEmail"
          label="Email del empleado"
          placeholder="ejemplo@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-2">
          <Button type="submit">
            Asignar
          </Button>
          <Button type="button" onClick={onClose}>
            Cancelar
          </Button>
        </div>
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