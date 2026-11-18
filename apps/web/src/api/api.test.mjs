// Run from root: node apps/web/src/api/api.test.mjs
import assert from "node:assert/strict";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
const server = await createServer({ root: fileURLToPath(new URL("../../", import.meta.url)), configFile: false, server: { middlewareMode: true }, appType: "custom" });
const originalFetch = globalThis.fetch;
try {
  const { apiFetch, ApiError } = await server.ssrLoadModule("/src/api/client.ts");
  const { session } = await server.ssrLoadModule("/src/api/session.ts");
  const parser = { parse: value => value };
  const ok = data => new Response(JSON.stringify({ success: true, data }));
  const unauthorized = () => new Response(JSON.stringify({ success: false, error: { code: "UNAUTHORIZED", message: "expired" } }), { status: 401 });
  session.replace({ accessToken: "old", refreshToken: "refresh" });
  let refreshes = 0;
  globalThis.fetch = async (url, init) => {
    if (url.endsWith("/auth/refresh")) { refreshes++; await new Promise(resolve => setTimeout(resolve, 10)); return ok({ accessToken: "new", refreshToken: "rotated" }); }
    if (init.headers.get("Authorization") === "Bearer old") return unauthorized();
    assert.equal(init.headers.get("Authorization"), "Bearer new");
    return ok({ value: 1 });
  };
  assert.deepEqual(await Promise.all([apiFetch("/a", parser), apiFetch("/b", parser)]), [{ value: 1 }, { value: 1 }]);
  assert.equal(refreshes, 1);
  assert.equal(session.refreshToken, "rotated");
  globalThis.fetch = async (_url, init) => { assert.equal(init.headers.get("Authorization"), null); return ok("public"); };
  assert.equal(await apiFetch("/public", parser, { auth: false }), "public");
  globalThis.fetch = async () => unauthorized();
  await assert.rejects(apiFetch("/private", parser), ApiError);
  assert.equal(session.refreshToken, null);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(apiFetch("/a", parser, { signal: controller.signal }), { name: "AbortError" });
  globalThis.fetch = async () => ok({ wrong: true });
  await assert.rejects(apiFetch("/a", { parse() { throw Error("invalid"); } }, { auth: false }), error => error.code === "INVALID_RESPONSE");
  session.replace({ accessToken: "old", refreshToken: "refresh" });
  globalThis.fetch = async url => {
    if (url.endsWith("/auth/refresh")) { session.replace(null); return ok({ accessToken: "late", refreshToken: "late" }); }
    return unauthorized();
  };
  await assert.rejects(apiFetch("/private", parser), { name: "AbortError" });
  assert.equal(session.accessToken, null);
  console.log("PASS: refresh concurrency/rotation, public auth isolation, rejection, abort, validation, logout race");
} finally { globalThis.fetch = originalFetch; await server.close(); }
