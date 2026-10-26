"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Tower({ position, height, width }: { position: [number, number, number]; height: number; width: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!glowRef.current) return;
    const t = state.clock.getElapsedTime();
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.15 + Math.sin(t * 1.5 + position[0]) * 0.08;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[width, height, width * 0.6]} />
        <meshStandardMaterial color="#1A2332" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Energy stream on face */}
      <mesh ref={glowRef} position={[0, 0, width * 0.31]}>
        <planeGeometry args={[width * 0.3, height * 0.8]} />
        <meshBasicMaterial color="#FFB347" transparent opacity={0.15} />
      </mesh>
      {/* Window glow dots */}
      {Array.from({ length: Math.floor(height / 0.6) }).map((_, i) => (
        <mesh key={`w-${position[0]}-${i}`} position={[0, -height / 2 + 0.4 + i * 0.6, width * 0.31]}>
          <planeGeometry args={[width * 0.5, 0.08]} />
          <meshBasicMaterial color="#FFB347" transparent opacity={0.1 + (i % 3) * 0.05} />
        </mesh>
      ))}
    </group>
  );
}

function Turbine({ position }: { position: [number, number, number] }) {
  const bladesRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z = state.clock.getElapsedTime() * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Tower */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.06, 1.5, 6]} />
        <meshStandardMaterial color="#2A3040" />
      </mesh>
      {/* Blades */}
      <group ref={bladesRef} position={[0, 0.8, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <boxGeometry args={[0.03, 0.7, 0.01]} />
            <meshBasicMaterial color="#FFB347" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function SustainabilitySection() {
  const towers = useMemo(
    () => [
      { pos: [-3, 0, -3] as [number, number, number], h: 4, w: 0.6 },
      { pos: [-1.5, -0.3, -4] as [number, number, number], h: 5, w: 0.5 },
      { pos: [0, 0, -2.5] as [number, number, number], h: 6, w: 0.7 },
      { pos: [1.5, -0.2, -3.5] as [number, number, number], h: 4.5, w: 0.55 },
      { pos: [3, 0.1, -3] as [number, number, number], h: 3.5, w: 0.65 },
      { pos: [-2, -0.5, -5] as [number, number, number], h: 3, w: 0.4 },
      { pos: [2.5, -0.4, -5] as [number, number, number], h: 3.8, w: 0.5 },
    ],
    []
  );

  return (
    <group position={[3, 1, -52]}>
      {towers.map((t, i) => (
        <Tower key={i} position={t.pos} height={t.h} width={t.w} />
      ))}
      <Turbine position={[-4.5, -0.5, -2]} />
      <Turbine position={[4.5, -0.3, -2.5]} />
      <Turbine position={[5.5, -0.2, -4]} />

      {/* Ground plane — golden hour */}
      <mesh position={[0, -2.5, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshBasicMaterial color="#FFB347" transparent opacity={0.04} />
      </mesh>

      <pointLight position={[0, 4, 0]} intensity={0.6} color="#FFB347" distance={12} />
      <pointLight position={[-3, 2, -2]} intensity={0.3} color="#FF8C42" distance={8} />
    </group>
  );
}
