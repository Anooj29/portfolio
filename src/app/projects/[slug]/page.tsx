import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isPlaceholder, projects, site } from "@/content/site";
import Blueprint from "@/components/Blueprint";
import Reveal from "@/components/ui/Reveal";
import T from "@/components/ui/Text";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { buttonClass } from "@/components/ui/Button";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const description = isPlaceholder(p.summary) ? `${p.title} — ${p.tags.join(", ")}. A project by ${site.name}.` : p.summary;
  return {
    title: p.title,
    description,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} — ${site.name}`, description, url: `/projects/${p.slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  const meta: [string, string][] = [
    ["Role", p.role],
    ["Year", p.year],
    ["Status", p.status],
  ];

  return (
    <article className="relative pt-28 md:pt-36">
      <div aria-hidden className="blueprint absolute inset-x-0 top-0 -z-10 h-[80vh] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Link href="/#projects" className={buttonClass("quiet", "mb-10 text-[13px]")}>
          <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" /> All projects
        </Link>

        <Reveal>
          <p className="label mb-5 flex items-center gap-3">
            <span className="text-signal-400">P—{String(index + 1).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            Case study
          </p>
          <h1 className="font-display text-5xl leading-[0.98] font-semibold tracking-tight text-balance md:text-7xl">{p.title}</h1>
          <T as="p" className="mt-6 max-w-2xl text-lg text-fg-soft">
            {p.summary}
          </T>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
            {p.tags.map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] tracking-wider text-fg-soft uppercase">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="ticks panel mt-14 overflow-hidden bg-ink-900">
          <Blueprint kind={p.kind} className="aspect-[16/9] w-full md:aspect-[21/9]" />
        </Reveal>

        <div className="mt-16 grid gap-14 pb-24 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <dl className="ticks panel divide-y divide-line lg:sticky lg:top-24">
              {meta.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6rem_1fr] gap-4 px-5 py-4 text-sm">
                  <dt className="font-mono text-[11px] tracking-wider text-fg-faint uppercase">{k}</dt>
                  <dd>
                    <T className="text-fg-soft">{v}</T>
                  </dd>
                </div>
              ))}
              <div className="px-5 py-4">
                <dt className="mb-3 font-mono text-[11px] tracking-wider text-fg-faint uppercase">Stack</dt>
                <dd className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <T key={s} className="rounded-md border border-line px-2 py-1 text-xs text-fg-soft">
                      {s}
                    </T>
                  ))}
                </dd>
              </div>
              {p.links?.length ? (
                <div className="flex flex-col gap-2 px-5 py-4">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={buttonClass("quiet", "justify-start text-sm")}>
                      {l.label} <ArrowUpRight />
                    </a>
                  ))}
                </div>
              ) : null}
            </dl>
          </aside>

          <div className="space-y-16 lg:col-span-8">
            <Reveal>
              <h2 className="label mb-4">01 — The problem</h2>
              <T as="p" className="text-xl leading-relaxed text-fg-soft">
                {p.problem}
              </T>
            </Reveal>
            <Reveal>
              <h2 className="label mb-6">02 — Approach</h2>
              <ol className="space-y-px overflow-hidden rounded-xl border border-line bg-line">
                {p.approach.map((a, i) => (
                  <li key={i} className="flex gap-5 bg-ink-950 p-5">
                    <span className="font-mono text-sm text-signal-400">{String(i + 1).padStart(2, "0")}</span>
                    <T className="text-fg-soft">{a}</T>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal>
              <h2 className="label mb-6">03 — Outcomes</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {p.outcomes.map((o, i) => (
                  <li key={i} className="panel p-6">
                    <T className="text-fg-soft">{o}</T>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <h2 className="label mb-6">04 — Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((n) => (
                  <div key={n} className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-line-strong text-center">
                    <span className="placeholder-text px-4 text-sm">[Add photo / render {n}]</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Link
        href={`/projects/${next.slug}`}
        className="group block border-t border-line transition-colors hover:bg-ink-900"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-14 md:px-8">
          <div>
            <p className="label mb-2">Next project</p>
            <p className="font-display text-3xl font-medium md:text-5xl">{next.title}</p>
          </div>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-signal-400 group-hover:bg-signal-500 group-hover:text-ink-950">
            <ArrowRight className="h-5 w-5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
