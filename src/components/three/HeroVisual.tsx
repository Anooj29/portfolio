"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { canUseWebGL, useInView } from "@/lib/useInView";
import type { Telemetry } from "./RobotArmScene";

const RobotArmScene = dynamic(() => import("./RobotArmScene"), { ssr: false });

const fmt = (n: number, d = 1) => (n >= 0 ? "+" : "−") + Math.abs(n).toFixed(d).padStart(d + 3, "0");

export default function HeroVisual() {
  const wrap = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDListElement>(null);
  const inView = useInView(wrap, "0px");
  const reduce = useReducedMotion() ?? false;
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => setGl(canUseWebGL()), []);

  // Write straight to the DOM — telemetry updates 10×/s and shouldn't re-render React.
  const onTelemetry = useCallback((t: Telemetry) => {
    const el = hud.current;
    if (!el) return;
    const vals: Record<string, string> = {
      j1: fmt(t.j1) + "°",
      j2: fmt(t.j2) + "°",
      j3: fmt(t.j3) + "°",
      j5: fmt(t.j5) + "°",
      tcp: `${fmt(t.x, 2)} ${fmt(t.y, 2)} ${fmt(t.z, 2)}`,
    };
    el.querySelectorAll<HTMLElement>("[data-k]").forEach((n) => (n.textContent = vals[n.dataset.k!]));
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      {/* Ambient glow — doubles as the poster while WebGL loads */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_45%_45%_at_68%_55%,rgb(61_155_255/0.14),transparent_70%)] max-lg:bg-[radial-gradient(ellipse_70%_45%_at_50%_60%,rgb(61_155_255/0.16),transparent_70%)]"
      />
      {gl && <RobotArmScene onTelemetry={onTelemetry} reducedMotion={reduce} active={inView} />}

      {gl && (
        <div className="pointer-events-none absolute right-5 bottom-10 hidden lg:right-8 lg:block" aria-hidden>
          <div className="ticks panel rounded-lg! bg-ink-950/50 px-4 py-3 backdrop-blur-md">
            <p className="label mb-2 flex items-center gap-2 text-[10px]!">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 [animation:pulse-dot_1.6s_ease-in-out_infinite]" />
              Live · Inverse kinematics
            </p>
            <dl ref={hud} className="grid grid-cols-[auto_auto] gap-x-6 gap-y-0.5 font-mono text-[11px] tabular-nums">
              {(["j1", "j2", "j3", "j5"] as const).map((k) => (
                <div key={k} className="contents">
                  <dt className="text-fg-faint uppercase">{k}</dt>
                  <dd data-k={k} className="text-right text-fg-soft">
                    +000.0°
                  </dd>
                </div>
              ))}
              <dt className="text-fg-faint">TCP</dt>
              <dd data-k="tcp" className="text-right text-signal-300">
                —
              </dd>
            </dl>
            <p className="mt-2 font-mono text-[10px] text-fg-faint">Move your cursor to guide the arm</p>
          </div>
        </div>
      )}
    </div>
  );
}
