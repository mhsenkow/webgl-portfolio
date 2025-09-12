/**
 * SpacePanControls - Handles space+drag panning functionality
 * 
 * Features:
 * - Space + mouse drag to pan around the scene
 * - Smooth panning with proper camera movement
 * - Disabled during camera transitions
 * - Non-conflicting with other controls
 */
'use client';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraTransition } from './CameraTransitionProvider';

export default function SpacePanControls() {
  const { camera } = useThree();
  const { isTransitioning, setIsTransitioning } = useCameraTransition();
  const isSpacePressedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const panSpeedRef = useRef(0.01);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        isSpacePressedRef.current = true;
        setIsTransitioning(true); // Disable OrbitControls
        document.body.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        isSpacePressedRef.current = false;
        isDraggingRef.current = false;
        setIsTransitioning(false); // Re-enable OrbitControls
        document.body.style.cursor = 'auto';
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (isSpacePressedRef.current) {
        event.preventDefault();
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: event.clientX, y: event.clientY };
        document.body.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isSpacePressedRef.current && isDraggingRef.current) {
        event.preventDefault();
        
        const deltaX = event.clientX - lastMousePosRef.current.x;
        const deltaY = event.clientY - lastMousePosRef.current.y;
        
        // Convert screen movement to world movement
        const panX = -deltaX * panSpeedRef.current;
        const panY = deltaY * panSpeedRef.current;
        
        // Move camera position
        camera.position.x += panX;
        camera.position.y += panY;
        
        lastMousePosRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleMouseUp = () => {
      if (isSpacePressedRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = 'grab';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [camera, isTransitioning]);

  return null; // This component doesn't render anything
}
