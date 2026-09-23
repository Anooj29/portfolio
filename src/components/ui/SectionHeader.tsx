import Reveal from "./Reveal";

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
};

export default function SectionHeader({ index, eyebrow, title, lede, action, id }: Props) {
  return (
    <Reveal className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="label mb-5 flex items-center gap-3">
          <span className="text-signal-400">{index}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          {eyebrow}
        </p>
        <h2 id={id} className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-5xl">
          {title}
        </h2>
        {lede && <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">{lede}</p>}
      </div>
      {action}
    </Reveal>
  );
}
