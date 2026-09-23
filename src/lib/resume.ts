import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { site } from "@/content/site";

/** True when /public/resume.pdf exists — lets résumé buttons disable themselves gracefully. */
export function hasResume(): boolean {
  return existsSync(path.join(process.cwd(), "public", site.resumePath.replace(/^\//, "")));
}
