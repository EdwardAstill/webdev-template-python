import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";

async function waitForResponse(url) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return response;
    } catch {
      // Either service may still be starting.
    }
    await setTimeout(250);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

const backend = await waitForResponse("http://127.0.0.1:8000/health");
assert.deepEqual(await backend.json(), { status: "ok" });

const frontend = await waitForResponse("http://127.0.0.1:3000/api/health");
assert.deepEqual(await frontend.json(), { status: "ok" });

const message = await waitForResponse("http://127.0.0.1:3000/api/message");
assert.deepEqual(await message.json(), { message: "Hello from FastAPI." });

const page = await waitForResponse("http://127.0.0.1:3000");
assert.match(page.headers.get("content-type") ?? "", /text\/html/);
assert.match(await page.text(), /<main/);

console.log("Smoke check passed: page, frontend, backend, and API connection.");
