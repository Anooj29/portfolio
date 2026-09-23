import { site } from "@/content/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-4">
          <Logo className="h-8 w-8 text-fg" />
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase">{site.name}</p>
            <p className="mt-1 text-xs text-fg-muted">Engineer · Builder · Problem Solver</p>
          </div>
        </div>
        <p className="font-mono text-[11px] tracking-wider text-fg-faint">
          © {new Date().getFullYear()} {site.name}. Designed &amp; engineered from scratch.
        </p>
      </div>
    </footer>
  );
}
