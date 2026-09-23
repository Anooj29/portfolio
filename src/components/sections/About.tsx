import { expertise, site } from "@/content/site";
import Reveal from "../ui/Reveal";
import SectionHeader from "../ui/SectionHeader";
import { Pin } from "../ui/Icons";

const process = ["Ideate", "Design", "Prototype", "Test", "Iterate"];

export default function About() {
  const spec: [string, string][] = [
    ["Name", site.name],
    ["Discipline", "Robotics · Mechanical · AI"],
    ["Focus", "New product development"],
    ["Based in", site.location],
    ["Status", site.availability],
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          id="about-title"
          index="01"
          eyebrow="About"
          title={
            <>
              Curious mind.
              <br />
              <span className="text-fg-muted">Practical builder.</span>
            </>
          }
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="text-xl leading-relaxed text-fg-soft text-pretty md:text-2xl md:leading-relaxed">
              I&apos;m an engineer working where <span className="text-fg">mechanical design</span>,{" "}
              <span className="text-fg">electronics</span> and <span className="text-fg">intelligent software</span> meet.
              I like taking an idea from a rough sketch to a machine that works in the real world — and I care as much about how
              it&apos;s built as about what it does.
            </p>
            <p className="mt-6 max-w-2xl leading-relaxed text-fg-muted">
              My work spans robotics and AI, CAD-driven mechanical design, embedded systems, electric mobility and autonomous
              systems on ROS2 — tied together by a product-development mindset: understand the problem, build fast, test honestly,
              iterate.
            </p>

            {/* Process strip */}
            <ol className="mt-12 flex flex-wrap items-center gap-y-3" aria-label="How I work">
              {process.map((p, i) => (
                <li key={p} className="flex items-center">
                  <span className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] tracking-widest text-fg-soft uppercase">
                    <span className="mr-2 text-signal-400">{String(i + 1).padStart(2, "0")}</span>
                    {p}
                  </span>
                  {i < process.length - 1 && <span aria-hidden className="mx-2 h-px w-5 bg-line-strong" />}
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Spec sheet */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="ticks panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="label text-[10px]!">Spec sheet</span>
                <span className="font-mono text-[10px] text-fg-faint">REV A</span>
              </div>
              <dl className="divide-y divide-line">
                {spec.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 px-5 py-3.5 text-sm">
                    <dt className="font-mono text-[11px] tracking-wider text-fg-faint uppercase">{k}</dt>
                    <dd className="flex items-center gap-2 text-fg-soft">
                      {k === "Based in" && <Pin className="text-fg-muted" />}
                      {k === "Status" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153/0.8)]" />}
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        {/* Expertise domains */}
        <ul className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((e, i) => (
            <li key={e.id} className="bg-ink-950">
              <Reveal delay={(i % 3) * 0.06} className="group relative h-full p-7 transition-colors duration-500 hover:bg-ink-850">
                <div className="mb-10 flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-widest text-signal-400">{e.code}</span>
                  <span className="font-mono text-[11px] text-fg-faint">{String(i + 1).padStart(2, "0")}/06</span>
                </div>
                <h3 className="font-display text-xl font-medium">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{e.blurb}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-signal-500 to-transparent transition-transform duration-700 group-hover:scale-x-100"
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
