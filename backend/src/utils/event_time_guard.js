function isEventEditable({ date, timeEnd }) {
    const now = new Date();

    const eventDate = new Date(date);
    if (isNaN(eventDate)) return false;

    // Event date already passed
    if (eventDate.toDateString() < now.toDateString()) {
        return false;
    }

    // Same day → check timeEnd
    if (eventDate.toDateString() === now.toDateString()) {
        if (!timeEnd) return false;

        const [hours, minutes] = timeEnd.split(':').map(Number);
        const eventEnd = new Date(eventDate);
        eventEnd.setHours(hours, minutes, 0, 0);

        if (eventEnd < now) return false;
    }

    return true;
}

module.exports = { isEventEditable };
