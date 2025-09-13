'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LandscapeBackgroundProps {
  theme: 'light' | 'dark' | 'high-contrast';
}

// Poisson noise implementation
function generatePoissonNoise(width: number, height: number, radius: number = 1): number[][] {
  const grid: number[][] = Array(height).fill(null).map(() => Array(width).fill(0));
  const points: { x: number; y: number }[] = [];
  
  // Generate random points with Poisson distribution
  for (let i = 0; i < width * height * 0.1; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    
    // Check if point is far enough from existing points
    let valid = true;
    for (const point of points) {
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
      if (distance < radius) {
        valid = false;
        break;
      }
    }
    
    if (valid) {
      points.push({ x, y });
    }
  }
  
  // Create noise field based on points
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minDistance = Infinity;
      for (const point of points) {
        const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
        minDistance = Math.min(minDistance, distance);
      }
      grid[y][x] = Math.exp(-minDistance / radius);
    }
  }
  
  return grid;
}

// Generate cloud-like formations
function generateClouds(width: number, height: number): number[][] {
  const clouds: number[][] = Array(height).fill(null).map(() => Array(width).fill(0));
  
  // Create multiple cloud layers with different characteristics
  for (let layer = 0; layer < 4; layer++) {
    const cloudNoise = generatePoissonNoise(width, height, 6 + layer * 3);
    const intensity = 0.4 + layer * 0.15;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Make clouds more concentrated in upper portion
        const cloudFactor = Math.max(0, (y / height - 0.3) * 2);
        clouds[y][x] += cloudNoise[y][x] * intensity * cloudFactor;
      }
    }
  }
  
  return clouds;
}

// Generate terrain heightmap
function generateTerrain(width: number, height: number): number[][] {
  const terrain: number[][] = Array(height).fill(null).map(() => Array(width).fill(0));
  
  // Create rolling hills using multiple noise layers
  for (let layer = 0; layer < 5; layer++) {
    const scale = Math.pow(1.5, layer);
    const amplitude = 1 / scale;
    const noise = generatePoissonNoise(width, height, 15 / scale);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Make hills more prominent in lower portion
        const hillFactor = Math.max(0, (1.0 - y / height) * 1.5);
        terrain[y][x] += noise[y][x] * amplitude * hillFactor;
      }
    }
  }
  
  return terrain;
}

export default function LandscapeBackground({ theme }: LandscapeBackgroundProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { geometry, material } = useMemo(() => {
    // Only create geometry and material for light theme
    if (theme !== 'light') {
      return { geometry: null, material: null };
    }
    const width = 200;
    const height = 100;
    const segments = 100;
    
    // Generate terrain
    const terrain = generateTerrain(segments, segments);
    const clouds = generateClouds(segments, segments);
    
    // Create geometry
    const geometry = new THREE.PlaneGeometry(width, height, segments - 1, segments - 1);
    
    // Modify vertices based on terrain
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = Math.floor((positions[i] / width + 0.5) * segments);
      const y = Math.floor((positions[i + 1] / height + 0.5) * segments);
      
      if (x >= 0 && x < segments && y >= 0 && y < segments) {
        // Apply terrain height
        positions[i + 2] = terrain[y][x] * 5;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Create shader material for landscape
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        clouds: { value: new THREE.DataTexture(
          new Float32Array(clouds.flat()),
          segments,
          segments,
          THREE.RedFormat,
          THREE.FloatType
        )},
        terrain: { value: new THREE.DataTexture(
          new Float32Array(terrain.flat()),
          segments,
          segments,
          THREE.RedFormat,
          THREE.FloatType
        )}
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D clouds;
        uniform sampler2D terrain;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          // Sample terrain and clouds
          float terrainHeight = texture2D(terrain, vUv).r;
          float cloudDensity = texture2D(clouds, vUv + vec2(time * 0.01, 0.0)).r;
          
          // Sky gradient (Windows XP style - vibrant blues)
          vec3 skyTop = vec3(0.1, 0.4, 0.8); // Deep bright blue like XP
          vec3 skyBottom = vec3(0.4, 0.6, 0.9); // Lighter blue
          vec3 sky = mix(skyBottom, skyTop, vUv.y);
          
          // Cloud color - pure white clouds
          vec3 cloudColor = vec3(1.0, 1.0, 1.0);
          sky = mix(sky, cloudColor, cloudDensity * 0.95);
          
          // Ground color (rolling hills - vibrant XP green)
          vec3 groundColor = vec3(0.0, 0.6, 0.0); // Bright vibrant green like XP
          vec3 groundShadow = vec3(0.0, 0.4, 0.0); // Darker green
          
          // Mix ground colors based on terrain height
          vec3 ground = mix(groundShadow, groundColor, terrainHeight);
          
          // Add subtle yellow flowers (like XP)
          float flowerNoise = sin(vUv.x * 40.0) * cos(vUv.y * 25.0);
          if (flowerNoise > 0.8 && vUv.y < 0.25) {
            ground = mix(ground, vec3(0.9, 0.9, 0.1), 0.2);
          }
          
          // Combine sky and ground
          vec3 color = mix(ground, sky, smoothstep(0.0, 0.15, vUv.y));
          
          // Boost saturation slightly to match XP vibrancy
          float luminance = dot(color, vec3(0.299, 0.587, 0.114));
          color = mix(vec3(luminance), color, 1.2);
          
          // Very subtle animation
          color += sin(time * 0.3 + vUv.x * 8.0) * 0.005;
          
          // Add subtle gradient fade to blend with background
          float fade = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
          color = mix(vec3(0.96, 0.97, 0.96), color, fade);
          
          gl_FragColor = vec4(color, 0.08); // Slightly more visible but still subtle
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    return { geometry, material };
  }, [theme]);
  
  useFrame((state) => {
    if (material && material.uniforms && material.uniforms.time) {
      material.uniforms.time.value = state.clock.elapsedTime;
    }
  });
  
  // Only render for light theme
  if (theme !== 'light' || !geometry || !material) {
    return null;
  }
  
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, -5, -80]} // Far behind everything, slightly lower
      rotation={[-Math.PI / 2, 0, 0]} // Face the camera
      scale={[1.5, 1.5, 1]} // Make it larger for better coverage
    />
  );
}
