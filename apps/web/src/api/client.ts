import { ApiEnvelopeSchema, ApiErrorSchema, TokenPairSchema } from "@skill-coach/shared";
import { session } from "./session";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown, public meta?: unknown) { super(message); this.name = "ApiError"; }
}
type Parser<T> = { parse(value: unknown): T };
type Options = RequestInit & { auth?: boolean };
const stale = () => new DOMException("Session changed", "AbortError");
let refreshing: { generation: number; promise: Promise<void> } | undefined;
export async function refreshSession(): Promise<void> {
  const generation = session.generation;
  if (refreshing?.generation === generation) return refreshing.promise;
  const token = session.refreshToken;
  if (!token) throw new ApiError(401, "UNAUTHORIZED", "Silakan masuk kembali.");
  const promise = (async () => {
    try {
      const tokens = await apiFetch("/auth/refresh", TokenPairSchema, { method: "POST", auth: false, body: JSON.stringify({ refreshToken: token }) });
      if (generation !== session.generation) throw stale();
      session.rotate(tokens);
    } catch (error) {
      if (generation === session.generation && error instanceof ApiError && [401, 403].includes(error.status)) session.replace(null);
      throw error;
    }
  })();
  refreshing = { generation, promise };
  try { await promise; } finally { if (refreshing?.promise === promise) refreshing = undefined; }
}
export async function apiFetch<T>(path: string, schema: Parser<T>, options: Options = {}): Promise<T> {
  const { auth = true, ...init } = options;
  const generation = session.generation;
  const ensureCurrent = () => { init.signal?.throwIfAborted(); if (auth && generation !== session.generation) throw stale(); };
  ensureCurrent();
  if (auth && !session.accessToken && session.refreshToken) await refreshSession();
  ensureCurrent();
  const send = () => {
    const headers = new Headers(init.headers);
    if (typeof init.body === "string" && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    if (auth && session.accessToken) headers.set("Authorization", `Bearer ${session.accessToken}`);
    if (!auth) headers.delete("Authorization");
    return fetch(`${BASE_URL}${path}`, { ...init, headers });
  };
  const usedToken = session.accessToken;
  let response = await send();
  ensureCurrent();
  if (auth && response.status === 401 && session.refreshToken) {
    if (session.accessToken === usedToken) await refreshSession();
    ensureCurrent();
    response = await send();
    ensureCurrent();
  }
  const text = await response.text();
  ensureCurrent();
  let payload: unknown;
  try { payload = text ? JSON.parse(text) : undefined; }
  catch { throw new ApiError(response.status, "INVALID_RESPONSE", "API mengembalikan respons non-JSON."); }
  if (!response.ok) {
    const parsed = ApiErrorSchema.safeParse(payload);
    if (parsed.success) throw new ApiError(response.status, parsed.data.error.code, parsed.data.error.message, parsed.data.error.details, parsed.data.meta);
    throw new ApiError(response.status, "HTTP_ERROR", response.statusText);
  }
  try {
    if (response.status === 204) return schema.parse(undefined);
    return schema.parse(ApiEnvelopeSchema.parse(payload).data);
  } catch (error) { throw new ApiError(response.status, "INVALID_RESPONSE", "Respons API tidak sesuai kontrak.", error); }
}
export const queryRetry = (count: number, error: Error) => error.name !== "AbortError" && !(error instanceof ApiError && (error.status < 500 || error.code === "INVALID_RESPONSE")) && count < 2;
