const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CELL = 13;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 46;
const TOP = 58;
const WEEKS = 53;
const HEIGHT = 214;
const WIDTH = LEFT + WEEKS * STEP + 18;
export function renderGardenSvg(days, options) {
    const cells = padCalendar(days, options.year);
    const total = days.reduce((sum, day) => sum + day.count, 0);
    const title = escapeXml(options.title || `${options.username}'s real grass in ${options.year}`);
    return [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${title}">`,
        "<defs>",
        "<filter id=\"softShadow\"><feDropShadow dx=\"0\" dy=\"1\" stdDeviation=\"0.35\" flood-color=\"#4e351f\" flood-opacity=\"0.2\"/></filter>",
        "</defs>",
        `<rect width="${WIDTH}" height="${HEIGHT}" rx="8" fill="#e4d58a"/>`,
        `<text x="${LEFT}" y="23" fill="#3f351a" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="14" font-weight="700">${title}</text>`,
        `<text x="${WIDTH - 18}" y="23" text-anchor="end" fill="#6b5e34" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="12">${total.toLocaleString()} contributions</text>`,
        renderMonthLabels(cells),
        renderWeekdayLabels(),
        cells.map(renderCell).join(""),
        options.showLegend ? renderLegend() : "",
        "</svg>",
    ].join("");
}
function padCalendar(days, year) {
    const first = new Date(Date.UTC(year, 0, 1)).getUTCDay();
    const mondayOffset = (first + 6) % 7;
    return [...Array(mondayOffset).fill(null), ...days].slice(0, WEEKS * 7);
}
function renderMonthLabels(cells) {
    const seen = new Set();
    return cells
        .map((day, index) => {
        if (!day)
            return "";
        const date = new Date(`${day.date}T00:00:00Z`);
        const month = date.getUTCMonth();
        if (seen.has(month) || date.getUTCDate() > 7)
            return "";
        seen.add(month);
        return `<text x="${LEFT + Math.floor(index / 7) * STEP}" y="${TOP - 8}" fill="#574a25" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="10">${MONTHS[month]}</text>`;
    })
        .join("");
}
function renderWeekdayLabels() {
    return [
        `<text x="16" y="${TOP + STEP + 10}" fill="#66582d" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="10">Mon</text>`,
        `<text x="16" y="${TOP + STEP * 3 + 10}" fill="#66582d" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="10">Wed</text>`,
        `<text x="16" y="${TOP + STEP * 5 + 10}" fill="#66582d" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="10">Fri</text>`,
    ].join("");
}
function renderCell(day, index) {
    const week = Math.floor(index / 7);
    const weekday = index % 7;
    const x = LEFT + week * STEP;
    const y = TOP + weekday * STEP;
    if (!day) {
        return `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2" fill="#d5c777"/>`;
    }
    return [
        `<g filter="url(#softShadow)">`,
        renderTopTile(day.level, x, y, index),
        `<title>${day.date}: ${day.count} contributions</title>`,
        "</g>",
    ].join("");
}
function renderTopTile(level, x, y, index) {
    const isGrass = level > 0;
    const base = isGrass ? ["#8fbd5d", "#669a42", "#3f7d32", "#3f7d32"][level - 1] : "#946338";
    const colors = isGrass
        ? [
            ["#78aa50", "#8fbd5d", "#a4cf70", "#6d9a49"],
            ["#4f8033", "#669a42", "#79ac4f", "#3f6f2d"],
            ["#2f6528", "#3f7d32", "#518f3a", "#285b24"],
            ["#2f6528", "#3f7d32", "#518f3a", "#285b24"],
        ][level - 1]
        : ["#6b4529", "#805331", "#9a6a3e", "#b47a49", "#553722"];
    const grid = isGrass ? grassGrid(level, index) : soilGrid(index);
    return [
        `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="1" fill="${base}"/>`,
        grid
            .map((pixel, pixelIndex) => {
            const seed = hash(index * 127 + pixelIndex * 43 + level * 19);
            const color = colors[seed % colors.length];
            return `<rect x="${x + pixel.x}" y="${y + pixel.y}" width="${pixel.size}" height="${pixel.size}" fill="${color}"/>`;
        })
            .join(""),
        level === 4 ? renderFlowers(x, y, index) : "",
    ].join("");
}
function grassGrid(level, index) {
    const pixels = [0, 5, 9, 15, 15][level];
    const cells = [];
    for (let i = 0; i < pixels; i += 1) {
        const seed = hash(index * 83 + i * 41 + level * 13);
        const size = level >= 3 && i % 3 !== 0 ? 3 : 2;
        cells.push({
            x: seed % (CELL - size),
            y: hash(seed + 9) % (CELL - size),
            size,
        });
    }
    return cells;
}
function renderFlowers(x, y, index) {
    const seed = hash(index * 149 + 37);
    const flowers = 1 + (seed % 2);
    const nodes = [];
    for (let i = 0; i < flowers; i += 1) {
        const flowerSeed = hash(seed + i * 67);
        const fx = x + 3 + (flowerSeed % 7);
        const fy = y + 3 + (hash(flowerSeed + 19) % 7);
        const petal = ["#f2e85e", "#f5f0a1", "#eaa6c8"][hash(flowerSeed + 31) % 3];
        nodes.push(`<rect x="${fx}" y="${fy - 1}" width="1" height="1" fill="${petal}"/>`, `<rect x="${fx - 1}" y="${fy}" width="1" height="1" fill="${petal}"/>`, `<rect x="${fx}" y="${fy}" width="1" height="1" fill="#f0b43a"/>`, `<rect x="${fx + 1}" y="${fy}" width="1" height="1" fill="${petal}"/>`, `<rect x="${fx}" y="${fy + 1}" width="1" height="1" fill="${petal}"/>`);
    }
    return nodes.join("");
}
function soilGrid(index) {
    const cells = [];
    for (let i = 0; i < 15; i += 1) {
        const seed = hash(index * 97 + i * 53);
        const size = i % 5 === 0 ? 3 : 2;
        cells.push({
            x: seed % (CELL - size),
            y: hash(seed + 21) % (CELL - size),
            size,
        });
    }
    return cells;
}
function renderLegend() {
    const y = 196;
    const x = WIDTH - 242;
    return [
        `<text x="${x}" y="${y}" fill="#66582d" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="10">Less</text>`,
        [0, 1, 2, 3, 4]
            .map((level, index) => `<g transform="translate(${x + 34 + index * 17} ${y - 10}) scale(0.92)">${renderTopTile(level, 0, 0, index + 700)}</g>`)
            .join(""),
        `<text x="${x + 125}" y="${y}" fill="#66582d" font-family="ui-sans-serif, system-ui, Segoe UI, sans-serif" font-size="10">More</text>`,
    ].join("");
}
function hash(seed) {
    let value = seed;
    value ^= value << 13;
    value ^= value >> 17;
    value ^= value << 5;
    return Math.abs(value);
}
function escapeXml(value) {
    return value.replace(/[<>&"']/g, (char) => {
        const entities = {
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            "\"": "&quot;",
            "'": "&apos;",
        };
        return entities[char];
    });
}
