import { achievements } from "@/content/site";
import Reveal from "../ui/Reveal";
import SectionHeader from "../ui/SectionHeader";
import T from "../ui/Text";

export default function Achievements() {
  return (
    <section id="achievements" aria-labelledby="achievements-title" className="relative py-28 md:py-36">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          id="achievements-title"
          index="05"
          eyebrow="Achievements"
          title={
            <>
              Milestones
              <br />
              <span className="text-fg-muted">along the way.</span>
            </>
          }
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {achievements.map((a, i) => (
            <li key={i}>
              <Reveal delay={i * 0.07} className="ticks panel group flex h-full flex-col p-7 transition-colors duration-500 hover:border-signal-500/30">
                <div className="mb-12 flex items-center justify-between">
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/5 px-2.5 py-1 font-mono text-[10px] tracking-widest text-amber-400 uppercase">
                    {a.type}
                  </span>
                  <T className="font-mono text-[11px] text-fg-faint">{a.year}</T>
                </div>
                <h3 className="font-display text-xl font-medium">
                  <T>{a.title}</T>
                </h3>
                <T as="p" className="mt-2 text-sm text-fg-muted">
                  {a.detail}
                </T>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
