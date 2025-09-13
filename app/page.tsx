'use client';
import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Particles from '@/components/Particles';
import Comets from '@/components/Comets';
import CardCloud from '@/components/CardCloud';
import Hud from '@/components/Hud';
import AnimatedProjectDetail from '@/components/AnimatedProjectDetail';
import KeyboardControls from '@/components/KeyboardControls';
import SpacePanControls from '@/components/SpacePanControls';
import CardCenterController from '@/components/CardCenterController';
import CameraController from '@/components/CameraController';
import { CameraTransitionProvider, useCameraTransition } from '@/components/CameraTransitionProvider';
// import PostProcessing from '@/components/PostProcessing';
import { Project } from '@/data/projects';
import { ProjectsProvider, useProjectsContext } from '@/components/ProjectsProvider';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';
import { getThemeColors } from '@/components/theme';
import LandscapeBackground from '@/components/LandscapeBackground';
import StarfieldBackground from '@/components/StarfieldBackground';

// Component that can access camera transition state
function ControlledOrbitControls() {
  const { isTransitioning } = useCameraTransition();
  const { cardPosition } = useProjectsContext();
  
  return (
    <OrbitControls 
      enableDamping={true} 
      dampingFactor={0.05} 
      enablePan={true} 
      enableZoom={true}
      minDistance={3}
      maxDistance={25}
      enabled={!isTransitioning}
      makeDefault={false}
      target={cardPosition ? [cardPosition.x, cardPosition.y, cardPosition.z] : [0, 0, 0]}
    />
  );
}

function PortfolioContent() {
  const { timePeriod, selectedProject, setSelectedProject, cardPosition, setCardPosition, query, tag, layout } = useProjectsContext();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const handleCardClick = (project: Project, position: { x: number; y: number; z: number }) => {
    setCardPosition(position);
    setSelectedProject(project);
  };

  const handleCardCenter = (position: { x: number; y: number; z: number }) => {
    // Center the camera on the clicked card
    setCardPosition(position);
  };

  return (
    <main className="h-dvh w-full">
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 1000 }}
        shadows
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <CameraTransitionProvider>
          <color attach="background" args={[themeColors.background]} />
          
          {/* Subtle landscape background for light mode */}
          <LandscapeBackground theme={theme} />
          
          {/* Starfield background for dark mode */}
          <StarfieldBackground theme={theme} />
          
          {/* Soft lighting setup for light background */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[4, 6, 8]} 
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          {/* Subtle fill lights */}
          <pointLight position={[2, 3, 5]} intensity={0.4} color="#ffffff" />
          <pointLight position={[-2, 3, 5]} intensity={0.3} color="#ffffff" />
          <pointLight position={[0, -2, 3]} intensity={0.2} color="#ffffff" />
          
          <Particles count={8000} />
          <Comets />
          <CardCloud onCardClick={handleCardClick} onCardCenter={handleCardCenter} timePeriod={timePeriod} isDetailOpen={!!selectedProject} query={query} tag={tag} layout={layout} />
          <ControlledOrbitControls />
          <KeyboardControls />
          <SpacePanControls />
          <CameraController timePeriod={timePeriod} />
          <CardCenterController cardPosition={cardPosition} />
          {/* <PostProcessing /> */}
        </CameraTransitionProvider>
      </Canvas>
      <Hud />
      <ThemeToggle />
      {selectedProject && (
        <AnimatedProjectDetail 
          project={selectedProject} 
          cardPosition={cardPosition || undefined}
          onClose={() => {
            setSelectedProject(null);
            setCardPosition(null);
          }} 
        />
      )}
      <Loader />
    </main>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <ProjectsProvider>
        <PortfolioContent />
      </ProjectsProvider>
    </ThemeProvider>
  );
}
