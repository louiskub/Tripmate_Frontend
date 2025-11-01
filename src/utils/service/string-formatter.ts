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

