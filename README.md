# Anooj Jilladwar — Portfolio

Dark, engineering-studio portfolio built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · React Three Fiber · Motion**.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Make it yours — checklist before publishing

All content lives in **`src/content/site.ts`**. Nothing there was invented:

| Marker | Meaning |
| --- | --- |
| `"[Add …]"` | Placeholder. Renders in faint italics so it's obvious in review. |
| `// VERIFY` | Taken from the reference mockups (project titles, tags, tools, LinkedIn URL, location). Confirm or replace. |

1. **Projects** — fill in summary, role, year, problem, approach, outcomes, stack. Add `links` for repos/videos.
2. **Experience & Achievements** — replace placeholder entries with real roles, dates and awards.
3. **Tools** — confirm the tool list; delete anything you don't use.
4. **GitHub** — set `socials.github`. The GitHub card appears automatically once it's no longer a placeholder.
5. **Résumé** — drop your PDF at `public/resume.pdf`, then rebuild. Download buttons appear automatically.
6. **Domain** — set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) so canonical URLs, sitemap and OG images are correct.
7. **Project images** — each project currently shows a generated technical schematic (`src/components/Blueprint.tsx`). Swap in photos/renders with `next/image` when you have them.

## Structure

```
src/
  app/                    layout, home, /projects/[slug], sitemap, robots, OG image, 404
  content/site.ts         ← all copy & data
  components/
    sections/             Hero, About, Projects, Skills, Experience, Achievements, Contact
    three/
      RobotArmScene.tsx   6-axis arm, analytic 2-link IK, tracks the cursor, live joint telemetry
      GearboxScene.tsx    planetary set (Zs 12 / Zp 18 / Zr 48 → 5:1) with correct tooth meshing
    ui/                   Reveal, SectionHeader, Button, Icons, placeholder-aware Text
```

## Performance & accessibility notes

- Three.js is code-split and loaded only on the client; the initial page ships without it.
- Canvases pause (`frameloop="never"`) when scrolled offscreen; the gearbox mounts only when it's near the viewport.
- No external HDRIs or models — lighting uses three's procedural `RoomEnvironment`; all geometry is procedural.
- `prefers-reduced-motion` stops idle animation and scroll reveals.
- WebGL is feature-detected; without it the page shows a static glow instead of 3D.
- Semantic landmarks, skip link, keyboard-navigable tabs, visible focus rings, `aria-hidden` on decorative 3D.
- Every route is statically prerendered.
