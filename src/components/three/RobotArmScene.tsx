"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ─── Kinematic constants (scene units ≈ metres) ─── */
const SHOULDER_Y = 0.95; // height of J2 above the floor
const L1 = 1.45; // upper arm
const L2 = 1.25; // forearm
const TOOL = 0.42; // wrist → tool-centre-point
const DEG = 180 / Math.PI;

export type Telemetry = { j1: number; j2: number; j3: number; j5: number; x: number; y: number; z: number };

type Props = {
  /** Called ~10×/s with live joint angles — lets the page render a HUD without re-rendering React. */
  onTelemetry?: (t: Telemetry) => void;
  reducedMotion: boolean;
  active: boolean;
};

/* ─── Shared materials (created once) ─── */
function useMaterials() {
  return useMemo(() => {
    const shell = new THREE.MeshPhysicalMaterial({
      color: "#e8ecf2",
      roughness: 0.32,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.25,
    });
    const graphite = new THREE.MeshStandardMaterial({ color: "#1b212c", roughness: 0.38, metalness: 0.85 });
    const steel = new THREE.MeshStandardMaterial({ color: "#9aa4b2", roughness: 0.22, metalness: 1 });
    const amber = new THREE.MeshStandardMaterial({
      color: "#2a1a05",
      emissive: "#ffb454",
      emissiveIntensity: 2.2,
      toneMapped: false,
    });
    const signal = new THREE.MeshStandardMaterial({
      color: "#07121f",
      emissive: "#3d9bff",
      emissiveIntensity: 2.6,
      toneMapped: false,
    });
    const holo = new THREE.MeshBasicMaterial({
      color: "#6cb4ff",
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      toneMapped: false,
    });
    return { shell, graphite, steel, amber, signal, holo };
  }, []);
}

/** A joint housing: a short cylinder lying along X with an emissive ring on each face. */
function JointHousing({ r, w, m, ring = "amber" }: { r: number; w: number; m: ReturnType<typeof useMaterials>; ring?: "amber" | "signal" }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh material={m.graphite}>
        <cylinderGeometry args={[r, r, w, 48]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[0, (s * w) / 2, 0]}>
          <mesh material={m.shell} position={[0, s * 0.012, 0]}>
            <cylinderGeometry args={[r * 0.82, r * 0.82, 0.03, 48]} />
          </mesh>
          <mesh material={ring === "amber" ? m.amber : m.signal} position={[0, s * 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r * 0.55, 0.012, 8, 64]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RobotArm({ onTelemetry, reducedMotion }: Omit<Props, "active">) {
  const m = useMaterials();
  const j1 = useRef<THREE.Group>(null!);
  const j2 = useRef<THREE.Group>(null!);
  const j3 = useRef<THREE.Group>(null!);
  const j5 = useRef<THREE.Group>(null!);
  const j6 = useRef<THREE.Group>(null!);
  const fingerL = useRef<THREE.Mesh>(null!);
  const fingerR = useRef<THREE.Mesh>(null!);
  const marker = useRef<THREE.Group>(null!);

  const pointer = useRef({ x: 0.35, y: 0.1, lastMove: -10 });
  const target = useRef(new THREE.Vector3(0.8, 1.4, 1.6));
  const angles = useRef({ j1: 0, j2: 0, j3: 0, j5: 0 });
  const tick = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.current.lastMove = performance.now() / 1000;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    const idle = now - pointer.current.lastMove > 2.5;
    dt = Math.min(dt, 1 / 20);

    // 1. Choose a goal for the tool-centre-point: cursor-driven, or a slow figure-eight when idle.
    let gx: number, gy: number, gz: number;
    if (idle && !reducedMotion) {
      gx = Math.sin(t * 0.45) * 1.25;
      gy = 1.25 + Math.sin(t * 0.9) * 0.45;
      gz = 1.55 + Math.cos(t * 0.45) * 0.35;
    } else if (idle) {
      gx = 0.9;
      gy = 1.35;
      gz = 1.5;
    } else {
      gx = pointer.current.x * 2.0;
      gy = 1.3 + pointer.current.y * 0.9;
      gz = 1.7 - Math.abs(pointer.current.x) * 0.5;
    }
    const tg = target.current;
    tg.x = THREE.MathUtils.damp(tg.x, gx, 4, dt);
    tg.y = THREE.MathUtils.damp(tg.y, gy, 4, dt);
    tg.z = THREE.MathUtils.damp(tg.z, gz, 4, dt);

    // 2. Inverse kinematics. J1 yaws the arm plane toward the target;
    //    J2/J3 solve a planar 2-link chain to the wrist centre; J5 keeps the tool pitched at φ.
    const yaw = Math.atan2(tg.x, tg.z);
    const phi = Math.PI / 2 + 0.55; // tool angle from vertical (points forward-down)
    const horiz = Math.hypot(tg.x, tg.z);
    const wf = horiz - Math.sin(phi) * TOOL; // wrist centre, forward coordinate
    const wu = tg.y - SHOULDER_Y - Math.cos(phi) * TOOL; // wrist centre, up coordinate
    const d = THREE.MathUtils.clamp(Math.hypot(wf, wu), Math.abs(L1 - L2) + 0.05, L1 + L2 - 0.02);
    const a2 = Math.acos(THREE.MathUtils.clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1));
    const beta = Math.atan2(wf, wu);
    const a1 = beta - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2));
    const a3 = phi - a1 - a2;

    const A = angles.current;
    const k = 7;
    A.j1 = THREE.MathUtils.damp(A.j1, yaw, k, dt);
    A.j2 = THREE.MathUtils.damp(A.j2, a1, k, dt);
    A.j3 = THREE.MathUtils.damp(A.j3, a2, k, dt);
    A.j5 = THREE.MathUtils.damp(A.j5, a3, k, dt);

    j1.current.rotation.y = A.j1;
    j2.current.rotation.x = A.j2;
    j3.current.rotation.x = A.j3;
    j5.current.rotation.x = A.j5;
    j6.current.rotation.y = reducedMotion ? 0 : t * 0.6;

    const grip = reducedMotion ? 0.06 : 0.045 + (Math.sin(t * 1.6) * 0.5 + 0.5) * 0.04;
    fingerL.current.position.x = -grip;
    fingerR.current.position.x = grip;

    marker.current.position.copy(tg);
    marker.current.rotation.y = t * 0.8;

    if (onTelemetry && ++tick.current % 6 === 0) {
      onTelemetry({ j1: A.j1 * DEG, j2: A.j2 * DEG, j3: A.j3 * DEG, j5: A.j5 * DEG, x: tg.x, y: tg.y, z: tg.z });
    }
  });

  return (
    <group>
      {/* Base plinth */}
      <mesh material={m.graphite} position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.78, 0.84, 0.12, 64]} />
      </mesh>
      <mesh material={m.signal} position={[0, 0.125, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.008, 8, 96]} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} material={m.steel} position={[Math.cos(a) * 0.66, 0.13, Math.sin(a) * 0.66]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          </mesh>
        );
      })}

      {/* J1 — waist */}
      <group ref={j1} position={[0, 0.12, 0]}>
        <mesh material={m.shell} position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.46, 0.56, 0.44, 64]} />
        </mesh>
        <mesh material={m.amber} position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.01, 8, 96]} />
        </mesh>
        {/* shoulder yoke */}
        {[-1, 1].map((s) => (
          <mesh key={s} material={m.shell} position={[s * 0.3, 0.62, 0]}>
            <boxGeometry args={[0.12, 0.5, 0.5]} />
          </mesh>
        ))}

        {/* J2 — shoulder */}
        <group ref={j2} position={[0, SHOULDER_Y - 0.12, 0]}>
          <JointHousing r={0.27} w={0.48} m={m} />
          <mesh material={m.shell} position={[0, L1 / 2, 0]}>
            <capsuleGeometry args={[0.19, L1 - 0.38, 8, 32]} />
          </mesh>
          <mesh material={m.signal} position={[0, L1 / 2, 0.19]}>
            <boxGeometry args={[0.05, L1 * 0.45, 0.01]} />
          </mesh>

          {/* J3 — elbow */}
          <group ref={j3} position={[0, L1, 0]}>
            <JointHousing r={0.23} w={0.42} m={m} />
            <mesh material={m.shell} position={[0, L2 / 2, 0]}>
              <capsuleGeometry args={[0.14, L2 - 0.3, 8, 32]} />
            </mesh>
            <mesh material={m.graphite} position={[0, L2 * 0.3, 0]}>
              <cylinderGeometry args={[0.155, 0.155, 0.12, 32]} />
            </mesh>

            {/* J5 — wrist pitch */}
            <group ref={j5} position={[0, L2, 0]}>
              <JointHousing r={0.15} w={0.3} m={m} ring="signal" />
              {/* J6 — tool roll */}
              <group ref={j6} position={[0, 0.16, 0]}>
                <mesh material={m.steel}>
                  <cylinderGeometry args={[0.1, 0.11, 0.1, 32]} />
                </mesh>
                <mesh material={m.graphite} position={[0, 0.1, 0]}>
                  <boxGeometry args={[0.2, 0.08, 0.1]} />
                </mesh>
                <mesh ref={fingerL} material={m.shell} position={[-0.05, 0.22, 0]}>
                  <boxGeometry args={[0.03, 0.18, 0.07]} />
                </mesh>
                <mesh ref={fingerR} material={m.shell} position={[0.05, 0.22, 0]}>
                  <boxGeometry args={[0.03, 0.18, 0.07]} />
                </mesh>
                <mesh material={m.signal} position={[0, 0.26, 0]}>
                  <sphereGeometry args={[0.018, 16, 16]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Target marker — holographic crosshair at the goal */}
      <group ref={marker}>
        <mesh material={m.holo} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.09, 0.1, 48]} />
        </mesh>
        <mesh material={m.holo} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.16, 0.165, 4, 1, 0, Math.PI * 2]} />
        </mesh>
      </group>
    </group>
  );
}

/** Blueprint floor: polar grid + reach envelope + fake contact shadow. */
function Floor() {
  const { shadowTex, grid, envelope } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(0,0,0,0.75)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(c);

    const grid = new THREE.PolarGridHelper(5, 16, 10, 96, "#1f4d80", "#12263d");
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.55;

    const reach = L1 + L2 + TOOL;
    const pts = new THREE.EllipseCurve(0, 0, reach, reach, 0, Math.PI * 2).getPoints(160);
    const geo = new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0.003, p.y)));
    const envelope = new THREE.Line(
      geo,
      new THREE.LineDashedMaterial({ color: "#3d9bff", dashSize: 0.08, gapSize: 0.06, transparent: true, opacity: 0.7 }),
    );
    envelope.computeLineDistances();
    return { shadowTex, grid, envelope };
  }, []);

  return (
    <group>
      <primitive object={grid} />
      <primitive object={envelope} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Frames the arm: right of the headline on wide screens, centred on narrow ones. */
function Rig() {
  const { camera, size, scene, gl } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    // ≥1024px the canvas is a full-bleed backdrop (text on the left) → frame the arm off-centre.
    const wide = size.width >= 1024 && size.width / size.height > 1.15;
    if (wide) {
      camera.position.set(-3.3, 3.3, 10.4);
      camera.lookAt(-1.95, 1.35, 0);
    } else {
      // Portrait/narrow: pull back in proportion to how narrow the viewport is so the full reach stays in frame.
      const k = THREE.MathUtils.clamp(0.9 / (size.width / size.height), 1, 1.25);
      camera.position.set(3.4 * k, 2.9 * k, 8.4 * k);
      camera.lookAt(0, 1.55, 0);
    }
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function RobotArmScene({ onTelemetry, reducedMotion, active }: Props) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 30, near: 0.1, far: 60, position: [4.6, 2.8, 7.4] }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Rig />
      <hemisphereLight args={["#bcd6ff", "#05070b", 0.5]} />
      <directionalLight position={[4, 6, 3]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-5, 3, -4]} intensity={1.4} color="#3d9bff" />
      <pointLight position={[0, 0.4, 1.6]} intensity={3} distance={4} color="#ffb454" />
      <RobotArm onTelemetry={onTelemetry} reducedMotion={reducedMotion} />
      <Floor />
      <fog attach="fog" args={["#05070b", 14, 32]} />
    </Canvas>
  );
}
