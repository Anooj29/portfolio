"use client";

import { useState } from "react";
import { Check, Copy } from "./Icons";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-signal-400 hover:text-fg"
      aria-label={copied ? "Email copied" : "Copy email address"}
    >
      {copied ? <Check className="text-emerald-400" /> : <Copy />}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
