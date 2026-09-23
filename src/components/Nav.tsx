"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/content/site";
import Logo from "./Logo";
import { ArrowRight } from "./ui/Icons";

export default function Nav({ resume }: { resume: boolean }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: the section crossing the upper-middle of the viewport is "active".
  useEffect(() => {
    if (!onHome) return;
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? "border-b border-line bg-ink-950/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3 text-fg" aria-label={`${site.name} — home`}>
          <Logo className="h-7 w-7" />
          <span className="hidden font-mono text-[11px] tracking-[0.28em] uppercase sm:inline lg:hidden xl:inline">{site.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => {
            const isActive = onHome && active === n.id;
            return (
              <li key={n.id}>
                <a
                  href={href(n.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-full px-3.5 py-2 text-[13px] transition-colors ${
                    isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {n.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-signal-400 shadow-[0_0_10px_2px_rgb(61_155_255/0.6)]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={href("contact")}
            className="group hidden items-center gap-2 rounded-full border border-signal-500/50 px-4 py-2 text-[13px] text-fg transition-colors hover:bg-signal-500/10 sm:inline-flex"
          >
            Let&apos;s Connect
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute h-px w-4 bg-fg transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`} />
            <span className={`absolute h-px w-4 bg-fg transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 pt-6">
              {nav.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <a
                    href={href(n.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4 font-display text-3xl font-medium"
                  >
                    <span className="font-mono text-xs text-signal-400">0{i}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            {resume && (
              <a href={site.resumePath} download className="label mx-5 mt-8 inline-block text-signal-400">
                Download résumé ↓
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
