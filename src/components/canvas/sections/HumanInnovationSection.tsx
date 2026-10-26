"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLORS = ["#4CE0D2", "#5B8DEF", "#6366F1", "#8B5CF6", "#FFB347", "#FF3D8A"];
const STREAM_COUNT = 80;

function EnergyStream({ color, index }: { color: string; index: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const angle = (index / COLORS.length) * Math.PI * 2;

    for (let i = 0; i < STREAM_COUNT / COLORS.length; i++) {
      const progress = ((t * 0.3 + i * 0.05 + index * 0.1) % 1);
      const radius = (1 - progress) * 6;
      const x = Math.cos(angle + progress * 2) * radius + Math.sin(t + i) * 0.2;
      const y = Math.sin(angle + progress * 2) * radius * 0.6 + Math.cos(t * 0.5 + i) * 0.15;
      const z = -2 - progress * 3;

      dummy.position.set(x, y, z);
      const s = 0.03 + (1 - progress) * 0.02;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  const particlesPerStream = STREAM_COUNT / COLORS.length;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, particlesPerStream]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </instancedMesh>
  );
}

function CentralLight() {
  const ref = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.15;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      const s = 0.6 + Math.sin(t * 0.8) * 0.1;
      ref.current.scale.setScalar(s);
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.3;
      const s2 = 0.4 + Math.sin(t * 1.2) * 0.08;
      innerRef.current.scale.setScalar(s2);
    }
  });

  return (
    <group position={[0, 0, -2]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#EAF2FF" transparent opacity={0.15} wireframe />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.08} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#EAF2FF" distance={10} decay={2} />
    </group>
  );
}

export default function HumanInnovationSection() {
  return (
    <group position={[-2, 2, -64]}>
      {COLORS.map((color, i) => (
        <EnergyStream key={i} color={color} index={i} />
      ))}
      <CentralLight />
      <ambientLight intensity={0.1} />
    </group>
  );
}
