'use client';
import { useMemo, useRef } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTheme } from './ThemeProvider';
import { getThemeColors } from './theme';

// Create a custom star texture
const createStarTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  // Create radial gradient for star glow
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export default function Particles({ count = 16000 }) {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const starTexture = useMemo(() => createStarTexture(), []);
  
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      // Create a more realistic spherical distribution
      const radius = Math.random() * 15 + 5; // Stars between 5-20 units away
      const theta = Math.random() * Math.PI * 2; // Random angle around Y axis
      const phi = Math.acos(Math.random() * 2 - 1); // Random angle from top to bottom
      
      arr[i] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i + 1] = radius * Math.cos(phi);
      arr[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const colorIndex = Math.floor(Math.random() * themeColors.particles.length);
      const color = themeColors.particles[colorIndex];
      arr[i * 3] = color[0];
      arr[i * 3 + 1] = color[1];
      arr[i * 3 + 2] = color[2];
    }
    return arr;
  }, [count, themeColors.particles]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Create size distribution - most stars are small, few are large
      const rand = Math.random();
      if (rand < 0.7) {
        // 70% small stars
        arr[i] = 0.01 + Math.random() * 0.02;
      } else if (rand < 0.9) {
        // 20% medium stars
        arr[i] = 0.03 + Math.random() * 0.02;
      } else {
        // 10% large/bright stars
        arr[i] = 0.05 + Math.random() * 0.03;
      }
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  const twinkleRef = useRef<Float32Array>(new Float32Array(count));
  const twinkleFrequencies = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = 0.3 + Math.random() * 1.5; // Random frequency between 0.3-1.8
    }
    return arr;
  }, [count]);
  
  const twinklePhases = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = Math.random() * Math.PI * 2; // Random phase offset
    }
    return arr;
  }, [count]);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.01; // Slower rotation for more subtle effect
    ref.current.rotation.x = Math.sin(t * 0.005) * 0.05; // Gentle sway

    // Update individual star twinkling
    const twinkleArray = twinkleRef.current;
    for (let i = 0; i < count; i++) {
      const frequency = twinkleFrequencies[i];
      const phase = twinklePhases[i];
      // Create more realistic twinkling with occasional bright flashes
      const baseTwinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * frequency + phase));
      const flash = Math.random() < 0.001 ? 1.5 : 1.0; // Occasional bright flash
      twinkleArray[i] = Math.min(baseTwinkle * flash, 1.0);
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} sizes={sizes} stride={3} frustumCulled>
      <PointMaterial 
        size={0.01} 
        transparent 
        depthWrite={false}
        opacity={0.3}
        vertexColors={true}
        sizeAttenuation={true}
        alphaTest={0.001}
        map={starTexture}
      />
    </Points>
  );
}
