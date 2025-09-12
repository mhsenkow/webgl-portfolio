export type Theme = 'light' | 'dark' | 'high-contrast';

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  
  // Card colors
  cardBackground: string[];
  cardBorder: string;
  cardShadow: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // UI element colors
  uiBackground: string;
  uiBorder: string;
  uiHover: string;
  uiActive: string;
  
  // Accent colors
  accent: string;
  accentHover: string;
  
  // Particle colors
  particles: number[][];
  
  // Special effects
  glassOpacity: number;
  blurAmount: string;
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    // Microsoft Glass theme
    background: '#F5F8F5',
    backgroundSecondary: '#E8F0E8',
    
    cardBackground: [
      '#8FA68A', // Soft olive green
      '#4A6FA5', // Soft navy blue  
      '#8B8B8B', // Soft gray
      '#B85C5C', // Soft reddish-brown
      '#6B9B6B', // Soft forest green
    ],
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    
    textPrimary: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textMuted: '#8A8A8A',
    
    uiBackground: 'rgba(255, 255, 255, 0.8)',
    uiBorder: 'rgba(0, 0, 0, 0.1)',
    uiHover: 'rgba(0, 0, 0, 0.05)',
    uiActive: 'rgba(59, 130, 246, 0.1)',
    
    accent: '#3B82F6',
    accentHover: '#2563EB',
    
    particles: [
      [0.3, 0.4, 0.5], // Soft blue-gray
      [0.4, 0.4, 0.4], // Soft gray
      [0.5, 0.4, 0.3], // Soft brown
      [0.3, 0.5, 0.4], // Soft green
      [0.5, 0.3, 0.4], // Soft purple
    ],
    
    glassOpacity: 0.8,
    blurAmount: '10px',
  },
  
  dark: {
    // 80s Retro theme
    background: '#0A0A0F',
    backgroundSecondary: '#1A1A2E',
    
    cardBackground: [
      '#FF6B6B', // Neon pink
      '#4ECDC4', // Neon teal
      '#45B7D1', // Neon blue
      '#96CEB4', // Neon mint
      '#FFEAA7', // Neon yellow
    ],
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    cardShadow: 'rgba(0, 0, 0, 0.5)',
    
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textMuted: '#A0A0A0',
    
    uiBackground: 'rgba(26, 26, 46, 0.9)',
    uiBorder: 'rgba(255, 255, 255, 0.2)',
    uiHover: 'rgba(255, 255, 255, 0.1)',
    uiActive: 'rgba(78, 205, 196, 0.2)',
    
    accent: '#4ECDC4',
    accentHover: '#3BB5B0',
    
    particles: [
      [1.0, 0.2, 0.8], // Neon pink
      [0.2, 0.8, 1.0], // Neon cyan
      [0.8, 1.0, 0.2], // Neon lime
      [1.0, 0.6, 0.0], // Neon orange
      [0.6, 0.2, 1.0], // Neon purple
    ],
    
    glassOpacity: 0.9,
    blurAmount: '15px',
  },
  
  'high-contrast': {
    // Brutalist theme
    background: '#FFFFFF',
    backgroundSecondary: '#F0F0F0',
    
    cardBackground: [
      '#000000', // Pure black
      '#FF0000', // Pure red
      '#00FF00', // Pure green
      '#0000FF', // Pure blue
      '#FFFF00', // Pure yellow
    ],
    cardBorder: '#000000',
    cardShadow: 'rgba(0, 0, 0, 0.8)',
    
    textPrimary: '#000000',
    textSecondary: '#000000',
    textMuted: '#666666',
    
    uiBackground: '#FFFFFF',
    uiBorder: '#000000',
    uiHover: '#000000',
    uiActive: '#FF0000',
    
    accent: '#FF0000',
    accentHover: '#CC0000',
    
    particles: [
      [0.0, 0.0, 0.0], // Black
      [1.0, 0.0, 0.0], // Red
      [0.0, 1.0, 0.0], // Green
      [0.0, 0.0, 1.0], // Blue
      [1.0, 1.0, 0.0], // Yellow
    ],
    
    glassOpacity: 1.0,
    blurAmount: '0px',
  },
};

export const getThemeColors = (theme: Theme): ThemeColors => {
  return themes[theme];
};
