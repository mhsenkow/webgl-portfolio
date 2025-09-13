'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldBackgroundProps {
  theme: 'light' | 'dark' | 'high-contrast';
}

// Generate star positions using Poisson distribution
function generateStars(count: number, width: number, height: number): { x: number; y: number; z: number; brightness: number; size: number }[] {
  const stars: { x: number; y: number; z: number; brightness: number; size: number }[] = [];
  
  for (let i = 0; i < count; i++) {
    // Random position in a sphere - much further back to avoid depth conflicts
    const radius = Math.random() * 200 + 200; // Distance from center (200-400 units)
    const theta = Math.random() * Math.PI * 2; // Azimuth
    const phi = Math.acos(2 * Math.random() - 1); // Elevation
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi) - 300; // Move all stars much further back
    
    // Brightness varies (some stars are dimmer)
    const brightness = Math.random() * 0.8 + 0.2;
    
    // Size varies (some stars are larger) - bigger stars for more impact
    const size = Math.random() * 0.8 + 0.2;
    
    stars.push({ x, y, z, brightness, size });
  }
  
  return stars;
}

// Generate nebula-like clouds
function generateNebula(width: number, height: number): number[][] {
  const nebula: number[][] = Array(height).fill(null).map(() => Array(width).fill(0));
  
  // Create multiple nebula layers
  for (let layer = 0; layer < 3; layer++) {
    const scale = 20 + layer * 10;
    const intensity = 0.1 + layer * 0.05;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Create wispy nebula patterns
        const noise1 = Math.sin(x / scale) * Math.cos(y / scale);
        const noise2 = Math.sin(x / scale * 1.3) * Math.cos(y / scale * 1.7);
        const noise3 = Math.sin(x / scale * 0.7) * Math.cos(y / scale * 0.9);
        
        nebula[y][x] += (noise1 + noise2 + noise3) * intensity;
      }
    }
  }
  
  return nebula;
}

export default function StarfieldBackground({ theme }: StarfieldBackgroundProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);
  
  const { geometry, material, starGeometry, starMaterial } = useMemo(() => {
    // Only create geometry and material for dark theme
    if (theme !== 'dark') {
      return { geometry: null, material: null, starGeometry: null, starMaterial: null };
    }
    
    const width = 200;
    const height = 100;
    const segments = 50;
    
    // Generate nebula
    const nebula = generateNebula(segments, segments);
    
    // Create nebula geometry
    const geometry = new THREE.PlaneGeometry(width, height, segments - 1, segments - 1);
    
    // Modify vertices for nebula depth
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = Math.floor((positions[i] / width + 0.5) * segments);
      const y = Math.floor((positions[i + 1] / height + 0.5) * segments);
      
      if (x >= 0 && x < segments && y >= 0 && y < segments) {
        positions[i + 2] = nebula[y][x] * 2;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Create nebula shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        nebula: { value: new THREE.DataTexture(
          new Float32Array(nebula.flat()),
          segments,
          segments,
          THREE.RedFormat,
          THREE.FloatType
        )}
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D nebula;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Sample nebula
          float nebulaDensity = texture2D(nebula, vUv + vec2(time * 0.005, 0.0)).r;
          
          // Deep space colors
          vec3 spaceColor = vec3(0.02, 0.02, 0.05); // Very dark blue-black
          vec3 nebulaColor1 = vec3(0.1, 0.05, 0.2); // Deep purple
          vec3 nebulaColor2 = vec3(0.05, 0.1, 0.15); // Deep blue
          vec3 nebulaColor3 = vec3(0.15, 0.05, 0.1); // Deep red
          
          // Mix nebula colors
          vec3 nebula = mix(nebulaColor1, nebulaColor2, sin(time * 0.3) * 0.5 + 0.5);
          nebula = mix(nebula, nebulaColor3, cos(time * 0.2) * 0.3 + 0.3);
          
          // Combine space and nebula
          vec3 color = mix(spaceColor, nebula, nebulaDensity * 0.3);
          
          // Very subtle animation
          color += sin(time * 0.1 + vUv.x * 5.0) * 0.01;
          
          gl_FragColor = vec4(color, 0.08); // More visible nebula
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Generate stars - many more stars for impressive Milky Way effect
    const stars = generateStars(8000, width, height);
    const starPositions = new Float32Array(stars.length * 3);
    const starColors = new Float32Array(stars.length * 3);
    const starSizes = new Float32Array(stars.length);
    
    stars.forEach((star, i) => {
      starPositions[i * 3] = star.x;
      starPositions[i * 3 + 1] = star.y;
      starPositions[i * 3 + 2] = star.z;
      
      // Star colors (brighter white stars for impressive Milky Way)
      const colorVariation = Math.random() * 0.1;
      starColors[i * 3] = 1.0; // Red - pure white
      starColors[i * 3 + 1] = 1.0; // Green - pure white
      starColors[i * 3 + 2] = 1.0; // Blue - pure white
      
      starSizes[i] = star.size;
    });
    
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          
          // Very subtle twinkling animation
          float twinkle = sin(time * 1.0 + position.x * 0.005) * 0.05 + 0.95;
          gl_PointSize = size * twinkle;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular stars
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
          gl_FragColor = vec4(vColor, alpha * 0.9); // Much brighter stars for impressive Milky Way
        }
      `,
      transparent: true,
      vertexColors: true
    });
    
    return { geometry, material, starGeometry, starMaterial };
  }, [theme]);
  
  useFrame((state) => {
    if (material && material.uniforms && material.uniforms.time) {
      material.uniforms.time.value = state.clock.elapsedTime;
    }
    if (starMaterial && starMaterial.uniforms && starMaterial.uniforms.time) {
      starMaterial.uniforms.time.value = state.clock.elapsedTime;
    }
  });
  
  // Only render for dark theme
  if (theme !== 'dark' || !geometry || !material || !starGeometry || !starMaterial) {
    return null;
  }
  
  return (
    <group>
      {/* Nebula background */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        position={[0, 0, -150]} // Much further behind everything
        rotation={[-Math.PI / 2, 0, 0]} // Face the camera
        scale={[3, 3, 1]} // Larger coverage, further away
        renderOrder={-999} // Render behind cards but in front of stars
      />
      
      {/* Stars */}
      <points
        ref={starsRef}
        geometry={starGeometry}
        material={starMaterial}
        position={[0, 0, -200]} // Much further back to avoid depth conflicts
        renderOrder={-1000} // Render behind everything else
      />
    </group>
  );
}
