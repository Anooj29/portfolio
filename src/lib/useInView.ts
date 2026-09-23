"use client";

import { useEffect, useState, type RefObject } from "react";

/** Lightweight IntersectionObserver hook — used to pause WebGL when offscreen. */
export function useInView(ref: RefObject<Element | null>, rootMargin = "100px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** WebGL support probe — lets us fall back to a static visual on unsupported devices. */
export function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
