import { experience } from "@/content/site";
import Reveal from "../ui/Reveal";
import SectionHeader from "../ui/SectionHeader";
import T from "../ui/Text";
import { buttonClass } from "../ui/Button";
import { ArrowRight } from "../ui/Icons";

export default function Experience({ resume, resumePath }: { resume: boolean; resumePath: string }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-28 md:py-36">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          id="experience-title"
          index="04"
          eyebrow="Experience"
          title={
            <>
              A journey of
              <br />
              <span className="text-fg-muted">continuous growth.</span>
            </>
          }
          action={
            resume ? (
              <a href={resumePath} target="_blank" rel="noopener" className={buttonClass("ghost")}>
                View full résumé <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : undefined
          }
        />

        <ol className="relative">
          <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-signal-500 via-line-strong to-transparent md:left-[calc(25%+5px)]" />
          {experience.map((x, i) => (
            <li key={i} className="relative grid gap-3 pb-14 pl-9 last:pb-0 md:grid-cols-4 md:gap-10 md:pl-0">
              <Reveal className="md:pr-10 md:text-right">
                <T className={`font-mono text-[12px] tracking-wider ${i === 0 ? "text-signal-400" : "text-fg-muted"}`}>{x.period}</T>
              </Reveal>
              <span
                aria-hidden
                className={`absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full border-2 border-ink-950 md:left-[25%] ${
                  i === 0 ? "bg-signal-400 shadow-[0_0_0_4px_rgb(61_155_255/0.18),0_0_16px_rgb(61_155_255/0.8)]" : "bg-fg-faint"
                }`}
              />
              <Reveal delay={0.05} className="md:col-span-3 md:pl-10">
                <h3 className="font-display text-xl font-medium md:text-2xl">
                  <T>{x.role}</T>
                </h3>
                <T as="p" className="mt-1 text-sm text-fg-soft">
                  {x.org}
                </T>
                <T as="p" className="mt-3 max-w-2xl leading-relaxed text-fg-muted">
                  {x.summary}
                </T>
                <ul className="mt-4 space-y-1.5">
                  {x.highlights.map((h, j) => (
                    <li key={j} className="flex gap-3 text-sm text-fg-muted">
                      <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-signal-500" />
                      <T>{h}</T>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
