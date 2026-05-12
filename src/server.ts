import { createServer } from "node:http";
import { makeGardenResponse } from "./handler.js";

const port = Number(process.env.PORT || 4173);

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (url.pathname !== "/" && url.pathname !== "/api/grass") {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const result = await makeGardenResponse(Object.fromEntries(url.searchParams));
  response.writeHead(result.status, result.headers);
  response.end(result.body);
}).listen(port, "127.0.0.1", () => {
  console.log(`Real Grass SVG: http://127.0.0.1:${port}/api/grass?username=octocat`);
});
