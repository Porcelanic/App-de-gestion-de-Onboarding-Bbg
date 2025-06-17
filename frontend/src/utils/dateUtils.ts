export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return `${year}/${month.toString().padStart(2, "0")}/${day
        .toString()
        .padStart(2, "0")}`;
};

export const formatDateForInput = (
    dateString: string | null | Date
): string => {
    if (!dateString) return "";
    const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) {
        console.error(
            "Invalid date string provided to formatDateForInput:",
            dateString
        );
        return "";
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = (date.getDate()+1).toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};
