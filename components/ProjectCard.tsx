/**
 * ProjectCard - Enhanced 3D project card component with realistic materials and animations
 * 
 * Features:
 * - Advanced glass morphism with environment mapping
 * - Dynamic lighting and shadows
 * - Smooth hover animations and micro-interactions
 * - Floating animations and camera-aware rotation
 * - Enhanced visual hierarchy with size variations
 * - Particle effects and depth-based effects
 * 
 * Visual Elements:
 * - Main card: Multi-layered glass morphism background
 * - Project image: High-quality texture with proper mapping
 * - Title indicator: Enhanced typography with glow effects
 * - Tag indicator: Color-coded with metallic accents
 * - Featured border: Animated golden outline with particles
 * - Shadow: Dynamic shadow based on position
 */
'use client';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Project } from '@/data/projects';
import { useTheme } from './ThemeProvider';
import { getThemeColors } from './theme';

interface ProjectCardProps {
  project: Project;
  position: THREE.Vector3;
  onClick: (project: Project, position: THREE.Vector3) => void;
  onCenter?: (position: THREE.Vector3) => void;
  opacity: number;
}

export default function ProjectCard({ project, position, onClick, onCenter, opacity }: ProjectCardProps) {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const meshRef = useRef<THREE.Group>(null!);
  const cardRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [imageTexture, setImageTexture] = useState<THREE.Texture | null>(null);
  const [envMap, setEnvMap] = useState<THREE.CubeTexture | null>(null);
  const [titleTexture, setTitleTexture] = useState<THREE.Texture | null>(null);

  // Get fallback color for project
  const fallbackColor = useMemo(() => {
    const tagColors = {
      'Productdesign': '#667eea',
      'DataViz': '#f093fb', 
      'AI': '#4facfe',
      'Music': '#43e97b',
      'Writing': '#fa709a'
    };
    return tagColors[project.tags[0]] || '#667eea';
  }, [project.tags]);

  // Use simple plane geometry for now - rounded corners can be added later
  const cardGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(1.8, 1.2);
  }, []);

  // Load project image from local files
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const imagePath = `/images/${project.id}.svg`;
    
    console.log('Loading image for project:', project.title, 'Path:', imagePath);
    
    loader.load(
      imagePath,
      (texture) => {
        console.log('Successfully loaded texture for:', project.title);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        setImageTexture(texture);
      },
      undefined, // onProgress
      (error) => {
        console.warn('Failed to load texture for project:', project.title, 'Error:', error);
        // Fallback to colored background
        setImageTexture(null);
      }
    );
  }, [project.id, project.title]);

  // Create title texture
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 60;
    const ctx = canvas.getContext('2d')!;
    
    // Clear background
    ctx.clearRect(0, 0, 300, 60);
    
    // Add text
    ctx.fillStyle = theme === 'dark' ? '#FFFFFF' : theme === 'high-contrast' ? '#FFFFFF' : '#FFFFFF';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split title into lines if needed
    const words = project.title.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 280) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // Draw lines
    const lineHeight = 16;
    const startY = 30 - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 150, startY + index * lineHeight);
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    setTitleTexture(texture);
  }, [project.title, theme]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Clean, simple floating animation
      const t = clock.getElapsedTime();
      const floatY = Math.sin(t * 0.8 + position.x * 0.1) * 0.01;
      
      meshRef.current.position.y = position.y + floatY;
      meshRef.current.position.z = position.z;
    }

    // Clean hover animations
    if (cardRef.current) {
      const targetScale = hovered ? 1.05 : 1.0;
      cardRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const handleClick = () => {
    onClick(project, position);
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onCenter) {
      onCenter(position);
    }
  };

  const getCardColor = (index: number) => {
    return themeColors.cardBackground[index % themeColors.cardBackground.length];
  };

  const getProjectIcon = (project: Project) => {
    // Generate appropriate icons based on project content
    const iconMap: { [key: string]: string } = {
      'contracts-roles': 'pie-chart',
      'daiquery-notebooks': 'database',
      'meta-data-viz': 'chart-bar',
      'myanalytics-redesign': 'cog',
      'watson-design-guide': 'book',
      'apple-accessibility': 'apple',
      'workplace-analytics': 'users',
      'watson-analytics': 'brain',
      'teams-admin': 'settings',
      'researching-silence': 'bell-slash',
      'topic-keyword-analysis': 'search',
      'navigation-update': 'arrows',
      'trusted-news-ai': 'exclamation',
      'work-life-balance': 'moon',
      'spss-redesign': 'chart-line',
      'grad-data-viz': 'chart-pie',
      'guide-to-galaxy': 'planet',
      'vaporize-installation': 'lightbulb',
      'morphfaux-robot': 'robot',
      'architecture-projects': 'building'
    };
    return iconMap[project.id] || 'folder';
  };

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'Productdesign': '#5C6B3D', // Dark olive
      'DataViz': '#1A1A4A', // Deep navy
      'AI': '#7A2A2A', // Dark red
      'Music': '#2A4A2A', // Dark forest
      'Writing': '#6B6B6B' // Dark gray
    };
    return colors[tag] || '#6B6B6B'; // Gray fallback
  };

  const primaryTag = project.tags[0];
  const tagColor = getTagColor(primaryTag);
  
  // Calculate card size based on featured status - match current portfolio proportions
  const cardScale = project.featured ? 1.1 : 1.0;
  
  // Get card color based on project index for variety
  const cardColor = getCardColor(project.id.charCodeAt(0) % 5);

  const renderProjectIcon = (project: Project, opacity: number) => {
    const iconType = getProjectIcon(project);
    const iconOpacity = opacity * 0.8;
    
    // Simplified icons - just simple shapes without complex geometry
    switch (iconType) {
      case 'pie-chart':
        return (
          <mesh position={[0, 0.1, 0.001]}>
            <circleGeometry args={[0.2, 8]} />
              <meshBasicMaterial color={themeColors.textPrimary} transparent opacity={iconOpacity} side={THREE.DoubleSide} />
          </mesh>
        );
      case 'chart-bar':
        return (
          <mesh position={[0, 0.1, 0.001]}>
            <planeGeometry args={[0.3, 0.2]} />
              <meshBasicMaterial color={themeColors.textPrimary} transparent opacity={iconOpacity} side={THREE.DoubleSide} />
          </mesh>
        );
      case 'database':
        return (
          <mesh position={[0, 0.1, 0.001]}>
            <circleGeometry args={[0.15, 8]} />
              <meshBasicMaterial color={themeColors.textPrimary} transparent opacity={iconOpacity} side={THREE.DoubleSide} />
          </mesh>
        );
      case 'apple':
        return (
          <mesh position={[0, 0.1, 0.001]}>
            <circleGeometry args={[0.2, 8]} />
              <meshBasicMaterial color={themeColors.textPrimary} transparent opacity={iconOpacity} side={THREE.DoubleSide} />
          </mesh>
        );
      case 'bell-slash':
        return (
          <mesh position={[0, 0.1, 0.001]}>
            <circleGeometry args={[0.15, 8]} />
              <meshBasicMaterial color={themeColors.textPrimary} transparent opacity={iconOpacity} side={THREE.DoubleSide} />
          </mesh>
        );
      case 'exclamation':
        return (
          <mesh position={[0, 0.1, 0.001]}>
            <planeGeometry args={[0.1, 0.2]} />
              <meshBasicMaterial color={themeColors.textPrimary} transparent opacity={iconOpacity} side={THREE.DoubleSide} />
          </mesh>
        );
      case 'planet':
        return (
          <mesh position={[0, 0.1, 0.001]}>
            <circleGeometry args={[0.2, 8]} />
              <meshBasicMaterial color={themeColors.textPrimary} transparent opacity={iconOpacity} side={THREE.DoubleSide} />
          </mesh>
        );
      default:
        return (
          <mesh position={[0, 0.1, 0.001]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshBasicMaterial 
              color="#2A2A2A"
              transparent
              opacity={iconOpacity}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
    }
  };

  return (
    <group ref={meshRef} position={position} scale={[cardScale, cardScale, cardScale]}>
      {/* Main rounded card background - matching current portfolio style */}
      <mesh
        ref={cardRef}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <primitive object={cardGeometry} />
        <meshBasicMaterial 
          color={cardColor} 
          side={THREE.DoubleSide}
        />
      </mesh>


      {/* Project image - display actual loaded texture */}
      {imageTexture ? (
        <mesh position={[0, 0.1, 0.001]}>
          <planeGeometry args={[1.4, 0.8]} />
          <meshBasicMaterial 
            map={imageTexture}
            transparent
            opacity={opacity * 0.95}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : (
        // Fallback: Show a colored rectangle
        <mesh position={[0, 0.1, 0.001]}>
          <planeGeometry args={[1.4, 0.8]} />
          <meshBasicMaterial 
            color={fallbackColor}
            transparent
            opacity={opacity * 0.95}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Title text area - with actual readable text */}
      <mesh position={[0, -0.2, 0.002]}>
        <planeGeometry args={[1.7, 0.4]} />
        <meshBasicMaterial 
          color={theme === 'dark' ? '#1A1A1A' : theme === 'high-contrast' ? '#000000' : '#2A2A2A'}
          transparent
          opacity={opacity * 0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Title text content - rendered as texture */}
      <mesh position={[0, -0.2, 0.003]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshBasicMaterial 
          map={titleTexture}
          transparent
          opacity={opacity * 0.98}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}