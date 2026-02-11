function isEventEditable({ date, timeStart }) {
    if (!date || !timeStart) return false;

    const now = new Date();

    const eventDate = new Date(date);
    if (isNaN(eventDate)) return false;

    const [hours, minutes] = timeStart.split(':').map(Number);

    const eventStart = new Date(eventDate);
    eventStart.setHours(hours, minutes, 0, 0);

    return eventStart > now;
}

module.exports = { isEventEditable };
