import { makeGardenResponse } from "../src/handler.js";
export default async function handler(request, response) {
    const result = await makeGardenResponse(request.query ?? {});
    Object.entries(result.headers).forEach(([key, value]) => response.setHeader(key, value));
    response.status(result.status).send(result.body);
}
