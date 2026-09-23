import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "ghost" | "quiet";

const styles: Record<Variant, string> = {
  primary:
    "bg-signal-500 text-ink-950 hover:bg-signal-400 shadow-[0_0_0_1px_rgb(108_180_255/0.4),0_8px_30px_-8px_rgb(61_155_255/0.6)]",
  ghost: "border border-line-strong text-fg hover:border-signal-400/60 hover:bg-white/[0.03]",
  quiet: "text-signal-400 hover:text-signal-300 px-0!",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[background,border-color,color,transform] duration-300 active:scale-[0.98] ${styles[variant]} ${extra}`;
}

type LinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className = "", ...props }: LinkProps) {
  return <Link {...props} className={buttonClass(variant, className)} />;
}

type AProps = ComponentProps<"a"> & { variant?: Variant };

export function ButtonA({ variant = "primary", className = "", ...props }: AProps) {
  return <a {...props} className={buttonClass(variant, className)} />;
}

/** Renders a visibly-disabled button with an explanatory title (e.g. résumé not uploaded yet). */
export function ButtonDisabled({ children, title, variant = "ghost" }: { children: React.ReactNode; title: string; variant?: Variant }) {
  return (
    <span aria-disabled="true" title={title} className={buttonClass(variant, "cursor-not-allowed opacity-40")}>
      {children}
    </span>
  );
}
