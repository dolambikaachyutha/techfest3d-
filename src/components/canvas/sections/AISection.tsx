"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 25;
const PARTICLE_COUNT = 150;

export default function AISection() {
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dummySmall = useMemo(() => new THREE.Object3D(), []);

  // Generate node positions in a city-like layout
  const nodePositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      positions.push(
        new THREE.Vector3(
          (col - 2) * 2.2 + (Math.random() - 0.5) * 0.6,
          row * 1.8 - 3 + (Math.random() - 0.5) * 0.4,
          -6 + (Math.random() - 0.5) * 4
        )
      );
    }
    return positions;
  }, []);

  // Connection lines between nearby nodes
  const connections = useMemo(() => {
    const conns: { from: number; to: number; length: number }[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 4) {
          conns.push({ from: i, to: j, length: dist });
        }
      }
    }
    return conns;
  }, [nodePositions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Animate nodes — gentle float + pulse
    if (nodesRef.current) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const p = nodePositions[i];
        dummy.position.set(
          p.x + Math.sin(t * 0.5 + i * 0.7) * 0.15,
          p.y + Math.cos(t * 0.3 + i * 0.5) * 0.1,
          p.z
        );
        const pulse = 0.12 + Math.sin(t * 2 + i) * 0.04;
        dummy.scale.setScalar(pulse);
        dummy.updateMatrix();
        nodesRef.current.setMatrixAt(i, dummy.matrix);
      }
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate connection lines
    if (linesRef.current) {
      for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];
        const from = nodePositions[conn.from];
        const to = nodePositions[conn.to];
        const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(to, from);
        const len = dir.length();
        const axis = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(axis, dir.normalize());
        dummy.position.copy(mid);
        dummy.quaternion.copy(quat);
        dummy.scale.set(0.008, len, 0.008);
        dummy.updateMatrix();
        linesRef.current.setMatrixAt(i, dummy.matrix);
      }
      linesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate data particles flowing along connections
    if (particlesRef.current) {
      const activeConns = Math.min(connections.length, PARTICLE_COUNT);
      for (let i = 0; i < activeConns; i++) {
        const conn = connections[i % connections.length];
        const from = nodePositions[conn.from];
        const to = nodePositions[conn.to];
        const flow = (t * 0.5 + i * 0.1) % 1;
        const pos = new THREE.Vector3().lerpVectors(from, to, flow);
        dummySmall.position.copy(pos);
        dummySmall.scale.setScalar(0.025 + Math.sin(t * 3 + i) * 0.01);
        dummySmall.updateMatrix();
        particlesRef.current.setMatrixAt(i, dummySmall.matrix);
      }
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, -8]}>
      {/* Neural nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#4CE0D2"
          emissive="#4CE0D2"
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
        />
      </instancedMesh>

      {/* Connection lines */}
      <instancedMesh ref={linesRef} args={[undefined, undefined, connections.length]}>
        <cylinderGeometry args={[1, 1, 1, 4]} />
        <meshBasicMaterial color="#4CE0D2" transparent opacity={0.15} />
      </instancedMesh>

      {/* Data flow particles */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#4CE0D2" transparent opacity={0.9} />
      </instancedMesh>

      {/* Ambient light for this section */}
      <pointLight position={[0, 2, 0]} intensity={0.8} color="#4CE0D2" distance={12} decay={2} />
    </group>
  );
}
