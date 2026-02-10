export function isEventEditable(event) {
    const now = new Date();
    const eventDate = new Date(event.date);

    if (isNaN(eventDate)) return false;

    // If event date is in the past, not editable
    const eventEnd = new Date(eventDate);

    if (event.timeEnd) {
        const [h, m] = event.timeEnd.split(':').map(Number);
        eventEnd.setHours(h, m, 0, 0);
    } else {
        // No timeEnd, assume end of day
        eventEnd.setHours(23, 59, 59, 999);
    }

    // Editable only if eventEnd is in the future
    return eventEnd > now;
}
