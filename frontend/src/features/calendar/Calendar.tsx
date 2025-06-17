import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getOnboardings } from "../onboarding/services/onboarding";
import OnboardingDetailsModal from "./OnboardingDetailsModal";
import "./calendar-dark.css";

export interface Onboardings {
  onboardingId: number;
  name: string;
  startDate: string;
  endDate: string;
  typeId: number;
  onboardingType: {
    typeId: number;
    name: string;
    description: string;
  };
}

const Calendar: React.FC = () => {
  const [onboardings, setOnboardings] = useState<Onboardings[]>([]);
  const [selectedOnboarding, setSelectedOnboarding] = useState<Onboardings | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOnboardings = async () => {
      try {
        const data = await getOnboardings();
        setOnboardings(data);
      } catch (error) {
        console.error("Error fetching onboardings:", error);
      }
    };
    fetchOnboardings();
  }, []);

  const events = onboardings.map((onboarding) => ({
    id: onboarding.onboardingId.toString(),
    title: onboarding.name,
    start: onboarding.startDate,
    end: onboarding.endDate,
    extendedProps: {
      onboardingId: onboarding.onboardingId,
    },
  }));

  const handleEventClick = (clickInfo: any) => {
    const onboardingId = Number(clickInfo.event.id);
    const onboarding = onboardings.find((o) => o.onboardingId === onboardingId);
    setSelectedOnboarding(onboarding || null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-lg">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
      />
      <OnboardingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onboarding={selectedOnboarding}
      />
    </div>
  );
};

export default Calendar;
