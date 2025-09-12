'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useProjects } from '@/hooks/useProjects';

const ProjectsContext = createContext<ReturnType<typeof useProjects> | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const projectsData = useProjects();
  return (
    <ProjectsContext.Provider value={projectsData}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjectsContext() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
}
