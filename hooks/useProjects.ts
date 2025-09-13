'use client';
import { useMemo, useState } from 'react';
import { projects as originalSeed, Project } from '@/data/projects';
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
  const [additionalProjects, setAdditionalProjects] = useState<Project[]>([]);

  // Combine original projects with additional generated ones
  const seed = useMemo(() => [...originalSeed, ...additionalProjects], [additionalProjects]);

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
        const maxCols = Math.floor(visibleWidth / (cardWidth * 1.1)); // 10% margin between cards (tighter)
        const maxRows = Math.floor(visibleHeight / (cardHeight * 1.1));
        
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
        const availableWidth = visibleWidth * 0.95; // Use 95% of viewport width (tighter)
        const availableHeight = visibleHeight * 0.95; // Use 95% of viewport height (tighter)
        
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

  // Function to generate additional lorem ipsum projects
  const generateAdditionalProjects = () => {
    const loremTitles = [
      'Lorem Ipsum Design System', 'Dolor Sit Amet Dashboard', 'Consectetur Adipiscing Analytics',
      'Elit Sed Do Visualization', 'Eiusmod Tempor Interface', 'Incididunt Ut Labore Component',
      'Et Dolore Magna Aliqua', 'Ut Enim Ad Minim Veniam', 'Quis Nostrud Exercitation',
      'Ullamco Laboris Nisi', 'Ut Aliquip Ex Ea', 'Commodo Consequat Duis',
      'Aute Irure Dolor In', 'Reprehenderit In Voluptate', 'Velit Esse Cillum Dolore',
      'Eu Fugiat Nulla Pariatur', 'Excepteur Sint Occaecat', 'Cupidatat Non Proident',
      'Sunt In Culpa Qui', 'Officia Deserunt Mollit', 'Anim Id Est Laborum',
      'Sed Ut Perspiciatis', 'Unde Omnis Iste Natus', 'Error Sit Voluptatem',
      'Accusantium Doloremque', 'Laudantium Totam Rem', 'Aperiam Eaque Ipsa',
      'Quae Ab Illo Inventore', 'Veritatis Et Quasi', 'Architecto Beatae Vitae',
      'Dicta Sunt Explicabo', 'Nemo Enim Ipsam', 'Voluptatem Quia Voluptas',
      'Sit Aspernatur Aut', 'Odit Aut Fugit Sed', 'Quia Consequuntur Magni',
      'Dolores Eos Qui', 'Ratione Voluptatem Sequi', 'Nesciunt Neque Porro',
      'Quisquam Est Qui', 'Dolorem Ipsum Quia', 'Dolor Sit Amet',
      'Consectetur Adipisci Velit', 'Sed Quia Non Numquam', 'Eius Modi Tempora',
      'Incidunt Ut Labore', 'Et Dolore Magnam', 'Aliquam Quaerat Voluptatem'
    ];

    const loremSummaries = [
      'Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor',
      'Incididunt ut labore et dolore', 'Magna aliqua ut enim', 'Ad minim veniam quis',
      'Nostrud exercitation ullamco', 'Laboris nisi ut aliquip', 'Ex ea commodo consequat',
      'Duis aute irure dolor', 'In reprehenderit in voluptate', 'Velit esse cillum dolore',
      'Eu fugiat nulla pariatur', 'Excepteur sint occaecat', 'Cupidatat non proident',
      'Sunt in culpa qui officia', 'Deserunt mollit anim id', 'Est laborum sed ut',
      'Perspiciatis unde omnis', 'Iste natus error sit', 'Voluptatem accusantium',
      'Doloremque laudantium totam', 'Rem aperiam eaque ipsa', 'Quae ab illo inventore',
      'Veritatis et quasi architecto', 'Beatae vitae dicta sunt', 'Explicabo nemo enim',
      'Ipsam voluptatem quia', 'Voluptas sit aspernatur', 'Aut odit aut fugit',
      'Sed quia consequuntur', 'Magni dolores eos qui', 'Ratione voluptatem sequi',
      'Nesciunt neque porro', 'Quisquam est qui dolorem', 'Ipsum quia dolor sit',
      'Amet consectetur adipisci', 'Velit sed quia non', 'Numquam eius modi tempora',
      'Incidunt ut labore et', 'Dolore magnam aliquam', 'Quaerat voluptatem ut enim'
    ];

    const loremDescriptions = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.',
      'Qui ratione voluptatem sequi nesciunt neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
      'Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.'
    ];

    const tags: ('Productdesign'|'DataViz'|'AI'|'Music'|'Writing')[] = ['Productdesign', 'DataViz', 'AI', 'Music', 'Writing'];
    const timePeriods: ('Early' | 'Mid' | 'Recent' | 'Current' | 'Future')[] = ['Early', 'Mid', 'Recent', 'Current', 'Future'];

    const newProjects: Project[] = [];
    
    for (let i = 0; i < 2000; i++) {
      const randomTitle = loremTitles[Math.floor(Math.random() * loremTitles.length)];
      const randomSummary = loremSummaries[Math.floor(Math.random() * loremSummaries.length)];
      const randomDescription = loremDescriptions[Math.floor(Math.random() * loremDescriptions.length)];
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      const randomTimePeriod = timePeriods[Math.floor(Math.random() * timePeriods.length)];
      
      newProjects.push({
        id: `lorem-project-${i}`,
        title: `${randomTitle} ${i + 1}`,
        summary: randomSummary,
        description: randomDescription,
        content: `${randomDescription} This is additional content for project ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        image: `/images/contracts-roles.svg`, // Use existing image as placeholder
        tags: [randomTag],
        timePeriod: randomTimePeriod,
        featured: false // None of the generated projects are featured
      });
    }
    
    setAdditionalProjects(newProjects);
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
    clearFocus,
    generateAdditionalProjects,
    hasAdditionalProjects: additionalProjects.length > 0
  } as const;
}
