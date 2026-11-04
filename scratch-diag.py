import asyncio
from playwright.async_api import async_playwright
import http.server
import socketserver
import threading
import json
import time

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="out", **kwargs)
    def log_message(self, format, *args):
        pass

PORT = 4325
httpd = socketserver.TCPServer(("", PORT), Handler)
t = threading.Thread(target=httpd.serve_forever, daemon=True)
t.start()

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        
        page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))
        page.on("requestfailed", lambda req: print(f"FAILED: {req.url} - {req.failure}"))
        page.on("response", lambda res: print(f"RES {res.status}: {res.url}") if res.status >= 400 or "hero" in res.url else None)
        
        await page.goto(f"http://127.0.0.1:{PORT}", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        
        res = await page.evaluate('''() => {
            const vids = Array.from(document.querySelectorAll('video'));
            return vids.map((v, i) => ({
                index: i,
                currentSrc: v.currentSrc,
                paused: v.paused,
                muted: v.muted,
                readyState: v.readyState,
                error: v.error ? { code: v.error.code, msg: v.error.message } : null
            }));
        }''')
        print("VIDEOS:", json.dumps(res, indent=2))
        await browser.close()

asyncio.run(main())
httpd.shutdown()
