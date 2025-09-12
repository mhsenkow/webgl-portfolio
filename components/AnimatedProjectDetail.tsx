'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Project } from '@/data/projects';

interface AnimatedProjectDetailProps {
  project: Project;
  onClose: () => void;
  cardPosition?: { x: number; y: number; z: number };
}

export default function AnimatedProjectDetail({ project, onClose, cardPosition }: AnimatedProjectDetailProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start the animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  const initialStyle = cardPosition ? {
    transform: `translate3d(${cardPosition.x * 50}px, ${cardPosition.y * 50}px, 0) scale(0.1)`,
    opacity: 0.1,
    borderRadius: '8px',
    transformOrigin: 'center center',
    width: '160px',
    height: '100px',
  } : {
    transform: 'translate3d(0, 0, 0) scale(0.1)',
    opacity: 0.1,
    borderRadius: '8px',
    transformOrigin: 'center center',
    width: '160px',
    height: '100px',
  };

  const finalStyle = {
    transform: 'translate3d(0, 0, 0) scale(1)',
    opacity: 1,
    borderRadius: '0px',
    transformOrigin: 'center center',
    width: '100vw',
    height: '100vh',
  };

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? 'backdrop-blur-md bg-black/60' : 'backdrop-blur-none bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="absolute inset-0 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative overflow-y-auto border border-white/20 bg-glass/90 shadow-glass backdrop-blur-xl ${
            isAnimating ? 'animate-cardExpandFullscreen' : 'opacity-100'
          }`}
          style={isAnimating ? initialStyle : finalStyle}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-8 top-8 grid h-16 w-16 place-items-center rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm z-10"
            aria-label="Close"
          >
            <span className="text-2xl font-light">×</span>
          </button>
          
          {/* Content */}
          <div className="h-full flex flex-col lg:flex-row">
            {/* Left side - Main content */}
            <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent leading-tight" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
                    {project.title}
                  </h1>
                  <p className="text-3xl lg:text-4xl text-white/80 font-light leading-relaxed" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>{project.description}</p>
                  <p className="text-xl lg:text-2xl text-white/60 italic" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>&ldquo;{project.summary}&rdquo;</p>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-3xl lg:text-4xl font-semibold text-white/90" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>About This Project</h2>
                  <p className="leading-relaxed text-white/80 text-xl lg:text-2xl max-w-4xl" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>{project.content}</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-lg font-medium backdrop-blur-sm"
                      style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-8 text-lg text-white/60">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                    <span style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>Time Period: {project.timePeriod}</span>
                  </div>
                  {project.featured && (
                    <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-yellow-400 font-medium text-lg" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side - Visual content */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-8">
              <div className="aspect-video overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.currentTarget.style.display = 'flex';
                    e.currentTarget.style.alignItems = 'center';
                    e.currentTarget.style.justifyContent = 'center';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.fontSize = '2rem';
                    e.currentTarget.style.fontWeight = 'bold';
                    e.currentTarget.alt = '';
                    e.currentTarget.innerHTML = project.title;
                  }}
                />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-semibold text-white/90" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>Project Details</h3>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/60" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>Status:</span>
                    <span className="text-green-400 font-medium" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>✓ Completed</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/60" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>Duration:</span>
                    <span className="text-white/80" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>3-6 months</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/60" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>Team Size:</span>
                    <span className="text-white/80" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>1-3 people</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-white/60" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>Category:</span>
                    <span className="text-white/80" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>{project.tags[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
