/**
 * CardCloud - Manages the 3D cloud of project cards
 * 
 * Features:
 * - Dynamic 3D positioning based on time period and category
 * - Smooth interpolation between positions
 * - Visibility-based filtering (search and tags)
 * - Glass morphism effects on all cards
 * - Synchronized fade-out during detail view
 * 
 * Positioning Logic:
 * - X-axis: Time period (Early to Future)
 * - Y-axis: Category tags (Productdesign, DataViz, AI, Music, Writing)
 * - Z-axis: Featured status and time period relevance
 */
'use client';
import { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { projects, Project } from '@/data/projects';
import ProjectCard from './ProjectCard';

interface CardCloudProps {
  onCardClick: (project: Project, position: { x: number; y: number; z: number }) => void;
  onCardCenter?: (position: { x: number; y: number; z: number }) => void;
  timePeriod?: string | null;
  isDetailOpen?: boolean;
  query?: string;
  tag?: string | null;
  layout?: 'flat-grid' | 'staggered' | 'sphere' | 'spiral' | 'grid' | 'cube';
}

export default function CardCloud({ onCardClick, onCardCenter, timePeriod, isDetailOpen = false, query = '', tag = null, layout = 'flat-grid' }: CardCloudProps) {
  const [targetPositions, setTargetPositions] = useState<THREE.Vector3[]>([]);
  const [currentPositions, setCurrentPositions] = useState<THREE.Vector3[]>([]);
  const [currentOpacity, setCurrentOpacity] = useState(0.85);

  // Calculate visibility for each card based on search and filter criteria
  const getCardVisibility = (project: Project) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || 
      project.title.toLowerCase().includes(q) || 
      project.summary.toLowerCase().includes(q) || 
      project.description.toLowerCase().includes(q);
    
    const matchesTag = !tag || project.tags.includes(tag as 'Productdesign' | 'DataViz' | 'AI' | 'Music' | 'Writing');
    const matchesTimePeriod = !timePeriod || project.timePeriod === timePeriod;
    
    // Time period focus gets highest priority
    if (timePeriod && matchesTimePeriod) {
      if (matchesQuery && matchesTag) return 1.0;
      if (matchesQuery || matchesTag) return 0.8;
      return 0.6; // Still visible even without query/tag match
    }
    
    // If both query and tag match, full visibility
    if (matchesQuery && matchesTag) return 1.0;
    
    // If only one matches, reduced visibility
    if (matchesQuery || matchesTag) return 0.3;
    
    // If neither matches, very low visibility
    return 0.1;
  };

  const positions = useMemo(() => {
    const timePeriodOrder = ['Early', 'Mid', 'Recent', 'Current', 'Future'];
    const tagOrder = ['Productdesign', 'DataViz', 'AI', 'Music', 'Writing'];
    
    return projects.map((project, index) => {
      let x, y, z;
      
      switch (layout) {
        case 'flat-grid':
          // Viewport-responsive 2D Grid layout
          const totalCards = projects.length;
          
          // Get viewport dimensions (assuming standard camera setup)
          // Camera is at z=12, fov=60, so we can calculate visible area
          const cameraDistance = 12;
          const fov = 60;
          const fovRad = (fov * Math.PI) / 180;
          const visibleHeight = 2 * cameraDistance * Math.tan(fovRad / 2);
          const visibleWidth = visibleHeight * (16 / 9); // Assuming 16:9 aspect ratio
          
          // Card dimensions (1.8 x 1.2)
          const cardWidth = 1.8;
          const cardHeight = 1.2;
          
          // Calculate optimal grid based on viewport
          const maxCols = Math.floor(visibleWidth / (cardWidth * 1.2)); // 20% margin between cards
          const maxRows = Math.floor(visibleHeight / (cardHeight * 1.2));
          
          // Calculate actual grid dimensions
          let cols = Math.min(maxCols, Math.ceil(Math.sqrt(totalCards)));
          let rows = Math.ceil(totalCards / cols);
          
          // Ensure we don't exceed viewport limits
          if (rows > maxRows) {
            rows = maxRows;
            cols = Math.ceil(totalCards / rows);
          }
          
          // Ensure minimum of 1 column
          cols = Math.max(1, cols);
          rows = Math.max(1, rows);
          
          const row = Math.floor(index / cols);
          const col = index % cols;
          
          // Calculate spacing to fill viewport nicely
          const availableWidth = visibleWidth * 0.8; // Use 80% of viewport width
          const availableHeight = visibleHeight * 0.8; // Use 80% of viewport height
          
          const horizontalSpacing = cols > 1 ? availableWidth / (cols - 1) : 0;
          const verticalSpacing = rows > 1 ? availableHeight / (rows - 1) : 0;
          
          // Center the grid
          const centerOffsetX = (cols - 1) / 2;
          const centerOffsetY = (rows - 1) / 2;
          
          x = (col - centerOffsetX) * horizontalSpacing;
          y = -(row - centerOffsetY) * verticalSpacing; // Inverted for proper layout
          z = 0; // All cards at the same Z level for flat appearance
          
          // Add very subtle random variation to make it feel more natural
          x += (Math.random() - 0.5) * 0.05;
          y += (Math.random() - 0.5) * 0.05;
          z += (Math.random() - 0.5) * 0.02;
          break;
          
        case 'staggered':
          // Original staggered layout with time period focus
          const timeIndex = timePeriodOrder.indexOf(project.timePeriod);
          x = (timeIndex - 2) * 2.5;
          
          const tagIndex = tagOrder.indexOf(project.tags[0]);
          y = (tagIndex - 2) * 1.5;
          
          if (timePeriod) {
            const selectedTimeIndex = timePeriodOrder.indexOf(timePeriod);
            const timeDistance = Math.abs(timeIndex - selectedTimeIndex);
            
            if (project.timePeriod === timePeriod) {
              // Focused epoch cards are closer but not too close
              z = Math.random() * 1.5 + 1.0; // Closer but not too dramatic
              x += (Math.random() - 0.5) * 1.0; // Some variation but centered
              y += (Math.random() - 0.5) * 1.0;
            } else {
              // Other cards are pushed back more subtly
              z = 2.5 + timeDistance * 1.5 + Math.random() * 1.0;
              x += (Math.random() - 0.5) * 0.8;
              y += (Math.random() - 0.5) * 0.8;
            }
          } else {
            z = project.featured ? Math.random() * 2 + 1 : Math.random() * 3 + 2;
            x += (Math.random() - 0.5) * 0.8;
            y += (Math.random() - 0.5) * 0.8;
          }
          break;
          
        case 'sphere':
          // Arrange cards in a sphere formation
          const radius = 4 + (project.featured ? 1 : 0);
          const phi = Math.acos(1 - 2 * index / projects.length); // Golden spiral distribution
          const theta = Math.PI * (1 + Math.sqrt(5)) * index; // Golden angle
          
          x = radius * Math.sin(phi) * Math.cos(theta);
          y = radius * Math.sin(phi) * Math.sin(theta);
          z = radius * Math.cos(phi);
          
          // Add some randomness for organic feel
          x += (Math.random() - 0.5) * 0.5;
          y += (Math.random() - 0.5) * 0.5;
          z += (Math.random() - 0.5) * 0.5;
          break;
          
        case 'spiral':
          // Arrange cards in a spiral formation
          const spiralRadius = 0.5 + index * 0.3;
          const spiralAngle = index * 0.8;
          const spiralHeight = index * 0.2;
          
          x = spiralRadius * Math.cos(spiralAngle);
          y = spiralHeight - 2;
          z = spiralRadius * Math.sin(spiralAngle);
          
          // Featured cards get higher positions
          if (project.featured) {
            y += 2;
            x *= 1.2;
            z *= 1.2;
          }
          break;
          
        case 'grid':
          // Arrange cards in a 3D grid
          const gridSize = Math.ceil(Math.cbrt(projects.length));
          const gridX = index % gridSize;
          const gridY = Math.floor(index / gridSize) % gridSize;
          const gridZ = Math.floor(index / (gridSize * gridSize));
          
          x = (gridX - gridSize / 2) * 2.5;
          y = (gridY - gridSize / 2) * 2;
          z = (gridZ - gridSize / 2) * 2.5;
          
          // Featured cards get front positions
          if (project.featured) {
            z -= 1;
          }
          break;
          
        case 'cube':
          // Arrange cards in a cube formation
          const cubeSize = Math.ceil(Math.cbrt(projects.length));
          const cubeX = index % cubeSize;
          const cubeY = Math.floor(index / cubeSize) % cubeSize;
          const cubeZ = Math.floor(index / (cubeSize * cubeSize));
          
          x = (cubeX - cubeSize / 2) * 1.8;
          y = (cubeY - cubeSize / 2) * 1.8;
          z = (cubeZ - cubeSize / 2) * 1.8;
          
          // Featured cards get center positions
          if (project.featured) {
            x *= 0.7;
            y *= 0.7;
            z *= 0.7;
          }
          break;
          
        default:
          x = y = z = 0;
      }
      
      return new THREE.Vector3(x, y, z);
    });
  }, [timePeriod, layout]);

  // Update target positions when timePeriod changes
  useEffect(() => {
    setTargetPositions(positions);
  }, [positions]);

  // Initialize current positions
  useEffect(() => {
    if (currentPositions.length === 0) {
      setCurrentPositions(positions);
    }
  }, [positions, currentPositions.length]);

  useFrame((state, delta: number) => {
    // Smoothly interpolate positions towards targets
    const lerpFactor = Math.min(delta * 2, 1); // Smooth transition speed
    
    const newCurrentPositions = currentPositions.map((currentPos, i) => {
      const targetPos = targetPositions[i];
      if (targetPos) {
        return currentPos.clone().lerp(targetPos, lerpFactor);
      }
      return currentPos;
    });
    
    setCurrentPositions(newCurrentPositions);

    // Smoothly animate opacity
    const targetOpacity = isDetailOpen ? 0 : 0.85;
    const opacityLerpFactor = Math.min(delta * 3, 1); // Faster opacity transition
    setCurrentOpacity(prev => prev + (targetOpacity - prev) * opacityLerpFactor);
  });

  const handleCardClick = (project: Project, position: THREE.Vector3) => {
    onCardClick(project, { x: position.x, y: position.y, z: position.z });
  };

  const handleCardCenter = (position: THREE.Vector3) => {
    if (onCardCenter) {
      onCardCenter({ x: position.x, y: position.y, z: position.z });
    }
  };

  return (
    <>
      {projects.map((project, i) => {
        const baseOpacity = currentOpacity;
        const visibilityMultiplier = getCardVisibility(project);
        const finalOpacity = baseOpacity * visibilityMultiplier;
        
        return (
          <ProjectCard
            key={project.id}
            project={project}
            position={currentPositions[i] || positions[i]}
            onClick={handleCardClick}
            onCenter={handleCardCenter}
            opacity={finalOpacity}
          />
        );
      })}
    </>
  );
}
