/**
 * KeyboardControls - Handles WASD global translation and arrow key rotation
 * 
 * Features:
 * - WASD keys for global scene translation (sliding the entire view)
 * - Arrow keys for rotating around center
 * - Smooth, frame-rate independent movement
 * - Automatically disabled during camera transitions
 * - Automatically disabled when user is focused on input fields
 * - Non-conflicting with OrbitControls
 * 
 * Controls:
 * - W: Translate scene down
 * - S: Translate scene up  
 * - A: Translate scene right
 * - D: Translate scene left
 * - Q: Translate scene forward
 * - E: Translate scene backward
 * - ↑: Rotate up
 * - ↓: Rotate down
 * - ←: Rotate left
 * - →: Rotate right
 * 
 * Note: All controls are disabled when user is typing in search input or other form fields
 */
'use client';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraTransition } from './CameraTransitionProvider';

export default function KeyboardControls() {
  const { camera, scene } = useThree();
  const { isTransitioning } = useCameraTransition();
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const translationRef = useRef(new THREE.Vector3(0, 0, 0));
  
  // Tap detection for arrow keys
  const tapTimesRef = useRef<{ [key: string]: number[] }>({
    'arrowup': [],
    'arrowdown': [],
    'arrowleft': [],
    'arrowright': []
  });
  const tapThreshold = 300; // milliseconds between taps

  // Calculate speed multiplier based on tap count
  const getSpeedMultiplier = (key: string) => {
    const tapTimes = tapTimesRef.current[key];
    const now = Date.now();
    const recentTaps = tapTimes.filter(time => now - time < tapThreshold);
    
    if (recentTaps.length >= 3) return 3; // Triple tap = 3x speed
    if (recentTaps.length >= 2) return 2; // Double tap = 2x speed
    return 1; // Single tap = normal speed
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is focused on an input field
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      );
      
      // Don't process keys if user is typing in an input
      if (isInputFocused) return;
      
      const key = event.key.toLowerCase();
      keysRef.current[key] = true;
      
      // Track tap times for arrow keys
      if (key.startsWith('arrow')) {
        const now = Date.now();
        const tapTimes = tapTimesRef.current[key];
        
        // Remove old taps outside threshold
        const recentTaps = tapTimes.filter(time => now - time < tapThreshold);
        recentTaps.push(now);
        
        // Keep only last 3 taps
        tapTimesRef.current[key] = recentTaps.slice(-3);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Check if user is focused on an input field
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      );
      
      // Don't process keys if user is typing in an input
      if (isInputFocused) return;
      
      keysRef.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    // Don't move camera if we're transitioning between time periods
    if (isTransitioning) return;
    
    // Check if user is focused on an input field
    const activeElement = document.activeElement;
    const isInputFocused = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      (activeElement as HTMLElement).contentEditable === 'true'
    );
    
    // Don't process movement if user is typing in an input
    if (isInputFocused) return;
    
    const keys = keysRef.current;
    const moveSpeed = 0.1;
    const rotateSpeed = 0.02;
    
    // WASD controls - translate the entire scene (global translation)
    if (keys['w']) {
      translationRef.current.y -= moveSpeed;
    }
    if (keys['s']) {
      translationRef.current.y += moveSpeed;
    }
    if (keys['a']) {
      translationRef.current.x += moveSpeed;
    }
    if (keys['d']) {
      translationRef.current.x -= moveSpeed;
    }
    if (keys['q']) {
      translationRef.current.z -= moveSpeed;
    }
    if (keys['e']) {
      translationRef.current.z += moveSpeed;
    }
    
    // Apply global translation to the scene
    scene.position.copy(translationRef.current);
    
    // Arrow keys - rotate around center (camera movement) with tap speed multipliers
    if (keys['arrowup']) {
      const speedMultiplier = getSpeedMultiplier('arrowup');
      const currentSpeed = rotateSpeed * speedMultiplier;
      camera.position.y += Math.sin(camera.rotation.x) * currentSpeed;
      camera.position.z -= Math.cos(camera.rotation.x) * currentSpeed;
    }
    if (keys['arrowdown']) {
      const speedMultiplier = getSpeedMultiplier('arrowdown');
      const currentSpeed = rotateSpeed * speedMultiplier;
      camera.position.y -= Math.sin(camera.rotation.x) * currentSpeed;
      camera.position.z += Math.cos(camera.rotation.x) * currentSpeed;
    }
    if (keys['arrowleft']) {
      const speedMultiplier = getSpeedMultiplier('arrowleft');
      const currentSpeed = rotateSpeed * speedMultiplier;
      camera.position.x -= Math.cos(camera.rotation.y) * currentSpeed;
      camera.position.z -= Math.sin(camera.rotation.y) * currentSpeed;
    }
    if (keys['arrowright']) {
      const speedMultiplier = getSpeedMultiplier('arrowright');
      const currentSpeed = rotateSpeed * speedMultiplier;
      camera.position.x += Math.cos(camera.rotation.y) * currentSpeed;
      camera.position.z += Math.sin(camera.rotation.y) * currentSpeed;
    }
  });

  return null; // This component doesn't render anything
}
