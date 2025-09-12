'use client';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface Comet {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  tail: THREE.Vector3[];
  age: number;
  maxAge: number;
  brightness: number;
  color: THREE.Color;
}

export default function Comets() {
  const [comets, setComets] = useState<Comet[]>([]);
  const cometRef = useRef<THREE.Points>(null!);
  const lastSpawnTime = useRef(0);
  
  // Create comet texture with glow effect
  const cometTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    // Create radial gradient for comet glow
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(200, 220, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(150, 180, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(100, 140, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Spawn a new comet
  const spawnComet = () => {
    const newComet: Comet = {
      id: Math.random(),
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40, // Start from edge of scene
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 40
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.1
      ),
      tail: [],
      age: 0,
      maxAge: 200 + Math.random() * 300, // 200-500 frames lifespan
      brightness: 0.8 + Math.random() * 0.4,
      color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.3, 0.8) // Blue-white
    };
    
    // Initialize tail with some points
    for (let i = 0; i < 20; i++) {
      newComet.tail.push(newComet.position.clone());
    }
    
    setComets(prev => [...prev, newComet]);
  };

  // Update comet positions and physics
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Spawn new comets occasionally
    if (t - lastSpawnTime.current > 8 + Math.random() * 12) { // Every 8-20 seconds
      spawnComet();
      lastSpawnTime.current = t;
    }
    
    // Update existing comets
    setComets(prevComets => {
      return prevComets.map(comet => {
        const newComet = { ...comet };
        
        // Update position
        newComet.position.add(newComet.velocity);
        
        // Add gravity effect (slight pull toward center)
        const centerPull = newComet.position.clone().multiplyScalar(-0.0001);
        newComet.velocity.add(centerPull);
        
        // Add some randomness to movement
        newComet.velocity.add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.001,
          (Math.random() - 0.5) * 0.001,
          (Math.random() - 0.5) * 0.001
        ));
        
        // Update tail
        newComet.tail.unshift(newComet.position.clone());
        if (newComet.tail.length > 30) {
          newComet.tail.pop();
        }
        
        // Age the comet
        newComet.age++;
        
        // Fade out over time
        const ageRatio = newComet.age / newComet.maxAge;
        newComet.brightness = (1 - ageRatio) * (0.8 + Math.random() * 0.4);
        
        return newComet;
      }).filter(comet => comet.age < comet.maxAge); // Remove old comets
    });
  });

  // Prepare data for rendering
  const { positions, colors, sizes } = useMemo(() => {
    const posArray: number[] = [];
    const colorArray: number[] = [];
    const sizeArray: number[] = [];
    
    comets.forEach(comet => {
      // Add comet head
      posArray.push(comet.position.x, comet.position.y, comet.position.z);
      colorArray.push(comet.color.r, comet.color.g, comet.color.b);
      sizeArray.push(comet.brightness * 0.08); // Head size
      
      // Add tail particles
      comet.tail.forEach((tailPoint, index) => {
        posArray.push(tailPoint.x, tailPoint.y, tailPoint.z);
        
        // Fade tail from bright to dim
        const tailBrightness = comet.brightness * (1 - index / comet.tail.length) * 0.6;
        colorArray.push(comet.color.r, comet.color.g, comet.color.b);
        sizeArray.push(tailBrightness * 0.02); // Tail particle size
      });
    });
    
    return {
      positions: new Float32Array(posArray),
      colors: new Float32Array(colorArray),
      sizes: new Float32Array(sizeArray)
    };
  }, [comets]);

  if (positions.length === 0) return null;

  return (
    <Points ref={cometRef} positions={positions} colors={colors} sizes={sizes} stride={3}>
      <PointMaterial 
        size={0.05} 
        transparent 
        depthWrite={false}
        opacity={0.9}
        vertexColors={true}
        sizeAttenuation={true}
        alphaTest={0.001}
        map={cometTexture}
      />
    </Points>
  );
}
