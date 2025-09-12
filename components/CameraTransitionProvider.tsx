'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface CameraTransitionContextType {
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
}

const CameraTransitionContext = createContext<CameraTransitionContextType | undefined>(undefined);

export function CameraTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <CameraTransitionContext.Provider value={{ isTransitioning, setIsTransitioning }}>
      {children}
    </CameraTransitionContext.Provider>
  );
}

export function useCameraTransition() {
  const context = useContext(CameraTransitionContext);
  if (context === undefined) {
    throw new Error('useCameraTransition must be used within a CameraTransitionProvider');
  }
  return context;
}
