'use client';
import { useMemo, useState } from 'react';
import { projects as seed, Project } from '@/data/projects';

export function useProjects() {
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
        // Responsive 2D Grid layout positioning (same logic as CardCloud)
        const totalCards = seed.length;
        
        // Responsive grid calculation based on aspect ratio
        const aspectRatio = 16 / 9;
        let cols = Math.ceil(Math.sqrt(totalCards * aspectRatio));
        let rows = Math.ceil(totalCards / cols);
        
        // Adjust for better fit if needed
        if (cols * rows - totalCards >= cols) {
          rows = Math.max(1, rows - 1);
        }
        
        // Ensure we don't have too many columns (max 6 for readability)
        cols = Math.min(cols, 6);
        rows = Math.ceil(totalCards / cols);
        
        const row = Math.floor(projectIndex / cols);
        const col = projectIndex % cols;
        
        // Responsive spacing based on grid size
        const baseSpacing = 2.2;
        const spacingMultiplier = Math.max(0.7, 1 - (cols - 3) * 0.1);
        const horizontalSpacing = baseSpacing * spacingMultiplier;
        const verticalSpacing = horizontalSpacing * 0.8;
        
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
