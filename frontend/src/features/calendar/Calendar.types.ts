export interface CalendarEvent {
    title: string;
    date: string;
}

export interface CalendarProps {
    initialView?: string;
    events?: CalendarEvent[];
    weekends?: boolean;
    onDateClick?: (dateStr: string) => void;
}
