'use client';
import { useEffect, useState } from 'react';
import { useProjectsContext } from './ProjectsProvider';
import { useTheme } from './ThemeProvider';
import { intelligentSearch, getSearchSuggestions } from '@/services/intelligentSearch';

const TAGS = ['Productdesign', 'DataViz', 'AI', 'Music', 'Writing'] as const;
const LAYOUTS = [
  { id: 'flat-grid', name: 'Responsive', icon: '📋' },
  { id: 'staggered', name: 'Timeline', icon: '📊' },
  { id: 'sphere', name: 'Categories', icon: '🌐' },
  { id: 'spiral', name: 'Journey', icon: '🌀' },
  { id: 'grid', name: 'Skills', icon: '⊞' },
  { id: 'cube', name: 'Relations', icon: '🧊' }
] as const;

export default function Hud() {
  const { query, setQuery, tag, setTag, layout, setLayout, featuredProjects, focusedProject, focusProject, clearFocus, projects, generateAdditionalProjects, hasAdditionalProjects } = useProjectsContext();
  const { theme } = useTheme();
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Load search suggestions on mount
  useEffect(() => {
    setSearchSuggestions(getSearchSuggestions(projects));
  }, [projects]);

  // Handle intelligent search on Enter key
  const handleSearchSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      setIsSearching(true);
      
      try {
        const bestMatch = await intelligentSearch(query, projects);
        if (bestMatch) {
          // Focus on the best matching project
          focusProject(bestMatch);
          // Clear the search query
          setQuery('');
        }
      } catch (error) {
        console.error('Intelligent search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.getElementById('site-search') as HTMLInputElement | null;
        el?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Layout buttons at the top */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto mt-6 flex max-w-5xl justify-center px-4">
        <div className={`pointer-events-auto flex items-center gap-2 rounded-2xl border p-2 shadow-lg backdrop-blur transition-all duration-300 ${
          theme === 'dark' 
            ? 'border-cyan-400/30 bg-gray-900/90 shadow-cyan-500/20' 
            : theme === 'high-contrast'
            ? 'border-black bg-white shadow-black/20'
            : 'border-gray-300 bg-white/90'
        }`}>
          {LAYOUTS.map((layoutOption) => (
            <button
              key={layoutOption.id}
              onClick={() => setLayout(layoutOption.id as 'flat-grid' | 'staggered' | 'sphere' | 'spiral' | 'grid' | 'cube')}
              className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ease-out transform hover:scale-110 ${
                layout === layoutOption.id 
                  ? theme === 'dark'
                    ? 'border-cyan-400 bg-cyan-500/20 scale-110 shadow-lg shadow-cyan-400/30'
                    : theme === 'high-contrast'
                    ? 'border-black bg-black text-white scale-110 shadow-lg shadow-black/30'
                    : 'border-blue-500 bg-blue-50 scale-110 shadow-lg shadow-blue-200'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-800/80 hover:bg-gray-700 hover:border-gray-500'
                    : theme === 'high-contrast'
                    ? 'border-gray-400 bg-white/80 hover:bg-gray-100 hover:border-gray-600'
                    : 'border-gray-300 bg-white/80 hover:bg-gray-50 hover:border-gray-400'
              }`}
              style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}
              aria-label={`Switch to ${layoutOption.name} layout`}
              aria-pressed={layout === layoutOption.id}
              title={layoutOption.name}
            >
              <span className={`text-lg ${
                theme === 'dark' && layout === layoutOption.id ? 'text-cyan-300' :
                theme === 'high-contrast' && layout === layoutOption.id ? 'text-white' :
                theme === 'dark' ? 'text-gray-300' :
                theme === 'high-contrast' ? 'text-gray-800' :
                'text-gray-700'
              }`}>{layoutOption.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Infinity button in top left */}
      <div className="pointer-events-none fixed top-6 left-6 z-50">
        <button
          onClick={generateAdditionalProjects}
          className={`pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ease-out transform hover:scale-110 ${
            hasAdditionalProjects
              ? theme === 'dark'
                ? 'border-green-400 bg-green-500/20 scale-110 shadow-lg shadow-green-400/30'
                : theme === 'high-contrast'
                ? 'border-green-600 bg-green-100 scale-110 shadow-lg shadow-green-600/30'
                : 'border-green-500 bg-green-50 scale-110 shadow-lg shadow-green-200'
              : theme === 'dark'
                ? 'border-gray-600 bg-gray-800/80 hover:bg-gray-700 hover:border-gray-500'
                : theme === 'high-contrast'
                ? 'border-gray-400 bg-white/80 hover:bg-gray-100 hover:border-gray-600'
                : 'border-gray-300 bg-white/80 hover:bg-gray-50 hover:border-gray-400'
          }`}
          title={hasAdditionalProjects ? "2000+ projects loaded! System scalability demonstrated." : "Add 2000 lorem ipsum projects to showcase system scalability"}
          aria-label={hasAdditionalProjects ? "2000+ projects loaded" : "Add 2000 projects"}
        >
          <span className={`text-xl font-bold transition-all duration-300 ${
            hasAdditionalProjects
              ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            ∞
          </span>
        </button>
      </div>

      {/* Main controls at the bottom */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto mb-6 flex max-w-5xl justify-center px-4">
        <div className={`pointer-events-auto flex w-full items-center gap-3 rounded-2xl border p-3 shadow-lg backdrop-blur transition-all duration-300 ${
          theme === 'dark' 
            ? 'border-cyan-400/30 bg-gray-900/90 shadow-cyan-500/20' 
            : theme === 'high-contrast'
            ? 'border-black bg-white shadow-black/20'
            : 'border-gray-300 bg-white/90'
        }`}>
        <div className="relative flex-1">
        <input
          id="site-search"
          aria-label="Search projects"
          placeholder={isSearching ? "Searching..." : "Search projects… (Press Enter for intelligent search)"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
          disabled={isSearching}
          className={`flex-1 bg-transparent outline-none transition-colors duration-300 ${
            isSearching ? 'opacity-50' : ''
          } ${
            theme === 'dark' 
              ? 'placeholder:text-gray-400 text-gray-200' 
              : theme === 'high-contrast'
              ? 'placeholder:text-gray-500 text-gray-900'
              : 'placeholder:text-gray-500 text-gray-800'
          }`}
          style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}
        />
        
        {/* Search suggestions dropdown */}
        {query && !isSearching && searchSuggestions.length > 0 && (
          <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg backdrop-blur transition-all duration-300 ${
            theme === 'dark' 
              ? 'border-cyan-400/30 bg-gray-900/95 shadow-cyan-500/20' 
              : theme === 'high-contrast'
              ? 'border-black bg-white shadow-black/20'
              : 'border-gray-300 bg-white/95'
          }`}>
            <div className="p-2">
              <div className={`text-xs font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Try these searches:
              </div>
              {searchSuggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className={`w-full text-left px-2 py-1 rounded text-sm transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : theme === 'high-contrast'
                      ? 'hover:bg-gray-100 text-gray-900'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        </div>
        <div className="flex items-center gap-2">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? null : t)}
              className={`rounded-full border px-3 py-1 text-sm transition-all duration-300 ease-out transform hover:scale-105 ${
                tag === t 
                  ? theme === 'dark'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 scale-105 shadow-md shadow-cyan-400/30'
                    : theme === 'high-contrast'
                    ? 'border-black bg-black text-white scale-105 shadow-md shadow-black/30'
                    : 'border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-md shadow-blue-200'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-800/80 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                    : theme === 'high-contrast'
                    ? 'border-gray-400 bg-white/80 text-gray-800 hover:border-gray-600 hover:bg-gray-100'
                    : 'border-gray-300 bg-white/80 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
              style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}
              aria-pressed={tag === t}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="ml-2">
          <a href="#" aria-label="Ask Echo" className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ${
            theme === 'dark'
              ? 'border-gray-600 bg-gray-800/80 hover:bg-gray-700'
              : theme === 'high-contrast'
              ? 'border-gray-400 bg-white/80 hover:bg-gray-100'
              : 'border-gray-300 bg-white/80 hover:bg-gray-50'
          }`}>
            <img src="/echo.svg" alt="Echo" className={`h-5 w-5 transition-opacity duration-300 ${
              theme === 'dark' ? 'opacity-70' : 'opacity-80'
            }`} />
          </a>
        </div>
        </div>
      </div>

      {/* Keyboard controls hint */}
      <div className={`pointer-events-none absolute right-4 bottom-16 flex flex-col items-center gap-2 text-xs rounded-lg p-2 backdrop-blur transition-all duration-300 ${
        theme === 'dark'
          ? 'text-gray-400 bg-gray-900/80 border border-gray-700'
          : theme === 'high-contrast'
          ? 'text-gray-600 bg-white/80 border border-gray-300'
          : 'text-gray-600 bg-white/80'
      }`}>
        <div className="text-center">
          <div className="font-mono">WASD QE</div>
          <div className="font-mono">↑↓←→</div>
        </div>
        <div className="text-center">
          <div>Translate</div>
          <div>Rotate (2x/3x)</div>
        </div>
      </div>

      {/* Vertical focus buttons for featured projects */}
      <div className="pointer-events-auto absolute left-4 bottom-16 flex flex-col items-center gap-3">
        {featuredProjects.map((project) => {
          const isFocused = focusedProject?.id === project.id;
          const projectIcons = {
            'contracts-roles': '💼',
            'daiquery-notebooks': '📊', 
            'meta-data-viz': '📈',
            'myanalytics': '📋',
            'watson-design-guide': '🎨',
            'apple-accessibility': '♿'
          };
          const icon = projectIcons[project.id as keyof typeof projectIcons] || '📁';
          
          return (
            <button 
              key={project.id}
              onClick={() => isFocused ? clearFocus() : focusProject(project)}
              className={`group relative grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 ease-out transform hover:scale-110 ${
                isFocused 
                  ? theme === 'dark'
                    ? 'border-cyan-400 bg-cyan-500/20 scale-110 shadow-lg shadow-cyan-400/30'
                    : theme === 'high-contrast'
                    ? 'border-black bg-black scale-110 shadow-lg shadow-black/30'
                    : 'border-blue-500 bg-blue-50 scale-110 shadow-lg shadow-blue-200'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-800/80 hover:bg-gray-700 hover:border-gray-500'
                    : theme === 'high-contrast'
                    ? 'border-gray-400 bg-white/80 hover:bg-gray-100 hover:border-gray-600'
                    : 'border-gray-300 bg-white/80 hover:bg-gray-50 hover:border-gray-400'
              }`}
              style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}
              aria-label={`Focus on ${project.title}`}
              aria-pressed={isFocused}
              title={project.title}
            >
              <span className={`text-lg transition-all duration-300 ${
                isFocused 
                  ? theme === 'dark'
                    ? 'opacity-100 text-cyan-300'
                    : theme === 'high-contrast'
                    ? 'opacity-100 text-white'
                    : 'opacity-100 text-blue-700'
                  : theme === 'dark'
                    ? 'opacity-80 text-gray-300 group-hover:opacity-100'
                    : theme === 'high-contrast'
                    ? 'opacity-80 text-gray-800 group-hover:opacity-100'
                    : 'opacity-80 text-gray-700 group-hover:opacity-100'
              }`}>{icon}</span>
              
              {/* Hover tooltip */}
              <div className={`absolute left-12 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 ${
                theme === 'dark'
                  ? 'bg-gray-900 text-gray-100 border border-gray-700'
                  : theme === 'high-contrast'
                  ? 'bg-white text-gray-900 border border-gray-300'
                  : 'bg-white text-gray-900 border border-gray-200 shadow-lg'
              }`}>
                {project.title}
                <div className={`absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent ${
                  theme === 'dark' ? 'border-r-gray-900' : 'border-r-white'
                }`}></div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
