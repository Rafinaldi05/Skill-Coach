import { useSyncExternalStore } from "react";
import type { TokenPair } from "@skill-coach/shared";

const KEY = "skill-coach.refreshToken";
let accessToken: string | null = null;
let generation = 0;
const listeners = new Set<() => void>();
const boundaries = new Set<() => void>();
let refreshToken: string | null = null;
try { refreshToken = sessionStorage.getItem(KEY); } catch { /* Storage may be unavailable. */ }
const emit = () => listeners.forEach(listener => listener());
export const session = {
  get accessToken() { return accessToken; },
  get refreshToken() { return refreshToken; },
  get generation() { return generation; },
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  onBoundary(listener: () => void) { boundaries.add(listener); return () => { boundaries.delete(listener); }; },
  replace(tokens: TokenPair | null) {
    generation++;
    boundaries.forEach(listener => listener());
    session.rotate(tokens);
  },
  rotate(tokens: TokenPair | null) {
    accessToken = tokens?.accessToken ?? null;
    refreshToken = tokens?.refreshToken ?? null;
    try {
      if (refreshToken) sessionStorage.setItem(KEY, refreshToken);
      else sessionStorage.removeItem(KEY);
    } catch { /* In-memory session still works. */ }
    emit();
  },
};
export function useSession() {
  return useSyncExternalStore(session.subscribe, () => session.generation + ":" + Boolean(session.accessToken || session.refreshToken), () => "0:false");
}
export function useAuthenticated() {
  useSession();
  return Boolean(session.accessToken || session.refreshToken);
}
