/**
 * CameraController - Manages cinematic camera movements for time period focus
 * 
 * Features:
 * - Smooth camera transitions between time periods
 * - Respects user's current zoom level during transitions
 * - Non-conflicting with manual camera controls
 * - Automatic transition completion detection
 * 
 * Usage:
 * - Automatically triggers when timePeriod prop changes
 * - Moves camera to focus on relevant project cards
 * - Maintains user's zoom level for natural feel
 */
'use client';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraTransition } from './CameraTransitionProvider';

interface CameraControllerProps {
  /** Current selected time period for camera focus */
  timePeriod: string | null;
}

export default function CameraController({ timePeriod }: CameraControllerProps) {
  const { camera } = useThree();
  const { isTransitioning, setIsTransitioning } = useCameraTransition();
  const targetPositionRef = useRef(new THREE.Vector3());
  const targetLookAtRef = useRef(new THREE.Vector3());
  const currentPositionRef = useRef(camera.position.clone());
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const initialDistanceRef = useRef(0);
  const lastTimePeriodRef = useRef<string | null>(null);

  // Define camera positions for each time period
  const getCameraTargets = (period: string | null) => {
    if (!period) {
      // Return to overview position
      return {
        position: new THREE.Vector3(0, 0, 8),
        lookAt: new THREE.Vector3(0, 0, 0)
      };
    }

    // Time period order: Early, Mid, Recent, Current, Future
    const timePeriods = ['Early', 'Mid', 'Recent', 'Current', 'Future'];
    const periodIndex = timePeriods.indexOf(period);
    
    // Calculate focus position - center on the epoch's card area
    const x = (periodIndex - 2) * 2.5; // Same as card positioning
    const y = 0; // Keep camera level
    
    // Move camera closer for focused view - more subtle focus
    const focusDistance = 6; // More subtle focus distance
    const z = focusDistance;
    
    return {
      position: new THREE.Vector3(x, y, z),
      lookAt: new THREE.Vector3(x, 0, 0)
    };
  };

  // Update camera targets when time period changes
  useEffect(() => {
    // Only trigger transition if time period actually changed
    if (lastTimePeriodRef.current !== timePeriod) {
      const targets = getCameraTargets(timePeriod);
      targetPositionRef.current.copy(targets.position);
      targetLookAtRef.current.copy(targets.lookAt);
      setIsTransitioning(true);
      lastTimePeriodRef.current = timePeriod;
    }
  }, [timePeriod]);

  useFrame((state, delta) => {
    // Only animate camera if we're transitioning
    if (!isTransitioning) {
      // Update current position ref to match actual camera position when not transitioning
      currentPositionRef.current.copy(camera.position);
      return;
    }
    
    const lerpFactor = Math.min(delta * 2.5, 1); // Smoother, faster transition
    
    // Smoothly move camera position
    currentPositionRef.current.lerp(targetPositionRef.current, lerpFactor);
    camera.position.copy(currentPositionRef.current);
    
    // Smoothly move camera look-at target
    currentLookAtRef.current.lerp(targetLookAtRef.current, lerpFactor);
    camera.lookAt(currentLookAtRef.current);
    
    // Check if transition is complete
    const positionDistance = currentPositionRef.current.distanceTo(targetPositionRef.current);
    const lookAtDistance = currentLookAtRef.current.distanceTo(targetLookAtRef.current);
    if (positionDistance < 0.05 && lookAtDistance < 0.05) {
      // Add a small delay before re-enabling controls to prevent jarring handoff
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }
  });

  return null;
}
