'use client';
import { useTheme } from './ThemeProvider';

const themeIcons = {
  light: '☀️',
  dark: '🌙', 
  'high-contrast': '⚡'
};

const themeLabels = {
  light: 'Glass',
  dark: 'Retro',
  'high-contrast': 'Brutal'
};

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  return (
    <div className="pointer-events-auto fixed top-6 right-6 z-50 flex flex-col items-center gap-2">
      <button
        onClick={cycleTheme}
        className={`grid h-12 w-12 place-items-center rounded-full border-2 shadow-lg backdrop-blur transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-xl ${
          theme === 'dark'
            ? 'border-cyan-400/50 bg-gray-900/90 shadow-cyan-500/20 hover:border-cyan-400 hover:shadow-cyan-400/30'
            : theme === 'high-contrast'
            ? 'border-black bg-white shadow-black/20 hover:border-gray-800 hover:shadow-black/30'
            : 'border-gray-300 bg-white/90 shadow-gray-200 hover:border-gray-400 hover:shadow-gray-300'
        }`}
        style={{ 
          fontFamily: 'IBM Plex Sans, system-ui, sans-serif'
        }}
        aria-label={`Switch to ${themeLabels[theme]} theme`}
        title={`Current: ${themeLabels[theme]} theme - Click to cycle`}
      >
        <span className={`text-lg transition-all duration-300 ${
          theme === 'dark' ? 'text-cyan-300' : 
          theme === 'high-contrast' ? 'text-black' : 
          'text-gray-700'
        }`}>{themeIcons[theme]}</span>
      </button>
      <div className={`text-xs px-2 py-1 rounded-md backdrop-blur transition-all duration-300 ${
        theme === 'dark'
          ? 'text-gray-400 bg-gray-900/80 border border-gray-700'
          : theme === 'high-contrast'
          ? 'text-gray-600 bg-white/80 border border-gray-300'
          : 'text-gray-600 bg-white/80'
      }`}>
        Current: {themeLabels[theme]} theme
      </div>
    </div>
  );
}
