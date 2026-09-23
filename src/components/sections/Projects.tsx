import Link from "next/link";
import { projects } from "@/content/site";
import Blueprint from "../Blueprint";
import Reveal from "../ui/Reveal";
import SectionHeader from "../ui/SectionHeader";
import T from "../ui/Text";
import { ArrowUpRight } from "../ui/Icons";

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-28 md:py-36">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          id="projects-title"
          index="02"
          eyebrow="Selected projects"
          title={
            <>
              Real projects.
              <br />
              <span className="text-fg-muted">Real hardware.</span>
            </>
          }
          lede="A selection of my work across robotics, AI, mechanical design and product development. Each one links to a full breakdown."
        />

        <ul className="grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <Link
                  href={`/projects/${p.slug}`}
                  className="group ticks panel relative flex h-full flex-col overflow-hidden transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-signal-500/40 hover:shadow-[0_30px_80px_-30px_rgb(61_155_255/0.35)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-ink-900">
                    <Blueprint
                      kind={p.kind}
                      className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-4 left-4 font-mono text-[11px] tracking-widest text-fg-muted">
                      P—{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-6 p-6">
                    <div>
                      <h3 className="font-display text-xl font-medium md:text-2xl">{p.title}</h3>
                      <T as="p" className="mt-2 text-sm text-fg-muted">
                        {p.summary}
                      </T>
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                        {p.tags.map((t) => (
                          <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-wider text-fg-soft uppercase">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong transition-colors duration-300 group-hover:border-signal-400 group-hover:bg-signal-500 group-hover:text-ink-950">
                      <ArrowUpRight />
                      <span className="sr-only">View case study</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
