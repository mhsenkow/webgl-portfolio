'use client';
import { useRef, useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CardParticlesProps {
  position: THREE.Vector3;
  color: string;
  intensity: number;
}

export default function CardParticles({ position, color, intensity }: CardParticlesProps) {
  const ref = useRef<THREE.Points>(null!);
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 50;
    const posArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);
    
    const baseColor = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      // Create particles in a sphere around the card
      const radius = 0.8 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = radius * Math.cos(phi);
      posArray[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Color variation
      const colorVariation = 0.7 + Math.random() * 0.3;
      colorArray[i * 3] = baseColor.r * colorVariation;
      colorArray[i * 3 + 1] = baseColor.g * colorVariation;
      colorArray[i * 3 + 2] = baseColor.b * colorVariation;
      
      // Size variation
      sizeArray[i] = 0.01 + Math.random() * 0.02;
    }
    
    return {
      positions: posArray,
      colors: colorArray,
      sizes: sizeArray
    };
  }, [color]);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Gentle rotation
      ref.current.rotation.y = clock.getElapsedTime() * 0.1;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
      
      // Update opacity based on intensity
      if (ref.current.material) {
        (ref.current.material as THREE.PointsMaterial).opacity = intensity * 0.6;
      }
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} sizes={sizes} stride={3}>
      <PointMaterial 
        size={0.02} 
        transparent 
        depthWrite={false}
        opacity={intensity * 0.6}
        vertexColors={true}
        sizeAttenuation={true}
        alphaTest={0.001}
      />
    </Points>
  );
}
