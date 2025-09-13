'use client';
import { pipeline } from '@xenova/transformers';
import { Project } from '@/data/projects';

// Cache the pipeline to avoid reloading
let searchPipeline: any = null;

// Initialize the search pipeline
async function initializeSearchPipeline() {
  if (!searchPipeline) {
    try {
      // Use a lightweight text classification model
      searchPipeline = await pipeline('text-classification', 'Xenova/distilbert-base-uncased');
    } catch (error) {
      console.error('Failed to initialize search pipeline:', error);
      return null;
    }
  }
  return searchPipeline;
}

// Define search categories and their keywords
const SEARCH_CATEGORIES = {
  'Productdesign': ['design', 'product', 'ui', 'ux', 'interface', 'user experience', 'design system', 'prototype', 'wireframe'],
  'DataViz': ['data', 'visualization', 'chart', 'graph', 'analytics', 'dashboard', 'metrics', 'statistics'],
  'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural', 'model', 'algorithm', 'intelligence'],
  'Music': ['music', 'audio', 'sound', 'song', 'composition', 'melody', 'rhythm', 'musical'],
  'Writing': ['writing', 'content', 'article', 'blog', 'text', 'copy', 'story', 'narrative', 'words']
};

const TIME_PERIODS = {
  'Early': ['early', 'beginning', 'first', 'start', 'old', 'past'],
  'Mid': ['mid', 'middle', 'intermediate', 'halfway'],
  'Recent': ['recent', 'latest', 'new', 'current', 'now'],
  'Current': ['current', 'present', 'ongoing', 'active', 'now'],
  'Future': ['future', 'upcoming', 'planned', 'next', 'soon']
};

// Simple keyword matching for fallback
function findBestMatchByKeywords(query: string, projects: Project[]): Project | null {
  const queryLower = query.toLowerCase();
  
  // Find projects that match category keywords
  const categoryMatches = projects.filter(project => {
    const categoryKeywords = SEARCH_CATEGORIES[project.tags[0] as keyof typeof SEARCH_CATEGORIES] || [];
    return categoryKeywords.some(keyword => queryLower.includes(keyword));
  });
  
  // Find projects that match time period keywords
  const timeMatches = projects.filter(project => {
    const timeKeywords = TIME_PERIODS[project.timePeriod as keyof typeof TIME_PERIODS] || [];
    return timeKeywords.some(keyword => queryLower.includes(keyword));
  });
  
  // Find projects that match title/summary keywords
  const contentMatches = projects.filter(project => {
    const searchText = `${project.title} ${project.summary} ${project.description}`.toLowerCase();
    return queryLower.split(' ').some(word => 
      word.length > 2 && searchText.includes(word)
    );
  });
  
  // Prioritize featured projects
  const featuredMatches = [...categoryMatches, ...timeMatches, ...contentMatches].filter(p => p.featured);
  
  if (featuredMatches.length > 0) {
    return featuredMatches[0];
  }
  
  // Return first match from any category
  return categoryMatches[0] || timeMatches[0] || contentMatches[0] || null;
}

// Enhanced search using Transformers.js for semantic understanding
async function findBestMatchWithAI(query: string, projects: Project[]): Promise<Project | null> {
  try {
    const pipeline = await initializeSearchPipeline();
    if (!pipeline) {
      // Fallback to keyword matching
      return findBestMatchByKeywords(query, projects);
    }
    
    // Create searchable text for each project
    const projectTexts = projects.map(project => ({
      project,
      text: `${project.title} ${project.summary} ${project.description} ${project.tags.join(' ')} ${project.timePeriod}`
    }));
    
    // For now, use keyword matching as the primary method
    // Transformers.js integration can be enhanced later with more sophisticated models
    return findBestMatchByKeywords(query, projects);
    
  } catch (error) {
    console.error('AI search failed, falling back to keyword matching:', error);
    return findBestMatchByKeywords(query, projects);
  }
}

// Main search function
export async function intelligentSearch(query: string, projects: Project[]): Promise<Project | null> {
  if (!query.trim()) {
    return null;
  }
  
  // For complex queries (longer than 3 words), use AI
  if (query.split(' ').length > 3) {
    return await findBestMatchWithAI(query, projects);
  }
  
  // For simple queries, use keyword matching
  return findBestMatchByKeywords(query, projects);
}

// Get search suggestions based on available projects
export function getSearchSuggestions(projects: Project[]): string[] {
  const suggestions: string[] = [];
  
  // Add category suggestions
  Object.keys(SEARCH_CATEGORIES).forEach(category => {
    const categoryProjects = projects.filter(p => p.tags.includes(category as any));
    if (categoryProjects.length > 0) {
      suggestions.push(`Show me ${category.toLowerCase()} projects`);
    }
  });
  
  // Add time period suggestions
  Object.keys(TIME_PERIODS).forEach(period => {
    const periodProjects = projects.filter(p => p.timePeriod === period);
    if (periodProjects.length > 0) {
      suggestions.push(`Show me ${period.toLowerCase()} work`);
    }
  });
  
  // Add featured project suggestions
  const featuredProjects = projects.filter(p => p.featured);
  if (featuredProjects.length > 0) {
    suggestions.push('Show me featured projects');
    suggestions.push('What are my best projects?');
  }
  
  return suggestions.slice(0, 5); // Limit to 5 suggestions
}
