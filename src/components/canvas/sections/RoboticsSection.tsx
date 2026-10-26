"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore, selectScrollProgress } from "@/lib/store";

function RoboticArm({ position, index }: { position: [number, number, number]; index: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgress = useAppStore(selectScrollProgress);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Scroll-scrubbed + ambient animation
    const scrollFactor = Math.max(0, Math.min(1, (scrollProgress - 0.28) / 0.14));
    groupRef.current.rotation.y = Math.sin(t * 0.3 + index * 1.5) * 0.3 * (1 + scrollFactor);
    groupRef.current.children.forEach((child, ci) => {
      if (child instanceof THREE.Group) {
        child.rotation.z = Math.sin(t * 0.5 + ci * 0.8 + index) * 0.4 * (0.5 + scrollFactor);
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Base */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.5, 8]} />
        <meshStandardMaterial color="#2A3040" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Lower arm */}
      <group position={[0, -1, 0]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.15, 1.2, 0.15]} />
          <meshStandardMaterial color="#5B8DEF" metalness={0.6} roughness={0.4} emissive="#5B8DEF" emissiveIntensity={0.2} />
        </mesh>
        {/* Upper arm joint */}
        <group position={[0, 1.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#8AB4F8" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.12, 1, 0.12]} />
            <meshStandardMaterial color="#5B8DEF" metalness={0.6} roughness={0.4} emissive="#5B8DEF" emissiveIntensity={0.3} />
          </mesh>
          {/* End effector */}
          <group position={[0, 1.1, 0]}>
            <mesh>
              <coneGeometry args={[0.15, 0.3, 6]} />
              <meshStandardMaterial color="#EAF2FF" emissive="#5B8DEF" emissiveIntensity={0.5} />
            </mesh>
            <pointLight position={[0, -0.2, 0]} intensity={0.5} color="#5B8DEF" distance={3} />
          </group>
        </group>
      </group>
    </group>
  );
}

function Drone({ index }: { index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const initialPos = useMemo(
    () => new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      1 + Math.random() * 3,
      -4 - Math.random() * 6
    ),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.set(
      initialPos.x + Math.sin(t * 0.4 + index * 2) * 2,
      initialPos.y + Math.sin(t * 0.6 + index * 1.3) * 0.5,
      initialPos.z + Math.cos(t * 0.3 + index * 1.7) * 1.5
    );
    meshRef.current.rotation.y = t * 0.5 + index;
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <meshStandardMaterial color="#5B8DEF" emissive="#5B8DEF" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Rotor glow */}
      <mesh position={[0, 0.05, 0]}>
        <ringGeometry args={[0.15, 0.18, 8]} />
        <meshBasicMaterial color="#8AB4F8" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <pointLight intensity={0.3} color="#5B8DEF" distance={2} />
    </group>
  );
}

export default function RoboticsSection() {
  return (
    <group position={[2, 0, -16]}>
      <RoboticArm position={[-2, -1, 0]} index={0} />
      <RoboticArm position={[2, -1, -2]} index={1} />
      <RoboticArm position={[-1, -1, -4]} index={2} />
      <RoboticArm position={[3, -1, -3]} index={3} />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Drone key={i} index={i} />
      ))}

      {/* Industrial floor glow */}
      <mesh position={[0, -2, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshBasicMaterial color="#5B8DEF" transparent opacity={0.03} />
      </mesh>

      <pointLight position={[0, 3, 0]} intensity={0.6} color="#5B8DEF" distance={15} />
    </group>
  );
}
