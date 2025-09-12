'use client';
import { useEffect } from 'react';
import { Project } from '@/data/projects';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/15 bg-glass p-8 shadow-glass">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10"
          aria-label="Close"
        >
          <span className="text-lg">×</span>
        </button>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold">{project.title}</h1>
              <p className="mt-2 text-xl text-white/70">{project.description}</p>
              <p className="mt-4 text-white/60">{project.summary}</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">About This Project</h2>
              <p className="leading-relaxed text-white/80">{project.content}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span>Time Period: {project.timePeriod}</span>
              {project.featured && (
                <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-yellow-400">
                  Featured
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="aspect-video overflow-hidden rounded-xl border border-white/15">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback to a gradient placeholder
                  e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.currentTarget.style.display = 'flex';
                  e.currentTarget.style.alignItems = 'center';
                  e.currentTarget.style.justifyContent = 'center';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.alt = '';
                  e.currentTarget.innerHTML = project.title;
                }}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Project Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Status:</span>
                  <span className="text-green-400">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Duration:</span>
                  <span>3-6 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Team Size:</span>
                  <span>1-3 people</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
