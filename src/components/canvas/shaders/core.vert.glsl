// ============================================
// TECHFEST CORE — VERTEX SHADER
// Neural lattice with energy skin
// ============================================

uniform float uTime;
uniform float uMorphProgress;
uniform float uSectionIndex;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vFresnel;
varying float vElevation;

// Simple noise function for organic displacement
float hash(vec3 p) {
  p = fract(p * 0.3183099 + .1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise3D(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

void main() {
  vUv = uv;
  
  // Organic breathing displacement
  float breath = sin(uTime * 0.5) * 0.03;
  float noise = noise3D(position * 2.0 + uTime * 0.2) * 0.05;
  
  // Energy pulse traveling outward
  float pulse = sin(position.y * 3.0 - uTime * 2.0) * 0.02;
  
  vElevation = noise + pulse;
  
  vec3 displaced = position + normal * (breath + noise + pulse);
  
  // Compute view position
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewPosition = -mvPosition.xyz;
  
  // Normal for lighting
  vNormal = normalize(normalMatrix * normal);
  
  // Fresnel for rim glow
  vec3 viewDir = normalize(vViewPosition);
  vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
  
  gl_Position = projectionMatrix * mvPosition;
}
