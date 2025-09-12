#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Project images mapping based on your portfolio
const projectImages = {
  'contracts-roles': {
    url: 'https://www.mhsenkow.work/images/contracts-roles.png',
    description: 'A few contracts, and roles across design - abstract shapes'
  },
  'daiquery-notebooks': {
    url: 'https://www.mhsenkow.work/images/daiquery-notebooks.png', 
    description: 'Daiquery notebooks - SQL/data visualization icons'
  },
  'meta-data-viz': {
    url: 'https://www.mhsenkow.work/images/meta-data-viz.png',
    description: 'Meta infra data viz framework - pie chart and visualization elements'
  },
  'myanalytics-redesign': {
    url: 'https://www.mhsenkow.work/images/myanalytics-redesign.png',
    description: 'Re-envisioning my primary product - analytics dashboard elements'
  },
  'watson-design-guide': {
    url: 'https://www.mhsenkow.work/images/watson-design-guide.png',
    description: 'Design guide creation - component system elements'
  },
  'apple-accessibility': {
    url: 'https://www.mhsenkow.work/images/apple-accessibility.png',
    description: 'Apple accessibility - Apple logo and accessibility icons'
  },
  'workplace-analytics': {
    url: 'https://www.mhsenkow.work/images/workplace-analytics.png',
    description: 'Workplace analytics - people icons and analytics elements'
  },
  'watson-analytics': {
    url: 'https://www.mhsenkow.work/images/watson-analytics.png',
    description: 'Watson analytics early work - AI/brain icons'
  },
  'teams-admin': {
    url: 'https://www.mhsenkow.work/images/teams-admin.png',
    description: 'Teams admin center - settings/admin icons'
  },
  'researching-silence': {
    url: 'https://www.mhsenkow.work/images/researching-silence.png',
    description: 'Researching silence - bell with slash icon'
  },
  'topic-keyword-analysis': {
    url: 'https://www.mhsenkow.work/images/topic-keyword-analysis.png',
    description: 'Topic keyword analysis - text analysis elements'
  },
  'navigation-update': {
    url: 'https://www.mhsenkow.work/images/navigation-update.png',
    description: 'Navigation update - navigation/component elements'
  },
  'trusted-news-ai': {
    url: 'https://www.mhsenkow.work/images/trusted-news-ai.png',
    description: 'Trusted news AI - shield/security icons'
  },
  'work-life-balance': {
    url: 'https://www.mhsenkow.work/images/work-life-balance.png',
    description: 'Work life balance - balance/wellness icons'
  },
  'spss-redesign': {
    url: 'https://www.mhsenkow.work/images/spss-redesign.png',
    description: 'SPSS redesign - statistical analysis elements'
  },
  'grad-data-viz': {
    url: 'https://www.mhsenkow.work/images/grad-data-viz.png',
    description: 'Grad school data viz - visualization elements'
  },
  'guide-to-galaxy': {
    url: 'https://www.mhsenkow.work/images/guide-to-galaxy.png',
    description: 'Guide to the galaxy - space/planetarium elements'
  },
  'vaporize-installation': {
    url: 'https://www.mhsenkow.work/images/vaporize-installation.png',
    description: 'Vaporize installation - wireframe/technical elements'
  },
  'morphfaux-robot': {
    url: 'https://www.mhsenkow.work/images/morphfaux-robot.png',
    description: 'Morphfaux robot - technical diagram elements'
  },
  'architecture-projects': {
    url: 'https://www.mhsenkow.work/images/architecture-projects.png',
    description: 'Architecture projects - architectural elements'
  }
};

// Create images directory
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(imagesDir, filename));
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
      } else {
        console.log(`Failed to download ${url}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`Error downloading ${url}:`, err.message);
      reject(err);
    });
  });
}

// Since we can't actually download from the live site, let's create placeholder images
// that match the style described in your portfolio
async function createPlaceholderImages() {
  console.log('Creating placeholder images that match your portfolio style...');
  
  const { createCanvas } = require('canvas');
  
  for (const [projectId, info] of Object.entries(projectImages)) {
    const canvas = createCanvas(400, 300);
    const ctx = canvas.getContext('2d');
    
    // Create background based on project type
    const tagColors = {
      'Productdesign': '#667eea',
      'DataViz': '#f093fb', 
      'AI': '#4facfe',
      'Music': '#43e97b',
      'Writing': '#fa709a'
    };
    
    // Get project data to determine color
    const projects = require('../data/projects.ts');
    const project = projects.projects.find(p => p.id === projectId);
    const primaryTag = project?.tags[0] || 'Productdesign';
    const bgColor = tagColors[primaryTag] || '#667eea';
    
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 400, 300);
    
    // Add project-specific visual elements based on description
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Create project-specific icons/visuals
    if (info.description.includes('pie chart')) {
      // Draw pie chart
      ctx.beginPath();
      ctx.arc(200, 120, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(200, 120, 30, 0, Math.PI * 1.5);
      ctx.fill();
    } else if (info.description.includes('Apple logo')) {
      // Draw Apple-like logo
      ctx.font = 'bold 48px Arial';
      ctx.fillText('🍎', 200, 120);
    } else if (info.description.includes('bell')) {
      // Draw bell with slash
      ctx.font = 'bold 48px Arial';
      ctx.fillText('🔔', 200, 120);
    } else if (info.description.includes('shield')) {
      // Draw shield
      ctx.font = 'bold 48px Arial';
      ctx.fillText('🛡️', 200, 120);
    } else if (info.description.includes('people')) {
      // Draw people icons
      ctx.font = 'bold 48px Arial';
      ctx.fillText('👥', 200, 120);
    } else if (info.description.includes('settings')) {
      // Draw settings icon
      ctx.font = 'bold 48px Arial';
      ctx.fillText('⚙️', 200, 120);
    } else if (info.description.includes('AI') || info.description.includes('brain')) {
      // Draw AI/brain icon
      ctx.font = 'bold 48px Arial';
      ctx.fillText('🧠', 200, 120);
    } else if (info.description.includes('space') || info.description.includes('galaxy')) {
      // Draw space elements
      ctx.font = 'bold 48px Arial';
      ctx.fillText('🌌', 200, 120);
    } else if (info.description.includes('wireframe') || info.description.includes('technical')) {
      // Draw technical elements
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      // Draw simple wireframe
      ctx.beginPath();
      ctx.moveTo(150, 100);
      ctx.lineTo(250, 100);
      ctx.lineTo(250, 140);
      ctx.lineTo(150, 140);
      ctx.closePath();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(150, 100);
      ctx.lineTo(200, 80);
      ctx.lineTo(250, 100);
      ctx.stroke();
    } else {
      // Default icon based on project type
      const iconMap = {
        'Productdesign': '🎨',
        'DataViz': '📊',
        'AI': '🤖',
        'Music': '🎵',
        'Writing': '✍️'
      };
      ctx.font = 'bold 48px Arial';
      ctx.fillText(iconMap[primaryTag] || '📁', 200, 120);
    }
    
    // Add project title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'bold 16px Arial, sans-serif';
    
    // Split title into lines
    const words = project?.title.split(' ') || [projectId];
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 350) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // Draw title lines
    const lineHeight = 20;
    const startY = 220 - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 200, startY + index * lineHeight);
    });
    
    // Save image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(imagesDir, `${projectId}.png`), buffer);
    console.log(`Created: ${projectId}.png`);
  }
}

// Run the script
createPlaceholderImages().catch(console.error);
