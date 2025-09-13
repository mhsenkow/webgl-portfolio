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
import { Project } from '@/data/projects';
import ProjectCard from './ProjectCard';
import { useWindowSize } from '@/hooks/useWindowSize';

interface CardCloudProps {
  projects: Project[];
  onCardClick: (project: Project, position: { x: number; y: number; z: number }) => void;
  onCardCenter?: (position: { x: number; y: number; z: number }) => void;
  timePeriod?: string | null;
  isDetailOpen?: boolean;
  query?: string;
  tag?: string | null;
  layout?: 'flat-grid' | 'staggered' | 'sphere' | 'spiral' | 'grid' | 'cube';
}

export default function CardCloud({ projects, onCardClick, onCardCenter, timePeriod, isDetailOpen = false, query = '', tag = null, layout = 'flat-grid' }: CardCloudProps) {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
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
          // Simple responsive viewport fit - always fits browser window perfectly
          const totalCards = projects.length;
          
          // Always use browser window dimensions for responsive fit
          const aspectRatio = windowWidth / windowHeight;
          const cameraDistance = 12;
          const fov = 60;
          const fovRad = (fov * Math.PI) / 180;
          const visibleHeight = 2 * cameraDistance * Math.tan(fovRad / 2);
          const visibleWidth = visibleHeight * aspectRatio;
          
          // Card dimensions
          const cardWidth = 1.8;
          const cardHeight = 1.2;
          
          // Calculate optimal grid to fill viewport
          const maxCols = Math.floor(visibleWidth / (cardWidth * 1.2));
          const maxRows = Math.floor(visibleHeight / (cardHeight * 1.2));
          
          let cols = Math.min(maxCols, Math.ceil(Math.sqrt(totalCards)));
          let rows = Math.ceil(totalCards / cols);
          
          if (rows > maxRows) {
            rows = maxRows;
            cols = Math.ceil(totalCards / rows);
          }
          
          cols = Math.max(1, cols);
          rows = Math.max(1, rows);
          
          const row = Math.floor(index / cols);
          const col = index % cols;
          
          // Fill viewport with even spacing and more padding
          const availableWidth = visibleWidth * 0.75; // Use 75% of viewport width (more padding)
          const availableHeight = visibleHeight * 0.75; // Use 75% of viewport height (more padding)
          
          const horizontalSpacing = cols > 1 ? availableWidth / (cols - 1) : 0;
          const verticalSpacing = rows > 1 ? availableHeight / (rows - 1) : 0;
          
          const centerOffsetX = (cols - 1) / 2;
          const centerOffsetY = (rows - 1) / 2;
          
          x = (col - centerOffsetX) * horizontalSpacing;
          y = -(row - centerOffsetY) * verticalSpacing;
          z = 0;
          break;
          
        case 'staggered':
          // Time progression layout - shows chronological journey from left to right
          const staggeredTimePeriods = ['Early', 'Mid', 'Recent', 'Current', 'Future'];
          const staggeredTimeIndex = staggeredTimePeriods.indexOf(project.timePeriod);
          
          // X-axis: Time progression (Early = far left, Future = far right)
          x = (staggeredTimeIndex - 2) * 3.5; // Center around 0, spread out more
          
          // Y-axis: Category grouping within each time period
          const staggeredCategoryOrder = ['Productdesign', 'DataViz', 'AI', 'Music', 'Writing'];
          const staggeredCategoryIndex = staggeredCategoryOrder.indexOf(project.tags[0] as 'Productdesign' | 'DataViz' | 'AI' | 'Music' | 'Writing');
          y = (staggeredCategoryIndex - 2) * 1.8; // Group by category vertically
          
          // Z-axis: Featured projects float higher
          z = project.featured ? 2.5 : 0.8; // Increased Z-depth
          
          // Add subtle random variation for natural feel
          x += (Math.random() - 0.5) * 0.3;
          y += (Math.random() - 0.5) * 0.3;
          z += (Math.random() - 0.5) * 0.2;
          break;
          
        case 'sphere':
          // Category-based sphere - projects grouped by skill/category
          const sphereCategories = ['Productdesign', 'DataViz', 'AI', 'Music', 'Writing'];
          const sphereCategoryIndex = sphereCategories.indexOf(project.tags[0] as 'Productdesign' | 'DataViz' | 'AI' | 'Music' | 'Writing');
          
          // Create 5 vertical "poles" for each category
          const poleAngle = (sphereCategoryIndex / sphereCategories.length) * Math.PI * 2;
          const radius = 4.5;
          
          // Position around the sphere based on category
          x = radius * Math.cos(poleAngle);
          y = radius * Math.sin(poleAngle);
          
          // Z-axis: Featured projects at top, others distributed vertically
          if (project.featured) {
            z = 4 + Math.random() * 2; // Featured projects at top (increased)
          } else {
            z = (Math.random() - 0.5) * 6; // Others distributed vertically (increased)
          }
          
          // Add some variation within each category
          x += (Math.random() - 0.5) * 0.8;
          y += (Math.random() - 0.5) * 0.8;
          z += (Math.random() - 0.5) * 0.5;
          break;
          
        case 'spiral':
          // Full DNA 3D spiral - very noticeable and dramatic
          const dnaRadius = 2.5; // Larger radius for more dramatic effect
          const dnaHeight = index * 0.8; // Much more height variation
          const dnaAngle = index * 1.2; // More turns for DNA effect
          
          // Create the main spiral
          x = dnaRadius * Math.cos(dnaAngle);
          z = dnaRadius * Math.sin(dnaAngle);
          y = dnaHeight - 8; // Center vertically with more range
          
          // Add DNA double-helix effect by offsetting every other card
          if (index % 2 === 0) {
            x *= 1.2; // Outer helix
            z *= 1.2;
          } else {
            x *= 0.8; // Inner helix
            z *= 0.8;
            y += 0.4; // Slight height offset for double helix
          }
          
          // Featured cards get even more dramatic positions
          if (project.featured) {
            x *= 1.5;
            z *= 1.5;
            y += 3;
          }
          
          // Add some variation for natural feel
          x += (Math.random() - 0.5) * 0.4;
          y += (Math.random() - 0.5) * 0.3;
          z += (Math.random() - 0.5) * 0.4;
          break;
          
        case 'grid':
          // Skill matrix grid - shows projects organized by skill categories
          const gridSkillCategories = ['Productdesign', 'DataViz', 'AI', 'Music', 'Writing'];
          const gridSkillIndex = gridSkillCategories.indexOf(project.tags[0] as 'Productdesign' | 'DataViz' | 'AI' | 'Music' | 'Writing');
          
          // X-axis: Skill category (columns)
          x = (gridSkillIndex - 2) * 3;
          
          // Y-axis: Time period (rows)
          const gridTimePeriods = ['Early', 'Mid', 'Recent', 'Current', 'Future'];
          const gridTimeIndex = gridTimePeriods.indexOf(project.timePeriod);
          y = (gridTimeIndex - 2) * 2.5;
          
          // Z-axis: Featured projects in front
          z = project.featured ? -2.5 : 2; // Increased Z-depth
          
          // Add variation within each cell
          x += (Math.random() - 0.5) * 0.8;
          y += (Math.random() - 0.5) * 0.8;
          z += (Math.random() - 0.5) * 0.5;
          break;
          
        case 'cube':
          // 3D cube formation - cards arranged in a proper cube, more spread out
          const cubeSize = Math.ceil(Math.cbrt(projects.length));
          const cubeX = index % cubeSize;
          const cubeY = Math.floor(index / cubeSize) % cubeSize;
          const cubeZ = Math.floor(index / (cubeSize * cubeSize));
          
          // Position cards in a cube formation with more spacing
          x = (cubeX - cubeSize / 2) * 3.5; // Increased from 2.2 to 3.5
          y = (cubeY - cubeSize / 2) * 3.5; // Increased from 2.2 to 3.5
          z = (cubeZ - cubeSize / 2) * 3.5; // Increased from 2.2 to 3.5
          
          // Featured cards get center positions but still spread out
          if (project.featured) {
            x *= 0.7; // Less dramatic centering
            y *= 0.7;
            z *= 0.7;
          }
          
          // Add some variation for natural feel
          x += (Math.random() - 0.5) * 0.5;
          y += (Math.random() - 0.5) * 0.5;
          z += (Math.random() - 0.5) * 0.5;
          break;
          
        default:
          x = y = z = 0;
      }
      
      return new THREE.Vector3(x, y, z);
    });
  }, [timePeriod, layout, windowWidth, windowHeight]);

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
