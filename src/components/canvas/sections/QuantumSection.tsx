"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 300;
const LATTICE_SIZE = 4;

export default function QuantumSection() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const gridRef = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Dual positions for superposition
  const particles = useMemo(() => {
    const arr: {
      posA: THREE.Vector3;
      posB: THREE.Vector3;
      phase: number;
      speed: number;
      collapsed: boolean;
    }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        posA: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          -2 - Math.random() * 8
        ),
        posB: new THREE.Vector3(
          (Math.random() - 0.5) * LATTICE_SIZE,
          (Math.random() - 0.5) * LATTICE_SIZE,
          (Math.random() - 0.5) * LATTICE_SIZE - 4
        ),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        collapsed: false,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      // Superposition jitter between posA and posB
      const blend = (Math.sin(t * p.speed + p.phase) + 1) / 2;
      const jitterX = Math.sin(t * 3 + i) * 0.15;
      const jitterY = Math.cos(t * 2.5 + i * 0.7) * 0.15;
      const jitterZ = Math.sin(t * 2 + i * 1.3) * 0.1;

      dummy.position.set(
        p.posA.x * (1 - blend) + p.posB.x * blend + jitterX,
        p.posA.y * (1 - blend) + p.posB.y * blend + jitterY,
        p.posA.z * (1 - blend) + p.posB.z * blend + jitterZ
      );

      const s = 0.03 + Math.sin(t * 4 + i) * 0.015;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Grid warps subtly
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
      gridRef.current.rotation.z = Math.cos(t * 0.15) * 0.03;
    }
  });

  return (
    <group position={[-3, 4, -40]}>
      {/* Superposition particles */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.8} />
      </instancedMesh>

      {/* Spacetime grid */}
      <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -2]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.06} wireframe />
      </mesh>

      {/* Magenta highlights */}
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#8B5CF6" distance={10} />
      <pointLight position={[3, 2, -2]} intensity={0.4} color="#FF3D8A" distance={8} />
      <pointLight position={[-2, -1, 2]} intensity={0.3} color="#C084FC" distance={6} />
    </group>
  );
}
