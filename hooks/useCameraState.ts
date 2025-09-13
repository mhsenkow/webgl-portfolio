'use client';
import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function useCameraState() {
  const { camera } = useThree();
  const cameraStateRef = useRef({
    position: new THREE.Vector3(),
    fov: 60,
    aspect: 16/9
  });

  const updateCameraState = () => {
    cameraStateRef.current.position.copy(camera.position);
    if (camera instanceof THREE.PerspectiveCamera) {
      cameraStateRef.current.fov = camera.fov;
      cameraStateRef.current.aspect = camera.aspect;
    }
  };

  const getCurrentViewport = () => {
    const { position, fov, aspect } = cameraStateRef.current;
    const fovRad = (fov * Math.PI) / 180;
    const visibleHeight = 2 * position.z * Math.tan(fovRad / 2);
    const visibleWidth = visibleHeight * aspect;
    
    return {
      width: visibleWidth,
      height: visibleHeight,
      position: position.clone()
    };
  };

  return {
    updateCameraState,
    getCurrentViewport,
    cameraState: cameraStateRef.current
  };
}
