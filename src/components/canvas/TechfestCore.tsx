"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore, selectCurrentSection, selectScrollVelocity } from "@/lib/store";

import { coreVertexShader as vertexShader } from "./shaders/shaders";
import { coreFragmentShader as fragmentShader } from "./shaders/shaders";

interface MorphConfig {
  color: THREE.Color; scale: number; noiseFreq: number; noiseAmp: number; rotationSpeed: number;
}

const morphConfigs: Record<number, MorphConfig> = {
  0: { color: new THREE.Color("#4CE0D2"), scale: 0.3, noiseFreq: 1, noiseAmp: 0.5, rotationSpeed: 0.3 },
  1: { color: new THREE.Color("#4CE0D2"), scale: 1.0, noiseFreq: 1, noiseAmp: 0.5, rotationSpeed: 0.2 },
  2: { color: new THREE.Color("#4CE0D2"), scale: 0.6, noiseFreq: 2, noiseAmp: 0.8, rotationSpeed: 0.25 },
  3: { color: new THREE.Color("#5B8DEF"), scale: 0.5, noiseFreq: 3, noiseAmp: 1.0, rotationSpeed: 0.15 },
  4: { color: new THREE.Color("#6366F1"), scale: 0.7, noiseFreq: 1.5, noiseAmp: 0.3, rotationSpeed: 0.1 },
  5: { color: new THREE.Color("#8B5CF6"), scale: 0.5, noiseFreq: 4, noiseAmp: 1.2, rotationSpeed: 0.35 },
  6: { color: new THREE.Color("#FFB347"), scale: 0.6, noiseFreq: 1.2, noiseAmp: 0.6, rotationSpeed: 0.18 },
  7: { color: new THREE.Color("#EAF2FF"), scale: 0.8, noiseFreq: 0.8, noiseAmp: 0.4, rotationSpeed: 0.22 },
  8: { color: new THREE.Color("#EAF2FF"), scale: 0.4, noiseFreq: 1, noiseAmp: 0.5, rotationSpeed: 0.3 },
};

interface TechfestCoreProps { position?: [number, number, number]; scale?: number; isHUD?: boolean; onReady?: () => void; }

export default function TechfestCore({ position = [0, 0, 0], scale = 1, isHUD = false, onReady }: TechfestCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const innerLightRef = useRef<THREE.PointLight>(null);
  const currentSection = useAppStore(selectCurrentSection);
  const scrollVelocity = useAppStore(selectScrollVelocity);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [size]);

  const shaderUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorphProgress: { value: 0 },
    uColor: { value: new THREE.Color("#4CE0D2") },
    uOpacity: { value: 1.0 },
  }), []);

  const particleCount = 200;
  const particleDummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!particlesRef.current) return;
    for (let i = 0; i < particleCount; i++) {
      const a = (i / particleCount) * Math.PI * 2;
      const r = 1.3 + Math.random() * 0.3;
      const y = (Math.random() - 0.5) * 0.2;
      particleDummy.position.set(Math.cos(a)*r, y, Math.sin(a)*r);
      particleDummy.scale.setScalar(0.01 + Math.random() * 0.015);
      particleDummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, particleDummy.matrix);
    }
    particlesRef.current.instanceMatrix.needsUpdate = true;
  }, [particleDummy]);

  const targetColor = useRef(new THREE.Color("#4CE0D2"));

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    shaderUniforms.uTime.value = t;
    const cfg = morphConfigs[currentSection] || morphConfigs[1];
    targetColor.current.copy(cfg.color);
    shaderUniforms.uColor.value.lerp(targetColor.current, delta * 2);
    const tgtS = isHUD ? 0.15 : cfg.scale * scale;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, tgtS, delta * 3));
    if (isHUD) groupRef.current.position.lerp(new THREE.Vector3(-3.5, 2.2, 0), delta * 3);
    else groupRef.current.position.lerp(new THREE.Vector3(...position), delta * 3);
    meshRef.current.rotation.y += (cfg.rotationSpeed + Math.abs(scrollVelocity)*0.5) * delta;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = meshRef.current.rotation.y * -0.7;
      wireframeRef.current.rotation.z = t * 0.1;
    }
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseRef.current.y*0.15, delta*2);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseRef.current.x*0.15, delta*2);
    if (particlesRef.current) {
      for (let i=0;i<particleCount;i++){
        const a=(i/particleCount)*Math.PI*2+t*0.3;
        const r=1.3+Math.sin(t+i*0.1)*0.1;
        const y=Math.sin(t*0.5+i*0.05)*0.15;
        particleDummy.position.set(Math.cos(a)*r,y,Math.sin(a)*r);
        particleDummy.scale.setScalar((0.01+Math.random()*0.005)*(1+Math.abs(scrollVelocity)*0.3));
        particleDummy.updateMatrix();
        particlesRef.current.setMatrixAt(i,particleDummy.matrix);
      }
      particlesRef.current.instanceMatrix.needsUpdate=true;
    }
    if (innerLightRef.current) innerLightRef.current.color.lerp(targetColor.current,delta*2);
  });

  useEffect(()=>{onReady?.();},[onReady]);

  return (<group ref={groupRef} position={position}>
    <mesh ref={meshRef}><icosahedronGeometry args={[1,1]}/><shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={shaderUniforms} transparent side={THREE.DoubleSide} depthWrite={false}/></mesh>
    <mesh ref={wireframeRef}><icosahedronGeometry args={[0.85,0]}/><meshBasicMaterial color={shaderUniforms.uColor.value} wireframe transparent opacity={0.3}/></mesh>
    <mesh><icosahedronGeometry args={[1.1,2]}/><meshBasicMaterial color={shaderUniforms.uColor.value} wireframe transparent opacity={0.1}/></mesh>
    <instancedMesh ref={particlesRef} args={[undefined,undefined,particleCount]}><sphereGeometry args={[1,6,6]}/><meshBasicMaterial color={shaderUniforms.uColor.value} transparent opacity={0.7}/></instancedMesh>
    <pointLight ref={innerLightRef} color={shaderUniforms.uColor.value} intensity={2} distance={5} decay={2}/>
  </group>);
}
