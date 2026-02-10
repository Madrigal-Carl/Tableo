export function isEventEditable(event) {
    const now = new Date();
    const eventDate = new Date(event.date);

    if (isNaN(eventDate)) return false;

    // Past date
    if (eventDate.toDateString() < now.toDateString()) return false;

    // Same day → check timeEnd
    if (eventDate.toDateString() === now.toDateString()) {
        if (!event.timeEnd) return false;

        const [h, m] = event.timeEnd.split(':').map(Number);
        const eventEnd = new Date(eventDate);
        eventEnd.setHours(h, m, 0, 0);

        if (eventEnd < now) return false;
    }

    return true;
}
