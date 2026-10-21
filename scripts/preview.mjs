import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

// Serve the production export with clean routes and a real 404 response.
const root = resolve("out");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml", ".png": "image/png", ".webp": "image/webp", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ttf": "font/ttf", ".woff2": "font/woff2", ".ico": "image/x-icon" };
const port = Number(process.argv[2] || process.env.PORT || 3000);
const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method || "")) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    const candidates = file === root ? [resolve(root, "index.html")] : extname(file) ? [file] : [`${file}.html`, resolve(file, "index.html"), file];
    let status = 200;
    let selected;
    for (const candidate of candidates) {
      try { if ((await stat(candidate)).isFile()) { selected = candidate; break; } } catch { /* Try the next clean-URL candidate. */ }
    }
    if (!selected) { selected = resolve(root, "404.html"); status = 404; }
    file = selected;
    const content = await readFile(file);
    response.writeHead(status, { "Content-Type": mime[extname(file)] || "application/octet-stream", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "Cache-Control": file.includes(`${sep}_next${sep}static${sep}`) ? "public, max-age=31536000, immutable" : "no-cache" });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch { response.writeHead(400).end("Bad request"); }
});
server.listen(port, "127.0.0.1", () => console.log(`NO SMALL THING preview: http://127.0.0.1:${port}`));
