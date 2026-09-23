import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — Robotics & Product Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(ellipse at 80% 70%, #0f2a4a 0%, #05070b 60%)",
          color: "#eef2f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 6, color: "#7d889b" }}>
          ENGINEER · BUILDER · PROBLEM SOLVER
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 0.95, letterSpacing: -4 }}>ANOOJ</div>
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 0.95, letterSpacing: -4 }}>JILLADWAR</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#b6c0cf" }}>{site.roles.join("  ·  ")}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20, color: "#6cb4ff" }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#3d9bff" }} />
          {site.tagline}
        </div>
      </div>
    ),
    size,
  );
}
