/**
 * CardCenterController - Handles centering camera on individual cards
 * 
 * Features:
 * - Smooth camera movement to center on clicked card
 * - Maintains appropriate distance for viewing
 * - Smooth transitions with proper easing
 * - Non-conflicting with other camera controls
 */
'use client';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraTransition } from './CameraTransitionProvider';

interface CardCenterControllerProps {
  cardPosition: { x: number; y: number; z: number } | null;
}

export default function CardCenterController({ cardPosition }: CardCenterControllerProps) {
  const { camera } = useThree();
  const { isTransitioning, setIsTransitioning } = useCameraTransition();
  const targetPositionRef = useRef(new THREE.Vector3());
  const targetLookAtRef = useRef(new THREE.Vector3());
  const currentPositionRef = useRef(camera.position.clone());
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const lastCardPositionRef = useRef<{ x: number; y: number; z: number } | null>(null);

  // Update camera targets when card position changes
  useEffect(() => {
    if (cardPosition && cardPosition !== lastCardPositionRef.current) {
      // Calculate camera position to center on the card
      const cardPos = new THREE.Vector3(cardPosition.x, cardPosition.y, cardPosition.z);
      const cameraDistance = 6; // Closer for better focus
      
      // Position camera at a slight angle for better viewing
      const cameraOffset = new THREE.Vector3(0, 1, cameraDistance); // Slightly above and in front
      const targetCameraPos = cardPos.clone().add(cameraOffset);
      
      // Look at a point slightly above the card for better perspective
      const lookAtPos = cardPos.clone().add(new THREE.Vector3(0, 0.2, 0));
      
      targetPositionRef.current.copy(targetCameraPos);
      targetLookAtRef.current.copy(lookAtPos);
      
      setIsTransitioning(true);
      lastCardPositionRef.current = cardPosition;
    }
  }, [cardPosition, setIsTransitioning]);

  useFrame((state, delta) => {
    // Only animate camera if we're transitioning
    if (!isTransitioning) {
      // Update current position ref to match actual camera position when not transitioning
      currentPositionRef.current.copy(camera.position);
      return;
    }
    
    const lerpFactor = Math.min(delta * 2.5, 1); // Smooth transition
    
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
      // Transition complete - ensure we're exactly at the target
      camera.position.copy(targetPositionRef.current);
      camera.lookAt(targetLookAtRef.current);
      
      // Update current refs to match final position
      currentPositionRef.current.copy(targetPositionRef.current);
      currentLookAtRef.current.copy(targetLookAtRef.current);
      
      // Force camera to maintain its target for a few frames
      let frameCount = 0;
      const maintainTarget = () => {
        if (frameCount < 5) {
          camera.lookAt(targetLookAtRef.current);
          frameCount++;
          requestAnimationFrame(maintainTarget);
        } else {
          setIsTransitioning(false);
        }
      };
      maintainTarget();
    }
  });

  return null;
}
