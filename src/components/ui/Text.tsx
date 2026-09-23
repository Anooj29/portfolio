import { isPlaceholder } from "@/content/site";

/** Renders content, styling "[placeholder]" strings so they're visible in review but never mistaken for real copy. */
export default function T({ children, as: Tag = "span", className = "" }: { children: string; as?: "span" | "p" | "li"; className?: string }) {
  const ph = isPlaceholder(children);
  return <Tag className={`${className} ${ph ? "placeholder-text" : ""}`}>{children}</Tag>;
}
