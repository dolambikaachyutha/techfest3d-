"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useAppStore, selectCurrentSection, selectScrollProgress, selectScrollVelocity } from "@/lib/store";
import { getCameraState } from "@/lib/cameraPath";
import TechfestCore from "./TechfestCore";
import AISection from "./sections/AISection";
import RoboticsSection from "./sections/RoboticsSection";
import SpaceSection from "./sections/SpaceSection";
import QuantumSection from "./sections/QuantumSection";
import SustainabilitySection from "./sections/SustainabilitySection";
import HumanInnovationSection from "./sections/HumanInnovationSection";

/* ============================================================
   SHARED REFS — updated every frame, no Zustand lag
   ============================================================ */
const scrollProgressRef = { current: 0 };
const scrollVelocityRef = { current: 0 };
// 360° mouse control refs
const mouseRef = { current: new THREE.Vector2(0, 0) };
const mouseVelocityRef = { current: new THREE.Vector2(0, 0) };
const smoothMouseRef = { current: new THREE.Vector2(0, 0) };
// Idle timer for sentient environment
const idleTimerRef = { current: 0 };
const lastInteractionRef = { current: 0 };

/* ============================================================
   SCROLL TRACKER + MOUSE TRACKER
   ============================================================ */
function InputTracker() {
  const setScrollProgress = useAppStore((s) => s.setScrollProgress);
  const setScrollVelocity = useAppStore((s) => s.setScrollVelocity);
  const setCurrentSection = useAppStore((s) => s.setCurrentSection);
  const lastProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      scrollProgressRef.current = progress;
      setScrollProgress(progress);
      lastInteractionRef.current = Date.now();
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1..1 centered at viewport center
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;

      // Calculate velocity (delta from last frame approximation)
      mouseVelocityRef.current.set(
        nx - mouseRef.current.x,
        ny - mouseRef.current.y
      );
      mouseRef.current.set(nx, ny);
      lastInteractionRef.current = Date.now();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setScrollProgress]);

  useFrame(() => {
    const p = scrollProgressRef.current;
    scrollVelocityRef.current = p - lastProgress.current;
    lastProgress.current = p;
    const state = getCameraState(p);
    setScrollVelocity(scrollVelocityRef.current);
    setCurrentSection(state.sectionIndex);

    // Update idle timer
    idleTimerRef.current = (Date.now() - lastInteractionRef.current) / 1000;

    // Spring-smooth mouse position (inertia + damping) — more reactive
    const springK = 0.06;
    const dampK = 0.90;
    const sv = mouseVelocityRef.current;
    smoothMouseRef.current.x += sv.x * springK;
    smoothMouseRef.current.y += sv.y * springK;
    smoothMouseRef.current.x *= dampK;
    smoothMouseRef.current.y *= dampK;
    // Decay velocity
    sv.x *= 0.82;
    sv.y *= 0.82;
  });

  return null;
}

/* ============================================================
   CAMERA CONTROLLER — scroll-driven spline + 360° mouse orbit
   ============================================================ */
function CameraController() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));
  const basePosition = useRef(new THREE.Vector3(0, 0, 8));
  const baseLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const p = scrollProgressRef.current;
    const state = getCameraState(p);

    // Store base spline position/lookAt
    basePosition.current.copy(state.position);
    baseLookAt.current.copy(state.lookAt);

    // Velocity-responsive lerp
    const velocityFactor = Math.min(Math.abs(scrollVelocityRef.current) * 80, 1);
    const lerpFactor = 0.03 + velocityFactor * 0.12;

    // 360° mouse offset — orbital camera rotation throughout the journey
    const mx = smoothMouseRef.current.x;
    const my = smoothMouseRef.current.y;

    // Smooth falloff: full strength in hero, slightly reduced in mid-journey, subtle in content
    const heroInfluence = Math.max(0.15, 1 - p * 1.2); // Never drops below 0.15

    const mouseOffsetX = mx * 2.0 * heroInfluence;
    const mouseOffsetY = -my * 1.2 * heroInfluence;

    // Compose target position with mouse parallax
    targetPos.current.set(
      state.position.x + mouseOffsetX,
      state.position.y + mouseOffsetY,
      state.position.z
    );

    camera.position.lerp(targetPos.current, lerpFactor);

    // Look at with mouse offset — creates the 360° rotation feel
    const lookAtTarget = new THREE.Vector3(
      state.lookAt.x + mouseOffsetX * 0.5,
      state.lookAt.y + mouseOffsetY * 0.4,
      state.lookAt.z
    );
    camera.lookAt(lookAtTarget);
  });

  return null;
}

/* ============================================================
   SCENE FOG — color transitions between worlds
   ============================================================ */
function SceneFog() {
  const { scene } = useThree();

  const fogStops = useMemo(() => [
    { at: 0.0, color: new THREE.Color("#05060A") },
    { at: 0.08, color: new THREE.Color("#030810") },
    { at: 0.15, color: new THREE.Color("#0A1628") },
    { at: 0.25, color: new THREE.Color("#101820") },
    { at: 0.35, color: new THREE.Color("#0A0F1E") },
    { at: 0.45, color: new THREE.Color("#12081E") },
    { at: 0.55, color: new THREE.Color("#04140A") },
    { at: 0.65, color: new THREE.Color("#0E0A04") },
    { at: 0.85, color: new THREE.Color("#080C14") },
    { at: 1.0, color: new THREE.Color("#0A0E16") },
  ], []);

  useFrame(() => {
    const sp = scrollProgressRef.current;
    let lo = fogStops[0], hi = fogStops[fogStops.length - 1];
    for (let i = 0; i < fogStops.length - 1; i++) {
      if (sp >= fogStops[i].at && sp <= fogStops[i + 1].at) {
        lo = fogStops[i];
        hi = fogStops[i + 1];
        break;
      }
    }
    const range = hi.at - lo.at || 1;
    const t = (sp - lo.at) / range;
    const fogColor = lo.color.clone().lerp(hi.color, Math.max(0, Math.min(1, t)));

    if (scene.fog instanceof THREE.Fog) {
      (scene.fog as THREE.Fog).color.lerp(fogColor, 0.05);
    }
    const gl = (scene as any).__gl;
    if (gl) gl.setClearColor(fogColor, 1);
  });

  return null;
}

/* ============================================================
   SCENE LIGHTING — progressive: dark → bright, color per section
   ============================================================ */
function SceneLighting() {
  const currentSection = useAppStore(selectCurrentSection);

  const sectionColors: Record<number, string> = {
    0: "#4CE0D2", 1: "#4CE0D2", 2: "#4CE0D2",
    3: "#5B8DEF", 4: "#6366F1", 5: "#8B5CF6",
    6: "#FFB347", 7: "#EAF2FF", 8: "#EAF2FF",
  };
  const color = sectionColors[currentSection] || "#4CE0D2";
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const pointRef = useRef<THREE.PointLight>(null);
  const targetColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    const sp = scrollProgressRef.current;
    const progressiveIntensity = 0.08 + sp * 0.35;
    const dirIntensity = 0.15 + sp * 0.4;

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity, progressiveIntensity, delta * 2
      );
    }
    if (dirRef.current) {
      dirRef.current.intensity = THREE.MathUtils.lerp(
        dirRef.current.intensity, dirIntensity, delta * 2
      );
      dirRef.current.color.lerp(targetColor, delta * 1.5);
    }
    if (pointRef.current) {
      pointRef.current.color.lerp(targetColor, delta * 2);
      pointRef.current.intensity = 0.4 + sp * 0.6;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.08} />
      <directionalLight ref={dirRef} position={[5, 8, 5]} intensity={0.15} color={color} />
      <pointLight ref={pointRef} position={[0, 3, 0]} intensity={0.4} color={color} distance={20} decay={2} />
      <pointLight position={[-4, -2, -8]} intensity={0.2} color="#FF3D8A" distance={15} decay={2} />
    </>
  );
}

/* ============================================================
   AMBIENT PARTICLES — world-specific behaviors
   ============================================================ */
function AmbientParticles() {
  const count = 600;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const currentSection = useAppStore(selectCurrentSection);
  const sectionRef = useRef(0);

  const particles = useMemo(() => {
    const p: {
      baseX: number; baseY: number; baseZ: number;
      speed: number; phase: number; amplitude: number;
      size: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      p.push({
        baseX: (Math.random() - 0.5) * 80,
        baseY: (Math.random() - 0.5) * 40,
        baseZ: (Math.random() - 0.5) * 120 - 10,
        speed: 0.1 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.2 + Math.random() * 0.8,
        size: 0.01 + Math.random() * 0.02,
      });
    }
    return p;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    if (currentSection !== sectionRef.current) {
      sectionRef.current = currentSection;
    }

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      let x = p.baseX, y = p.baseY, z = p.baseZ;
      let s = p.size;

      const worldT = t * p.speed + p.phase;

      switch (currentSection) {
        case 2:
          x = p.baseX + Math.sin(worldT * 3) * 0.3;
          y = p.baseY + t * p.speed * 2;
          s = p.size * (0.8 + Math.sin(worldT * 5) * 0.4);
          break;
        case 3:
          x = p.baseX + Math.round(Math.sin(worldT * 2) * 3) * 0.5;
          y = p.baseY + Math.cos(worldT * 1.5) * p.amplitude;
          s = p.size * (1.2 + (Math.sin(worldT * 8) > 0.7 ? 1 : 0));
          break;
        case 4:
          x = p.baseX + Math.sin(worldT * 0.3) * 0.1;
          y = p.baseY + Math.cos(worldT * 0.2) * 0.05;
          s = p.size * (1.5 + Math.sin(worldT * 0.5) * 0.5);
          break;
        case 5:
          x = p.baseX + Math.sin(worldT * 10) * p.amplitude * 0.3;
          y = p.baseY + Math.cos(worldT * 12) * p.amplitude * 0.3;
          s = p.size * (0.5 + Math.abs(Math.sin(worldT * 7)) * 1.5);
          break;
        case 6:
          x = p.baseX + Math.sin(worldT * 0.8) * p.amplitude;
          y = p.baseY + Math.sin(worldT * 0.5) * 0.5 + t * 0.05;
          s = p.size * 1.2;
          break;
        case 7:
          const convergeFactor = 0.6 + Math.sin(worldT * 0.4) * 0.4;
          x = p.baseX * convergeFactor + Math.sin(worldT) * 0.5;
          y = p.baseY * convergeFactor + Math.cos(worldT * 0.7) * 0.3;
          s = p.size * 1.4;
          break;
        default:
          x = p.baseX + Math.sin(worldT) * 0.5;
          y = p.baseY + Math.cos(worldT * 0.7) * 0.3;
          break;
      }

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#EAF2FF" transparent opacity={0.35} />
    </instancedMesh>
  );
}

/* ============================================================
   PARALLAX LAYERS — far/mid/near depth for 360° feel
   ============================================================ */
function ParallaxLayers() {
  const farCount = 200;
  const midCount = 100;
  const nearCount = 50;

  const farRef = useRef<THREE.InstancedMesh>(null);
  const midRef = useRef<THREE.InstancedMesh>(null);
  const nearRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate static positions for each layer
  const farParticles = useMemo(() => {
    const arr: { x: number; y: number; z: number; size: number; brightness: number }[] = [];
    for (let i = 0; i < farCount; i++) {
      // Far layer: spread across a huge sphere shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 30;
      arr.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi) - 20,
        size: 0.02 + Math.random() * 0.04,
        brightness: 0.2 + Math.random() * 0.6,
      });
    }
    return arr;
  }, []);

  const midParticles = useMemo(() => {
    const arr: { x: number; y: number; z: number; size: number }[] = [];
    for (let i = 0; i < midCount; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 60 - 15,
        size: 0.03 + Math.random() * 0.05,
      });
    }
    return arr;
  }, []);

  const nearParticles = useMemo(() => {
    const arr: { x: number; y: number; z: number; size: number }[] = [];
    for (let i = 0; i < nearCount; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 20 + 2,
        size: 0.02 + Math.random() * 0.06,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = smoothMouseRef.current.x;
    const my = smoothMouseRef.current.y;
    const sp = scrollProgressRef.current;
    const heroInfluence = Math.max(0.15, 1 - sp * 1.2);

    // FAR layer — slowest response (stars/nebulae orbit wide)
    if (farRef.current) {
      for (let i = 0; i < farCount; i++) {
        const pp = farParticles[i];
        dummy.position.set(
          pp.x + mx * 1.5 * heroInfluence,
          pp.y - my * 0.8 * heroInfluence,
          pp.z + Math.sin(t * 0.1 + i) * 0.05
        );
        const twinkle = 0.5 + Math.sin(t * 0.5 + i * 1.7) * 0.5;
        dummy.scale.setScalar(pp.size * (0.8 + twinkle * 0.4));
        dummy.updateMatrix();
        farRef.current.setMatrixAt(i, dummy.matrix);
      }
      farRef.current.instanceMatrix.needsUpdate = true;
    }

    // MID layer — medium response (structures orbit noticeably)
    if (midRef.current) {
      for (let i = 0; i < midCount; i++) {
        const pp = midParticles[i];
        dummy.position.set(
          pp.x + mx * 3.0 * heroInfluence,
          pp.y - my * 1.5 * heroInfluence,
          pp.z + Math.sin(t * 0.2 + i * 0.7) * 0.2
        );
        dummy.scale.setScalar(pp.size);
        dummy.updateMatrix();
        midRef.current.setMatrixAt(i, dummy.matrix);
      }
      midRef.current.instanceMatrix.needsUpdate = true;
    }

    // NEAR layer — fastest response (drones/energy orbit dramatically)
    if (nearRef.current) {
      for (let i = 0; i < nearCount; i++) {
        const pp = nearParticles[i];
        dummy.position.set(
          pp.x + mx * 5.0 * heroInfluence,
          pp.y - my * 3.0 * heroInfluence,
          pp.z + Math.sin(t * 0.4 + i * 1.2) * 0.3
        );
        const pulse = 0.5 + Math.sin(t * 2 + i * 3) * 0.5;
        dummy.scale.setScalar(pp.size * (0.6 + pulse * 0.8));
        dummy.updateMatrix();
        nearRef.current.setMatrixAt(i, dummy.matrix);
      }
      nearRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Far: stars / nebulae — tiny, dim, spread wide */}
      <instancedMesh ref={farRef} args={[undefined, undefined, farCount]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#B8C4D8" transparent opacity={0.4} />
      </instancedMesh>

      {/* Mid: orbital debris / structure fragments */}
      <instancedMesh ref={midRef} args={[undefined, undefined, midCount]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#4CE0D2" transparent opacity={0.2} />
      </instancedMesh>

      {/* Near: drones / energy fragments — closest, most reactive */}
      <instancedMesh ref={nearRef} args={[undefined, undefined, nearCount]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#EAF2FF" transparent opacity={0.15} />
      </instancedMesh>
    </>
  );
}

/* ============================================================
   POSTPROCESSING — bloom, chromatic aberration, vignette
   ============================================================ */
function PostProcessing() {
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.0005, 0.0005), []);

  useFrame(() => {
    const sp = scrollProgressRef.current;
    const sv = scrollVelocityRef.current;
    const velocityBoost = Math.min(Math.abs(sv) * 40, 0.003);
    const intensity = 0.0003 + sp * 0.0003 + velocityBoost;
    aberrationOffset.set(intensity, intensity);
  });

  return (
    <EffectComposer>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={aberrationOffset}
        radialModulation
        modulationOffset={0.3}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

/* ============================================================
   MAIN SCENE
   ============================================================ */
export default function Experience() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0 }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#05060A"));
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <fog attach="fog" args={["#05060A", 8, 55]} />
      <InputTracker />
      <CameraController />
      <SceneFog />
      <SceneLighting />
      <AmbientParticles />
      <ParallaxLayers />

      {/* Signature element */}
      <TechfestCore position={[0, 0.5, 4]} />

      {/* The six worlds */}
      <AISection />
      <RoboticsSection />
      <SpaceSection />
      <QuantumSection />
      <SustainabilitySection />
      <HumanInnovationSection />

      {/* Postprocessing */}
      <PostProcessing />
    </Canvas>
  );
}
