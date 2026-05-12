import { fetchContributions, sampleContributions } from "./contributions.js";
import { renderGardenSvg } from "./svg.js";
export async function makeGardenResponse(query) {
    const username = first(query.username || query.user || query.u)?.trim();
    const year = Number(first(query.year || query.y) || new Date().getFullYear());
    const showLegend = first(query.legend) !== "false";
    if (!username) {
        return textResponse("Missing required query parameter: username", 400);
    }
    if (!Number.isInteger(year) || year < 2008 || year > new Date().getFullYear() + 1) {
        return textResponse("Invalid year", 400);
    }
    let source = "live";
    let days = sampleContributions(year);
    try {
        days = await fetchContributions(username, year);
    }
    catch {
        source = "sample";
    }
    const body = renderGardenSvg(days, {
        username,
        year,
        title: source === "live" ? undefined : `${username}'s real grass in ${year} (sample)`,
        showLegend,
    });
    return {
        status: 200,
        body,
        headers: {
            "content-type": "image/svg+xml; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=3600",
        },
    };
}
function textResponse(body, status) {
    return {
        status,
        body,
        headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
        },
    };
}
function first(value) {
    return Array.isArray(value) ? value[0] : value;
}
