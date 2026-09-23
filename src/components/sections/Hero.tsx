"use client";

import { motion, useReducedMotion } from "motion/react";
import { expertise, projects, site } from "@/content/site";
import HeroVisual from "../three/HeroVisual";
import { ArrowRight, Download } from "../ui/Icons";
import { buttonClass } from "../ui/Button";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero({ resume }: { resume: boolean }) {
  const reduce = useReducedMotion();
  const rise = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay: 0.15 + i * 0.09, ease },
  });

  const stats = [
    { v: String(projects.length), l: "Featured builds" },
    { v: String(expertise.length), l: "Engineering domains" },
    { v: "∞", l: "Ideas to build" },
  ];

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col overflow-hidden lg:min-h-[100svh] lg:justify-center lg:pt-16"
    >
      <div aria-hidden className="blueprint absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_60%_40%,black,transparent_75%)]" />
      {/* 3D stage: in-flow on small screens, full-bleed backdrop on large */}
      <div className="relative order-2 -mt-4 h-[min(56vh,460px)] lg:absolute lg:inset-0 lg:-z-10 lg:mt-0 lg:h-auto">
        <HeroVisual />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink-950 to-transparent" />

      <div className="order-1 mx-auto w-full max-w-7xl px-5 pt-28 md:px-8 lg:pt-0">
        <div className="max-w-2xl">
          <motion.p {...rise(0)} className="label mb-6">
            Engineer <span className="text-signal-400">·</span> Builder <span className="text-signal-400">·</span> Problem Solver
          </motion.p>
          <motion.h1
            {...rise(1)}
            id="hero-title"
            className="font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.035em] uppercase"
          >
            <span className="text-gradient block">Anooj</span>
            <span className="text-gradient block">Jilladwar</span>
          </motion.h1>
          <motion.p {...rise(2)} className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-[15px] text-fg-soft md:text-base">
            {site.roles.map((r, i) => (
              <span key={r} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-signal-500" />}
                {r}
              </span>
            ))}
          </motion.p>
          <motion.p {...rise(3)} className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted md:text-lg">
            {site.intro}
          </motion.p>
          <motion.div {...rise(4)} className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className={buttonClass("primary")}>
              View my work <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            {resume ? (
              <a href={site.resumePath} download className={buttonClass("ghost")}>
                <Download /> Download résumé
              </a>
            ) : (
              <a href="#about" className={buttonClass("ghost")}>
                About me
              </a>
            )}
          </motion.div>
        </div>
      </div>

      <div className="order-3 mx-auto w-full max-w-7xl px-5 pb-16 md:px-8 lg:pb-0">
        <motion.dl {...rise(5)} className="flex max-w-md divide-x divide-line lg:mt-16">
          {stats.map((s) => (
            <div key={s.l} className="flex-1 px-5 first:pl-0">
              <dt className="sr-only">{s.l}</dt>
              <dd className="font-display text-3xl font-medium tabular-nums">{s.v}</dd>
              <dd className="mt-1 text-xs text-fg-muted">{s.l}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
