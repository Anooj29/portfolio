"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RATIO, ZP, ZR, ZS } from "./gear-spec";

/* (Zs + Zr) % 3 === 0 → three equally spaced planets mesh with both sun and ring. */
const MOD = 0.1; // module
const r = (z: number) => (MOD * z) / 2;
const DEPTH = 0.32;

/** External spur gear outline — trapezoidal teeth centred on angle 0 + k·pitch. */
function spurShape(z: number, bore: number) {
  const rp = r(z);
  const ra = rp + MOD;
  const rf = rp - 1.25 * MOD;
  const p = (Math.PI * 2) / z;
  const s = new THREE.Shape();
  for (let k = 0; k < z; k++) {
    const a = k * p;
    const pts: [number, number][] = [
      [rf, a - p * 0.5],
      [rf, a - p * 0.27],
      [ra, a - p * 0.12],
      [ra, a + p * 0.12],
      [rf, a + p * 0.27],
    ];
    pts.forEach(([rad, ang], i) => {
      const x = Math.cos(ang) * rad;
      const y = Math.sin(ang) * rad;
      if (k === 0 && i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    });
  }
  s.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, bore, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return s;
}

/** Internal ring gear — plain outer rim, teeth pointing inward (tooth tips at rp − m). */
function ringShape(z: number, outer: number) {
  const rp = r(z);
  const tip = rp - MOD;
  const root = rp + 1.25 * MOD;
  const p = (Math.PI * 2) / z;
  const s = new THREE.Shape();
  s.absarc(0, 0, outer, 0, Math.PI * 2, false);
  const h = new THREE.Path();
  for (let k = z - 1; k >= 0; k--) {
    const a = k * p;
    const pts: [number, number][] = [
      [root, a + p * 0.5],
      [root, a + p * 0.27],
      [tip, a + p * 0.12],
      [tip, a - p * 0.12],
      [root, a - p * 0.27],
    ];
    pts.forEach(([rad, ang], i) => {
      const x = Math.cos(ang) * rad;
      const y = Math.sin(ang) * rad;
      if (k === z - 1 && i === 0) h.moveTo(x, y);
      else h.lineTo(x, y);
    });
  }
  h.closePath();
  s.holes.push(h);
  return s;
}

const extrude = (shape: THREE.Shape, depth = DEPTH) => {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.012,
    bevelSegments: 2,
    curveSegments: 24,
  });
  g.translate(0, 0, -depth / 2);
  return g;
};

type Props = { active: boolean; reducedMotion: boolean; onSpeed?: (sunRpm: number, carrierRpm: number) => void };

function Gearbox({ reducedMotion, onSpeed }: Omit<Props, "active">) {
  const sun = useRef<THREE.Mesh>(null!);
  const carrier = useRef<THREE.Group>(null!);
  const planets = useRef<THREE.Mesh[]>([]);
  const tilt = useRef<THREE.Group>(null!);
  const state = useRef({ theta: 0, speed: 0.6, targetSpeed: 0.6, px: 0, py: 0, tick: 0 });

  const geo = useMemo(
    () => ({
      sun: extrude(spurShape(ZS, 0.12), DEPTH + 0.1),
      planet: extrude(spurShape(ZP, 0.16)),
      ring: extrude(ringShape(ZR, r(ZR) + 0.34), DEPTH + 0.04),
    }),
    [],
  );
  const mat = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({ color: "#6b7480", metalness: 1, roughness: 0.32 }),
      dark: new THREE.MeshStandardMaterial({ color: "#1c222c", metalness: 0.9, roughness: 0.35 }),
      brass: new THREE.MeshStandardMaterial({ color: "#c9a068", metalness: 1, roughness: 0.3 }),
      carrier: new THREE.MeshStandardMaterial({
        color: "#3d9bff",
        metalness: 0.2,
        roughness: 0.4,
        transparent: true,
        opacity: 0.22,
        emissive: "#1f7ae6",
        emissiveIntensity: 0.6,
        depthWrite: false,
      }),
      glow: new THREE.MeshBasicMaterial({ color: "#6cb4ff", toneMapped: false }),
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      state.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      state.current.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, dt) => {
    const s = state.current;
    dt = Math.min(dt, 1 / 20);
    s.speed = THREE.MathUtils.damp(s.speed, reducedMotion ? 0 : s.targetSpeed, 2, dt);
    s.theta += s.speed * dt;

    // Kinematics (ring fixed): ωc = ωs·Zs/(Zs+Zr);  planet absolute angle keeps teeth meshed with sun and ring.
    const θs = s.theta;
    const θc = (θs * ZS) / (ZS + ZR);
    sun.current.rotation.z = θs;
    carrier.current.rotation.z = θc;
    planets.current.forEach((p, i) => {
      const φ = θc + (i * Math.PI * 2) / 3;
      const ψ = φ + Math.PI - Math.PI / ZP + ((φ - θs) * ZS) / ZP;
      p.rotation.z = ψ - θc; // planets are children of the carrier
    });

    tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, -0.55 + s.py * 0.15, 3, dt);
    tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, 0.35 + s.px * 0.25, 3, dt);

    if (onSpeed && ++s.tick % 10 === 0) {
      const rpm = (s.speed / (Math.PI * 2)) * 60;
      onSpeed(rpm, rpm / RATIO);
    }
  });

  const orbit = r(ZS) + r(ZP);

  return (
    <group
      ref={tilt}
      onPointerEnter={() => (state.current.targetSpeed = 2.4)}
      onPointerLeave={() => (state.current.targetSpeed = 0.6)}
    >
      <mesh geometry={geo.ring} material={mat.dark} />
      <mesh ref={sun} geometry={geo.sun} material={mat.brass} />
      <mesh material={mat.glow} position={[0, 0, DEPTH / 2 + 0.07]}>
        <circleGeometry args={[0.05, 24]} />
      </mesh>
      <group ref={carrier}>
        {/* triangular carrier plate — vertices rotated onto the planet pins */}
        <group rotation={[0, 0, Math.PI / 2]} position={[0, 0, DEPTH / 2 + 0.06]}>
          <mesh material={mat.carrier} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[orbit + 0.3, orbit + 0.3, 0.04, 3, 1]} />
          </mesh>
        </group>
        {[0, 1, 2].map((i) => {
          const a = (i * Math.PI * 2) / 3;
          return (
            <group key={i} position={[Math.cos(a) * orbit, Math.sin(a) * orbit, 0]}>
              <mesh
                ref={(m) => {
                  if (m) planets.current[i] = m;
                }}
                geometry={geo.planet}
                material={mat.steel}
              />
              <mesh material={mat.dark} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, DEPTH + 0.16, 24]} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.6;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

export default function GearboxScene({ active, reducedMotion, onSpeed }: Props) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 28, position: [0, 0, 15.5] }}
      aria-hidden
    >
      <Env />
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <directionalLight position={[-4, -2, 3]} intensity={1.2} color="#3d9bff" />
      <pointLight position={[0, 0, 2.5]} intensity={2} distance={6} color="#ffb454" />
      <Gearbox reducedMotion={reducedMotion} onSpeed={onSpeed} />
    </Canvas>
  );
}
