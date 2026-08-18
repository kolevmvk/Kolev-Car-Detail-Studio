"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * SSR-safe prefers-reduced-motion read. framer-motion's own useReducedMotion
 * reads matchMedia synchronously on the client but always returns null on
 * the server, so branching styles on its raw value renders differently
 * server vs. client and fails hydration for visitors with reduced motion
 * enabled. useSyncExternalStore is the correct primitive for reading this
 * kind of external, changeable browser state without that mismatch.
 */
export function useMountedReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
