// ============================================
// TECHFEST CORE — FRAGMENT SHADER
// Holographic energy skin with circuit patterns
// ============================================

uniform float uTime;
uniform float uMorphProgress;
uniform vec3 uColor;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vFresnel;
varying float vElevation;

// Noise functions
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

// Circuit pattern
float circuitPattern(vec2 uv, float time) {
  vec2 grid = fract(uv * 8.0);
  float lines = smoothstep(0.48, 0.5, grid.x) + smoothstep(0.48, 0.5, grid.y);
  
  // Animated flow
  float flow = sin(uv.x * 12.0 + time * 2.0) * 0.5 + 0.5;
  float pulse = smoothstep(0.95, 1.0, flow) * lines;
  
  return clamp(lines * 0.3 + pulse * 0.7, 0.0, 1.0);
}

void main() {
  // Base color from uniform
  vec3 baseColor = uColor;
  
  // Circuit pattern overlay
  vec2 rotatedUv = vec2(
    vUv.x * cos(uTime * 0.1) - vUv.y * sin(uTime * 0.1),
    vUv.x * sin(uTime * 0.1) + vUv.y * cos(uTime * 0.1)
  );
  float circuit = circuitPattern(rotatedUv, uTime);
  
  // Energy pulses traveling outward
  float pulseRing = sin(vUv.y * 20.0 - uTime * 3.0) * 0.5 + 0.5;
  pulseRing = pow(pulseRing, 8.0) * 0.4;
  
  // Noise-based surface detail
  float surfaceNoise = noise3D(vViewPosition * 3.0 + uTime * 0.3) * 0.3;
  
  // Combine
  vec3 color = baseColor * (0.4 + circuit * 0.6 + surfaceNoise);
  color += baseColor * pulseRing;
  
  // Fresnel rim glow (strongest effect)
  color += baseColor * vFresnel * 2.0;
  
  // Energy pulse bands
  float energyBand = sin(vViewPosition.y * 5.0 - uTime * 1.5) * 0.5 + 0.5;
  energyBand = pow(energyBand, 6.0);
  color += baseColor * energyBand * 0.3;
  
  // Opacity
  float alpha = uOpacity * (0.6 + vFresnel * 0.4 + circuit * 0.2);
  alpha = clamp(alpha, 0.0, 1.0);
  
  gl_FragColor = vec4(color, alpha);
}
