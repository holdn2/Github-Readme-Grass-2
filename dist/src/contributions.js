const API_ROOT = "https://github-contributions-api.jogruber.de/v4";
export async function fetchContributions(username, year) {
    const endpoint = `${API_ROOT}/${encodeURIComponent(username)}?y=${year}`;
    const response = await fetch(endpoint, {
        headers: {
            accept: "application/json",
            "user-agent": "real-grass-github-readme",
        },
    });
    if (!response.ok) {
        throw new Error(`Contribution API returned ${response.status}`);
    }
    return normalizeContributions((await response.json()), year);
}
export function normalizeContributions(payload, year) {
    const source = payload.contributions ?? [];
    const byDate = new Map(source.map((day) => {
        const count = Number(day.count ?? 0);
        const level = toLevel(Number.isFinite(day.level) ? Number(day.level) : levelForCount(count));
        return [day.date, { date: day.date, count, level }];
    }));
    return yearDates(year).map((date) => byDate.get(date) ?? { date, count: 0, level: 0 });
}
export function levelForCount(count) {
    if (count <= 0)
        return 0;
    if (count <= 2)
        return 1;
    if (count <= 5)
        return 2;
    if (count <= 10)
        return 3;
    return 4;
}
export function sampleContributions(year) {
    return yearDates(year).map((date, index) => {
        const wave = Math.sin(index / 8) + Math.cos(index / 19);
        const count = wave > 0.5 ? Math.floor((wave + 1) * 4 + (index % 5)) : 0;
        return { date, count, level: levelForCount(count) };
    });
}
export function yearDates(year) {
    const dates = [];
    const date = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));
    while (date < end) {
        dates.push(date.toISOString().slice(0, 10));
        date.setUTCDate(date.getUTCDate() + 1);
    }
    return dates;
}
function toLevel(value) {
    if (value <= 0)
        return 0;
    if (value >= 4)
        return 4;
    return value;
}
