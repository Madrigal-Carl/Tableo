export function isEventEditable(event) {
    if (!event?.date || !event?.timeStart) return false;

    const now = new Date();

    // Normalize date (YYYY-MM-DD or Date)
    const eventDate = new Date(event.date);
    if (isNaN(eventDate)) return false;

    // Normalize timeStart (HH:mm or HH:mm:ss)
    const [hours, minutes] = event.timeStart
        .split(':')
        .map(Number);

    const eventStart = new Date(eventDate);
    eventStart.setHours(hours, minutes, 0, 0);

    // 🔒 Not editable once started
    return eventStart > now;
}
