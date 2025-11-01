export function formatDurationHHMM(hhmm: string) {
    const [hoursStr, minutesStr] = hhmm.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    const parts = [];
    if (hours) parts.push(`${hours}${minutes ? ':' + minutes: ''}`);
    parts.push(`hr${hours <= 1 ? "" : "s"}`);

    return parts.join(" ");
}

export function formatPrice(value: number): string {
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Formats an ISO date string to "Tue, 12 Jan 2024" style.
 * @param isoDate - ISO date string, e.g., "2000-01-01T00:00:00.000Z"
 * @returns formatted date string or null if invalid
 */
export function formatDate(isoDate: string | null | undefined): string | null {
    if (!isoDate) return null;

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return null; // invalid date check

    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}