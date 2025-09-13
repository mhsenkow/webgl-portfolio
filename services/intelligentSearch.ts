'use client';
import { Project } from '@/data/projects';

// Define search categories and their keywords
const SEARCH_CATEGORIES = {
  'Productdesign': ['design', 'product', 'ui', 'ux', 'interface', 'user experience', 'design system', 'prototype', 'wireframe', 'visual', 'layout', 'component'],
  'DataViz': ['data', 'visualization', 'chart', 'graph', 'analytics', 'dashboard', 'metrics', 'statistics', 'chart', 'plot', 'infographic'],
  'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural', 'model', 'algorithm', 'intelligence', 'automation', 'smart'],
  'Music': ['music', 'audio', 'sound', 'song', 'composition', 'melody', 'rhythm', 'musical', 'audio', 'soundtrack', 'beat'],
  'Writing': ['writing', 'content', 'article', 'blog', 'text', 'copy', 'story', 'narrative', 'words', 'documentation', 'copywriting']
};

const TIME_PERIODS = {
  'Early': ['early', 'beginning', 'first', 'start', 'old', 'past', 'initial', 'original'],
  'Mid': ['mid', 'middle', 'intermediate', 'halfway', 'midway'],
  'Recent': ['recent', 'latest', 'new', 'current', 'now', 'fresh', 'updated'],
  'Current': ['current', 'present', 'ongoing', 'active', 'now', 'live', 'working'],
  'Future': ['future', 'upcoming', 'planned', 'next', 'soon', 'forthcoming', 'proposed']
};

// Enhanced keyword matching with better scoring
function findBestMatchByKeywords(query: string, projects: Project[]): Project | null {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(' ').filter(word => word.length > 2);
  
  let bestMatch: Project | null = null;
  let bestScore = 0;
  
  projects.forEach(project => {
    let score = 0;
    
    // Category matching (highest priority)
    const categoryKeywords = SEARCH_CATEGORIES[project.tags[0] as keyof typeof SEARCH_CATEGORIES] || [];
    const categoryMatches = queryWords.filter(word => 
      categoryKeywords.some(keyword => keyword.includes(word) || word.includes(keyword))
    ).length;
    score += categoryMatches * 10;
    
    // Time period matching
    const timeKeywords = TIME_PERIODS[project.timePeriod as keyof typeof TIME_PERIODS] || [];
    const timeMatches = queryWords.filter(word => 
      timeKeywords.some(keyword => keyword.includes(word) || word.includes(keyword))
    ).length;
    score += timeMatches * 8;
    
    // Title matching
    const titleMatches = queryWords.filter(word => 
      project.title.toLowerCase().includes(word)
    ).length;
    score += titleMatches * 5;
    
    // Summary matching
    const summaryMatches = queryWords.filter(word => 
      project.summary.toLowerCase().includes(word)
    ).length;
    score += summaryMatches * 3;
    
    // Featured projects get bonus
    if (project.featured) {
      score += 5;
    }
    
    // Update best match
    if (score > bestScore) {
      bestScore = score;
      bestMatch = project;
    }
  });
  
  return bestMatch;
}

// Main search function
export async function intelligentSearch(query: string, projects: Project[]): Promise<Project | null> {
  if (!query.trim()) {
    return null;
  }
  
  // Use enhanced keyword matching
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
