'use client';
import { useMemo, useState } from 'react';
import { projects as seed, Project } from '@/data/projects';
import { useWindowSize } from './useWindowSize';

export function useProjects() {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<string | null>(null);
  const [layout, setLayout] = useState<'flat-grid' | 'staggered' | 'sphere' | 'spiral' | 'grid' | 'cube'>('flat-grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [focusedProject, setFocusedProject] = useState<Project | null>(null);

  const projects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return seed.filter(p => {
      const hitQ = !q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const hitT = !tag || p.tags.includes(tag as any);
      const hitTP = !timePeriod || p.timePeriod === timePeriod;
      return hitQ && hitT && hitTP;
    });
  }, [query, tag, timePeriod]);

  const timePeriods = ['Early', 'Mid', 'Recent', 'Current', 'Future'] as const;

  // Get featured projects for focus buttons
  const featuredProjects = useMemo(() => {
    return seed.filter(p => p.featured).slice(0, 6); // Show top 6 featured projects
  }, []);

  // Function to focus on a specific project
  const focusProject = (project: Project) => {
    setFocusedProject(project);
    
    // Find the actual position of this project in the current layout
    const projectIndex = seed.findIndex(p => p.id === project.id);
    if (projectIndex === -1) return;
    
    let x, y, z;
    
    // Use the same positioning logic as CardCloud
    switch (layout) {
      case 'flat-grid':
        // Browser window responsive 2D Grid layout positioning (same logic as CardCloud)
        const totalCards = seed.length;
        
        // Calculate viewport dimensions based on browser window size
        const aspectRatio = windowWidth / windowHeight;
        
        // Base the 3D viewport on the browser window aspect ratio
        const cameraDistance = 12;
        const fov = 60;
        const fovRad = (fov * Math.PI) / 180;
        const visibleHeight = 2 * cameraDistance * Math.tan(fovRad / 2);
        const visibleWidth = visibleHeight * aspectRatio;
        
        // Card dimensions (1.8 x 1.2)
        const cardWidth = 1.8;
        const cardHeight = 1.2;
        
        // Calculate optimal grid based on browser window
        const maxCols = Math.floor(visibleWidth / (cardWidth * 1.3)); // 30% margin between cards
        const maxRows = Math.floor(visibleHeight / (cardHeight * 1.3));
        
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
        
        const row = Math.floor(projectIndex / cols);
        const col = projectIndex % cols;
        
        // Calculate spacing to fill browser viewport nicely
        const availableWidth = visibleWidth * 0.85; // Use 85% of viewport width
        const availableHeight = visibleHeight * 0.85; // Use 85% of viewport height
        
        const horizontalSpacing = cols > 1 ? availableWidth / (cols - 1) : 0;
        const verticalSpacing = rows > 1 ? availableHeight / (rows - 1) : 0;
        
        // Center the grid
        const centerOffsetX = (cols - 1) / 2;
        const centerOffsetY = (rows - 1) / 2;
        
        x = (col - centerOffsetX) * horizontalSpacing;
        y = -(row - centerOffsetY) * verticalSpacing;
        z = 0;
        break;
        
      case 'staggered':
        // Staggered layout positioning
        const timePeriods = ['Early', 'Mid', 'Recent', 'Current', 'Future'];
        const tagOrder = ['Productdesign', 'DataViz', 'AI', 'Music', 'Writing'];
        
        const periodIndex = timePeriods.indexOf(project.timePeriod);
        const tagIndex = tagOrder.indexOf(project.tags[0]);
        
        x = (periodIndex - 2) * 2.5;
        y = (tagIndex - 2) * 1.5;
        z = project.featured ? 0.5 : -0.3;
        break;
        
      default:
        // Default to staggered layout
        const timePeriodsDefault = ['Early', 'Mid', 'Recent', 'Current', 'Future'];
        const periodIndexDefault = timePeriodsDefault.indexOf(project.timePeriod);
        x = (periodIndexDefault - 2) * 2.5;
        y = 0;
        z = 0;
    }
    
    setCardPosition({ x, y, z });
  };

  // Function to clear focus
  const clearFocus = () => {
    setFocusedProject(null);
    setCardPosition(null);
  };

  return { 
    projects, 
    query, 
    setQuery, 
    tag, 
    setTag, 
    timePeriod, 
    setTimePeriod, 
    layout,
    setLayout,
    timePeriods,
    selectedProject,
    setSelectedProject,
    cardPosition,
    setCardPosition,
    featuredProjects,
    focusedProject,
    focusProject,
    clearFocus
  } as const;
}
