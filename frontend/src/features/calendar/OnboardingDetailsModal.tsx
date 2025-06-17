import React from "react";
import { Modal } from "../../shared/components/atoms/Modal";
import { Onboardings } from "./Calendar";

interface OnboardingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onboarding: Onboardings | null;
}

const OnboardingDetailsModal: React.FC<OnboardingDetailsModalProps> = ({
  isOpen,
  onClose,
  onboarding,
}) => {
  if (!onboarding) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Onboarding: ${onboarding.name}`}
      message=""
    >
      <div className="text-center space-y-2">
        <div>
          <strong>Tipo:</strong> {onboarding.onboardingType?.name}
        </div>
        <div>
          <strong>Descripción:</strong> {onboarding.onboardingType?.description}
        </div>
        <div>
          <strong>Fecha inicio:</strong> {onboarding.startDate}
        </div>
        <div>
          <strong>Fecha fin:</strong> {onboarding.endDate}
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingDetailsModal;