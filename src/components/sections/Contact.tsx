import { isPlaceholder, site } from "@/content/site";
import Reveal from "../ui/Reveal";
import CopyEmail from "../ui/CopyEmail";
import { buttonClass } from "../ui/Button";
import { ArrowRight, Download, GitHub, LinkedIn, Mail, Pin } from "../ui/Icons";

export default function Contact({ resume }: { resume: boolean }) {
  const github = !isPlaceholder(site.socials.github);
  const channels = [
    { icon: LinkedIn, label: "LinkedIn", value: site.socials.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: site.socials.linkedin },
    ...(github
      ? [{ icon: GitHub, label: "GitHub", value: site.socials.github.replace(/^https?:\/\//, ""), href: site.socials.github }]
      : []),
    { icon: Pin, label: "Location", value: site.location },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden py-28 md:py-40">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_85%_100%,rgb(61_155_255/0.16),transparent_70%)]" />
      <div aria-hidden className="blueprint absolute inset-0 -z-10 [mask-image:linear-gradient(to_top,black,transparent)]" />
      {/* Planet horizon */}
      <div
        aria-hidden
        className="absolute -right-[18rem] -bottom-[46rem] -z-10 h-[64rem] w-[64rem] rounded-full border-t border-signal-300/40 bg-[radial-gradient(circle_at_50%_0%,rgb(20_40_70),#05070b_55%)] shadow-[0_-30px_120px_-30px_rgb(61_155_255/0.55)] max-md:-right-[30rem] max-md:-bottom-[52rem]"
      />
      <div
        aria-hidden
        className="absolute -right-[18rem] -bottom-[46rem] -z-10 h-[64rem] w-[64rem] scale-[1.06] rounded-full border-t border-signal-500/10 max-md:-right-[30rem] max-md:-bottom-[52rem]"
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="label mb-5 flex items-center gap-3">
            <span className="text-signal-400">06</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            Contact
          </p>
          <h2 id="contact-title" className="font-display text-5xl leading-[0.98] font-semibold tracking-tight text-balance md:text-7xl">
            Let&apos;s build something
            <br />
            <span className="text-gradient">meaningful.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-fg-muted">
            Open to roles, collaborations and conversations in robotics, AI, mechanical design and product development.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 flex flex-wrap gap-3">
          <a href={`mailto:${site.email}`} className={buttonClass("primary", "px-6 py-3")}>
            <Mail /> Get in touch <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
          {resume && (
            <a href={site.resumePath} download className={buttonClass("ghost", "px-6 py-3")}>
              <Download /> Download résumé
            </a>
          )}
        </Reveal>

        <Reveal delay={0.14} className="mt-14 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-[1.35fr_1.2fr_1fr]">
          <div className="panel flex items-center gap-4 rounded-xl! p-4 sm:col-span-2 lg:col-span-1">
            <Mail className="h-5 w-5 shrink-0 text-signal-400" />
            <div className="min-w-0 flex-1">
              <p className="label text-[10px]!">Email</p>
              <a href={`mailto:${site.email}`} className="block truncate text-sm text-fg-soft hover:text-fg">
                {site.email}
              </a>
            </div>
            <CopyEmail email={site.email} />
          </div>
          {channels.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <>
                <Icon className="h-5 w-5 shrink-0 text-signal-400" />
                <div className="min-w-0">
                  <p className="label text-[10px]!">{label}</p>
                  <p className="truncate text-sm text-fg-soft">{value}</p>
                </div>
              </>
            );
            return href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="panel flex items-center gap-4 rounded-xl! p-4 transition-colors hover:border-signal-500/40"
              >
                {inner}
                <span className="sr-only">(opens in new tab)</span>
              </a>
            ) : (
              <div key={label} className="panel flex items-center gap-4 rounded-xl! p-4">
                {inner}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
