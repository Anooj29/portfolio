"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { expertise, isPlaceholder, toolGroups } from "@/content/site";
import { canUseWebGL, useInView } from "@/lib/useInView";
import SectionHeader from "../ui/SectionHeader";
import Reveal from "../ui/Reveal";
import { RATIO, ZP, ZR, ZS } from "../three/gear-spec";

const GearboxScene = dynamic(() => import("../three/GearboxScene"), { ssr: false });

export default function Skills() {
  const [tab, setTab] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const inView = useInView(stage, "200px");
  const [mounted, setMounted] = useState(false);
  const [gl, setGl] = useState(false);
  const reduce = useReducedMotion() ?? false;
  const tabsId = useId();

  useEffect(() => setGl(canUseWebGL()), []);
  // Mount the canvas the first time it approaches the viewport, then keep it (paused when offscreen).
  useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);

  const onSpeed = useCallback((sun: number, carrier: number) => {
    if (readout.current) readout.current.textContent = `${sun.toFixed(1)} → ${carrier.toFixed(1)} rpm`;
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (tab + (e.key === "ArrowRight" ? 1 : -1) + toolGroups.length) % toolGroups.length;
    setTab(next);
    document.getElementById(`${tabsId}-tab-${next}`)?.focus();
  };

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative overflow-hidden py-28 md:py-36">
      <div aria-hidden className="blueprint absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_30%_50%,black,transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          id="skills-title"
          index="03"
          eyebrow="Skills & tools"
          title={
            <>
              A multi-disciplinary
              <br />
              <span className="text-fg-muted">engineering toolkit.</span>
            </>
          }
          lede="Hardware, software and intelligent algorithms, combined into complete systems."
        />

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 [&>*]:min-w-0">
          {/* 3D planetary gearbox */}
          <Reveal>
            <div ref={stage} className="ticks panel relative aspect-square overflow-hidden bg-ink-900/60">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(61_155_255/0.12),transparent_60%)]" />
              {gl && mounted && <GearboxScene active={inView} reducedMotion={reduce} onSpeed={onSpeed} />}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <div>
                  <p className="label text-[10px]!">Fig. 03 — Planetary reduction</p>
                  <p className="mt-1 font-mono text-[11px] text-fg-faint">
                    Z<sub>s</sub>={ZS} · Z<sub>p</sub>={ZP} · Z<sub>r</sub>={ZR}
                  </p>
                </div>
                <p className="font-mono text-[11px] text-signal-300">i = {RATIO}:1</p>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <p className="font-mono text-[10px] text-fg-faint">Hover to drive the sun gear</p>
                <p className="font-mono text-[11px] text-fg-soft tabular-nums">
                  <span className="text-fg-faint">SUN → CARRIER </span>
                  <span ref={readout}>—</span>
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h3 className="label mb-5">Core domains</h3>
              <ul className="mb-12 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {expertise.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 border-b border-line py-3 text-[15px] text-fg-soft">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal-500 shadow-[0_0_8px_rgb(61_155_255/0.9)]" />
                    {e.title}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08}>
              <h3 className="label mb-5">Tools & technologies</h3>
              <div role="tablist" aria-label="Tool categories" className="no-scrollbar -mx-1 mb-5 flex gap-1 overflow-x-auto px-1" onKeyDown={onKey}>
                {toolGroups.map((g, i) => (
                  <button
                    key={g.title}
                    id={`${tabsId}-tab-${i}`}
                    role="tab"
                    type="button"
                    aria-selected={tab === i}
                    aria-controls={`${tabsId}-panel`}
                    tabIndex={tab === i ? 0 : -1}
                    onClick={() => setTab(i)}
                    className={`relative shrink-0 rounded-full px-4 py-2 text-[13px] whitespace-nowrap transition-colors ${
                      tab === i ? "text-fg" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {tab === i && (
                      <motion.span
                        layoutId="skill-tab"
                        className="absolute inset-0 -z-10 rounded-full border border-signal-500/50 bg-signal-500/10"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    {g.title}
                  </button>
                ))}
              </div>

              <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${tab}`} className="min-h-[9.5rem]">
                <AnimatePresence mode="wait">
                  <motion.ul
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                  >
                    {toolGroups[tab].items.map((t) => (
                      <li
                        key={t}
                        className={`panel rounded-xl! px-4 py-3.5 text-sm transition-colors hover:border-signal-500/40 ${
                          isPlaceholder(t) ? "placeholder-text" : "text-fg-soft"
                        }`}
                      >
                        {t}
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
