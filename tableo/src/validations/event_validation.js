export const validateEvent = ({
    title,
    location,
    date,
    timeStart,
    timeEnd,
    stages,
    judges,
    candidates,
}) => {
    if (!title?.trim()) return "Event name is required";
    if (!location?.trim()) return "Location is required";
    if (!date) return "Date is required";
    if (!timeStart) return "Start time is required";
    if (!timeEnd) return "End time is required";

    if (stages < 1) return "Stages must be at least 1";
    if (judges < 1) return "Judges must be at least 1";
    if (candidates < 1) return "Candidates must be at least 1";

    return null;
};
