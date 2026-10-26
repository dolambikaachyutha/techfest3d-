"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 800;

function Planet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmoRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = t * 0.05;
    if (atmoRef.current) atmoRef.current.rotation.y = -t * 0.03;
  });

  return (
    <group position={[-2, 3, -28]}>
      {/* Planet body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#6366F1"
          emissive="#4338CA"
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      {/* Atmosphere glow */}
      <mesh ref={atmoRef} scale={1.15}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#818CF8"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Cloud layer */}
      <mesh scale={1.02}>
        <sphereGeometry args={[2, 24, 24]} />
        <meshStandardMaterial
          color="#C7D2FE"
          transparent
          opacity={0.15}
          roughness={1}
        />
      </mesh>
      <pointLight position={[3, 2, 2]} intensity={1} color="#E0E7FF" distance={15} />
    </group>
  );
}

function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.getElapsedTime() * 0.1;
  });
  return (
    <mesh ref={ref} position={[-2, 3, -28]} rotation={[Math.PI / 2.5, 0, 0]}>
      <torusGeometry args={[3.2, 0.06, 8, 64]} />
      <meshBasicMaterial color="#6366F1" transparent opacity={0.35} />
    </mesh>
  );
}

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = -10 - Math.random() * 50;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const geo = ref.current.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < STAR_COUNT; i++) {
      const y = posAttr.getY(i);
      posAttr.setY(i, y + Math.sin(t + i * 0.1) * 0.001);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#EAF2FF" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Nebula() {
  return (
    <sprite position={[4, 6, -35]} scale={[8, 6, 1]}>
      <spriteMaterial color="#6366F1" transparent opacity={0.06} />
    </sprite>
  );
}

export default function SpaceSection() {
  return (
    <group>
      <Planet />
      <OrbitRing />
      <Starfield />
      <Nebula />
      <Nebula />
      <ambientLight intensity={0.08} />
    </group>
  );
}
