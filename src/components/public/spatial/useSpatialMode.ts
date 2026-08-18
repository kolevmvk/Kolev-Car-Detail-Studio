"use client";

import { useSyncExternalStore } from "react";

export type SpatialMode = "pending" | "webgl" | "webgl-low" | "fallback";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

const QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(max-width: 640px)",
  "(pointer: coarse)",
] as const;

function subscribe(callback: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((mql) => mql.addEventListener("change", callback));
  return () => {
    lists.forEach((mql) => mql.removeEventListener("change", callback));
  };
}

function getSnapshot(): SpatialMode {
  const [reduce, narrow, coarse] = QUERIES.map((q) => window.matchMedia(q).matches);
  if (reduce || !supportsWebGL()) return "fallback";
  return narrow && coarse ? "webgl-low" : "webgl";
}

function getServerSnapshot(): SpatialMode {
  return "pending";
}

/** Shared mode detection for every WebGL spatial scene on the public site. */
export function useSpatialMode(): SpatialMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
