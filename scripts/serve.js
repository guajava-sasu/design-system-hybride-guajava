import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const siteRoot = resolve(projectRoot, "docs");
const port = Number(process.env.PORT ?? 4321);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".woff2", "font/woff2"],
  [".svg", "image/svg+xml"],
]);
const sharedStylesheets = new Set([
  "/components.css",
  "/foundation.css",
  "/index.css",
  "/tokens.css",
  "/utilities.css"
]);

const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch (error) {
    if (error instanceof URIError) {
      response.writeHead(400).end("Invalid URL");
      return;
    }
    throw error;
  }

  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const publicRoot = sharedStylesheets.has(requestedPath) ? projectRoot : siteRoot;
  const filePath = resolve(publicRoot, `.${requestedPath}`);
  const relativePath = relative(publicRoot, filePath);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    relativePath.startsWith(sep) ||
    (publicRoot === projectRoot && !sharedStylesheets.has(requestedPath))
  ) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  let fileInfo;
  try {
    fileInfo = statSync(filePath);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      response.writeHead(404).end("Not found");
      return;
    }
    throw error;
  }

  const targetPath = fileInfo.isDirectory() ? join(filePath, "index.html") : filePath;
  const contentType = contentTypes.get(extname(targetPath)) ?? "application/octet-stream";
  response.writeHead(200, {
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-cache"
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  const stream = createReadStream(targetPath);
  stream.on("error", (error) => {
    if (error.code === "ENOENT" || error.code === "EISDIR") {
      if (!response.headersSent) response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.destroy(error);
  });
  stream.pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Design system showcase: http://127.0.0.1:${port}`);
});
