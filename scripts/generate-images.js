const fs = require('fs');
const path = require('path');

// Create a simple SVG-based image generator
function createProjectImage(projectId, project) {
    const tagColors = {
        'Productdesign': '#667eea',
        'DataViz': '#f093fb', 
        'AI': '#4facfe',
        'Music': '#43e97b',
        'Writing': '#fa709a'
    };

    const bgColor = tagColors[project.tag] || '#667eea';
    
    // Split title into lines
    const words = project.title.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        if (testLine.length > 40) {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);

    const svg = `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${bgColor}dd;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    
    <!-- Pattern overlay -->
    <defs>
        <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="rgba(255,255,255,0.1)"/>
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pattern)"/>
    
    <!-- Project icon -->
    <text x="200" y="120" font-family="Arial, sans-serif" font-size="48" fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="middle">${project.icon}</text>
    
    <!-- Project title -->
    ${lines.map((line, index) => {
        const y = 220 + (index - (lines.length - 1) / 2) * 20;
        return `<text x="200" y="${y}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="rgba(255,255,255,0.95)" text-anchor="middle" dominant-baseline="middle">${line}</text>`;
    }).join('')}
    
    <!-- Tag indicator -->
    <text x="200" y="270" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">${project.tag}</text>
</svg>`;

    return svg;
}

// Project data
const projectImages = {
    'contracts-roles': {
        title: 'A few contracts, and roles across design',
        tag: 'Productdesign',
        icon: '🎨'
    },
    'daiquery-notebooks': {
        title: 'Daiquery notebooks creation then merging with bento notebooks',
        tag: 'DataViz',
        icon: '📊'
    },
    'meta-data-viz': {
        title: 'Meta infra data viz framework and ai-infographics',
        tag: 'DataViz',
        icon: '📈'
    },
    'myanalytics-redesign': {
        title: 'Re-envisioning my primary product',
        tag: 'DataViz',
        icon: '📊'
    },
    'watson-design-guide': {
        title: 'The creation of a design guide used across thousands of users',
        tag: 'Productdesign',
        icon: '📚'
    },
    'apple-accessibility': {
        title: 'Apple; accessibility and app concepts',
        tag: 'Productdesign',
        icon: '🍎'
    },
    'workplace-analytics': {
        title: 'Workplace analytics: programs, analytics, and nudges',
        tag: 'DataViz',
        icon: '👥'
    },
    'watson-analytics': {
        title: 'Watson analytics early work',
        tag: 'AI',
        icon: '🧠'
    },
    'teams-admin': {
        title: 'Teams admin center',
        tag: 'Productdesign',
        icon: '⚙️'
    },
    'researching-silence': {
        title: 'Researching silence',
        tag: 'Productdesign',
        icon: '🔔'
    },
    'topic-keyword-analysis': {
        title: 'Topic keyword analysis redesigns',
        tag: 'DataViz',
        icon: '🔍'
    },
    'navigation-update': {
        title: 'Navigation update leads to better component system',
        tag: 'Productdesign',
        icon: '🧭'
    },
    'trusted-news-ai': {
        title: 'Trusted news ai chrome extension',
        tag: 'AI',
        icon: '🛡️'
    },
    'work-life-balance': {
        title: 'Improving your work life balance within Office 365',
        tag: 'Productdesign',
        icon: '⚖️'
    },
    'spss-redesign': {
        title: 'Redesign of SPSS modeler for modernization, brand connection, and interaction improvement',
        tag: 'DataViz',
        icon: '📊'
    },
    'grad-data-viz': {
        title: 'Grad school data visualization work',
        tag: 'DataViz',
        icon: '📈'
    },
    'guide-to-galaxy': {
        title: 'Guide to the galaxy, a mobile app concept',
        tag: 'Productdesign',
        icon: '🌌'
    },
    'vaporize-installation': {
        title: 'Vaporize: product design art installation',
        tag: 'Productdesign',
        icon: '💡'
    },
    'morphfaux-robot': {
        title: 'Morphfaux, KUKA robot plaster research',
        tag: 'Productdesign',
        icon: '🤖'
    },
    'architecture-projects': {
        title: 'Architecture graduate projects',
        tag: 'Productdesign',
        icon: '🏗️'
    }
};

// Create images directory
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate all images
Object.entries(projectImages).forEach(([projectId, project]) => {
    const svg = createProjectImage(projectId, project);
    const filePath = path.join(imagesDir, `${projectId}.svg`);
    fs.writeFileSync(filePath, svg);
    console.log(`Generated: ${projectId}.svg`);
});

console.log('All images generated successfully!');
