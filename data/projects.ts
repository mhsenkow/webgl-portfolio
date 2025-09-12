/**
 * Project data structure for the 3D portfolio
 * Each project represents a work item displayed as a 3D card
 */
export type Project = {
  /** Unique identifier for the project */
  id: string;
  /** Display title shown on the card */
  title: string;
  /** Brief summary shown as subtitle */
  summary: string;
  /** Detailed description for the detail view */
  description: string;
  /** Full content for the expanded view */
  content: string;
  /** Image URL or API endpoint for project image */
  image: string;
  /** Array of category tags for filtering and positioning */
  tags: ('Productdesign'|'DataViz'|'AI'|'Music'|'Writing')[];
  /** Time period for temporal organization and camera focus */
  timePeriod: 'Early' | 'Mid' | 'Recent' | 'Current' | 'Future';
  /** Whether this project should be highlighted as featured */
  featured: boolean;
};

export const projects: Project[] = [
  // Featured/Highlights - Most impressive recent work
  { 
    id: 'contracts-roles', 
    title: 'A few contracts, and roles across design', 
    summary: 'Mars inc building a data suite basis', 
    description: 'Product Designer roles across start-ups, Windows Cloud, and Mars Data Suite',
    content: 'Collaborative work with founders, developers, and marketing across different teams. Skills used include Brand Development, UX/UI Design, Wireframing, Prototyping, Component System Development, AI-Notebook Interaction Model, and coding in React/CSS/visual front-end.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Mars Data Suite')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Current',
    featured: true
  },
  { 
    id: 'daiquery-notebooks', 
    title: 'Daiquery notebooks creation then merging with bento notebooks', 
    summary: 'Meta notebooks evolution', 
    description: 'Spearheaded the initial creation and development of Daquery notebooks at Meta',
    content: 'Created a series of merged SQL query cells designed to enhance data analysis workflows. This innovative approach allowed users to seamlessly run and visualize SQL queries within a single interface, significantly improving efficiency and usability. Worked closely with engineers to determine and implement functionality around grouped cells.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Daiquery Notebooks')}`,
    tags: ['DataViz', 'AI'], 
    timePeriod: 'Recent',
    featured: true
  },
  { 
    id: 'meta-data-viz', 
    title: 'Meta infra data viz framework and ai-infographics', 
    summary: 'Vega-powered visualization', 
    description: 'Led Data Visualization framework for Meta Infra using Vega',
    content: 'Created a comprehensive Data Visualization framework for Meta Infra, coding prototypes using Vega (open-source visualization grammar) to flesh out visual capabilities. Championed structured guidance in this area, overseeing visuals, documentation, and prototypes. Collaborated with front-end developers, PMs, and engineers to push for innovative solutions.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Meta Data Viz')}`,
    tags: ['DataViz'], 
    timePeriod: 'Recent',
    featured: true
  },
  { 
    id: 'myanalytics-redesign', 
    title: 'Re-envisioning my primary product', 
    summary: 'Design system implementation', 
    description: 'Primary Designer for MyAnalytics and Workplace Analytics interactions',
    content: 'Spearheaded design and implementation of improved design system utilized by MyAnalytics and Workplace Analytics. Conducted stakeholder interviews, performed internal research, and extensive visual design work. Led design efforts through various team changes, managing contractors and remote designers.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('MyAnalytics')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Mid',
    featured: true
  },
  { 
    id: 'watson-design-guide', 
    title: 'The creation of a design guide used across thousands of users', 
    summary: 'IBM Watson design system', 
    description: 'Comprehensive design guide for Watson Data Platform',
    content: 'Created comprehensive guide used across multiple products in IBM Watson Data Platform. Blended design, development, and asset management. Everything was built and coded collaboratively with dev lead while engaging in UX work with visual designers and Design Lead.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Watson Design Guide')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Early',
    featured: true
  },
  { 
    id: 'apple-accessibility', 
    title: 'Apple; accessibility and app concepts', 
    summary: 'IS&T UX internship', 
    description: 'Apple IS&T UX group internship focusing on accessibility',
    content: 'First professional UX experience with Apple IS&T UX group, focusing on internal software development. Primary focus on Accessibility—a passion that continues to influence design work today. Apple design philosophy characterized by meticulous attention to detail and seamless user experience.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Apple Accessibility')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Early',
    featured: true
  },

  // Supporting work - Important but not featured
  { 
    id: 'workplace-analytics', 
    title: 'Workplace analytics: programs, analytics, and nudges', 
    summary: 'Microsoft analytics platform', 
    description: 'Comprehensive workplace analytics and behavioral nudges',
    content: 'Worked on Microsoft Workplace Analytics platform focusing on programs, analytics, and behavioral nudges. Background in engineering and information science significantly contributed to data visualization work. Utilized UX and visual design, coded and Figma prototyping, and conducted stakeholder interviews.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Workplace Analytics')}`,
    tags: ['DataViz'], 
    timePeriod: 'Early',
    featured: false
  },
  { 
    id: 'watson-analytics', 
    title: 'Watson analytics early work', 
    summary: 'AI-powered analytics foundation', 
    description: 'Early research and prototyping for Watson Analytics',
    content: 'Conducted research for what would eventually grow into Watson Analytics. Created numerous prototypes to help sell the concept of social media analytics. Developed blue-sky concepts for the future of AI-powered dashboards, showcasing potential of AI to transform data visualization.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Watson Analytics')}`,
    tags: ['AI', 'DataViz'], 
    timePeriod: 'Early',
    featured: false
  },
  { 
    id: 'teams-admin', 
    title: 'Teams admin center', 
    summary: 'Back-end tooling concepts', 
    description: 'Microsoft Teams admin center dashboard and tooling concepts',
    content: 'Worked on wireframes and concepts about back-end tooling that makes public-facing communications tools work. Focused on dashboard design, parameter alteration, and basic video/camera tooling concepts for Microsoft Teams administration.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Teams Admin')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Mid',
    featured: false
  },
  { 
    id: 'researching-silence', 
    title: 'Researching silence', 
    summary: 'Focus time concepts', 
    description: 'Developing Silence Mode for Office suite',
    content: 'Collaborative study focused on developing a Silence Mode for the Office suite. Visited 8 clients in London and Paris, iterating on designs based on real-time feedback. The project concluded with a comprehensive proposal that evolved into current focus time concepts within Office.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Researching Silence')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Mid',
    featured: false
  },
  { 
    id: 'topic-keyword-analysis', 
    title: 'Topic keyword analysis redesigns', 
    summary: 'Workplace Analytics transformation', 
    description: 'Redesigned topic keyword analysis section of Workplace Analytics',
    content: 'Took over a struggling initiative and transformed it into a success. Initially joined as design lead, provided direction to a contractor, then took over redesign efforts as project parameters changed. This work coincided with expansion of the design system and provided space to view it in practice.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Topic Analysis')}`,
    tags: ['DataViz'], 
    timePeriod: 'Mid',
    featured: false
  },
  { 
    id: 'navigation-update', 
    title: 'Navigation update leads to better component system', 
    summary: 'Design system evolution', 
    description: 'Navigation update that led to improved component system',
    content: 'Became de-facto Design Lead for Seattle group after main design lead quit. Managed contractors and remote FTE designers, ensuring alignment with group work. Responsible for comparison analysis, UX wireframing design and layout, and coding prototypes.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Navigation Update')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Mid',
    featured: false
  },
  { 
    id: 'trusted-news-ai', 
    title: 'Trusted news ai chrome extension', 
    summary: 'AI-powered news verification', 
    description: 'Chrome extension for AI-powered news verification',
    content: 'Developed Chrome extension focused on AI-powered news verification and trust indicators. Worked on user interface design, AI integration, and browser extension functionality to help users identify reliable news sources.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Trusted News AI')}`,
    tags: ['AI'], 
    timePeriod: 'Mid',
    featured: false
  },
  { 
    id: 'work-life-balance', 
    title: 'Improving your work life balance within Office 365', 
    summary: 'Office 365 wellness features', 
    description: 'Work-life balance features within Office 365',
    content: 'Designed features to improve work-life balance within Office 365 ecosystem. Focused on wellness, productivity, and user wellbeing through thoughtful interface design and behavioral insights.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Work Life Balance')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Early',
    featured: false
  },
  { 
    id: 'spss-redesign', 
    title: 'Redesign of SPSS modeler for modernization, brand connection, and interaction improvement', 
    summary: 'IBM SPSS modernization', 
    description: 'Complete redesign of SPSS Modeler interface',
    content: 'Led redesign of IBM SPSS Modeler focusing on modernization, brand connection, and interaction improvement. Updated the interface to be more intuitive and aligned with modern design principles while maintaining powerful analytical capabilities.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('SPSS Redesign')}`,
    tags: ['DataViz'], 
    timePeriod: 'Early',
    featured: false
  },

  // Academic/Early work - Foundation projects
  { 
    id: 'grad-data-viz', 
    title: 'Grad school data visualization work', 
    summary: 'University of Michigan experiments', 
    description: 'Early data visualization experiments at University of Michigan',
    content: 'Earliest portfolio-kept work on data-visualization projects during University of Michigan. Experimental classwork projects that were initial sparks igniting interest in data visualization field. Created innovative visualizations using Processing and D3.js.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Grad Data Viz')}`,
    tags: ['DataViz'], 
    timePeriod: 'Early',
    featured: false
  },
  { 
    id: 'guide-to-galaxy', 
    title: 'Guide to the galaxy, a mobile app concept', 
    summary: 'Adler Planetarium app', 
    description: 'Mobile app concept for Adler Planetarium',
    content: 'Volunteer program through School of Information at Adler Planetarium in Chicago. Created mobile app concept called Guide to the Galaxy, providing users with accurate understanding of solar system size in relation to planetarium. Android application allowing users to walk through solar system.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Guide to Galaxy')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Early',
    featured: false
  },
  { 
    id: 'vaporize-installation', 
    title: 'Vaporize: product design art installation', 
    summary: 'Glow Workshop installation', 
    description: 'Physical interaction design art installation',
    content: 'Designed as part of Glow Workshop led by Cathlyn Newell. Created final project in downtown Flint shop space based on concept of Glow. One of first projects toeing line of physical interaction design, exploring how objects can directly shape users connection to space.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Vaporize')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Early',
    featured: false
  },
  { 
    id: 'morphfaux-robot', 
    title: 'Morphfaux, KUKA robot plaster research', 
    summary: 'Architecture fabrication research', 
    description: 'KUKA robot plaster research with Joshua Bard',
    content: 'Aided Joshua Bard, professor at University of Michigan Architecture school (now Carnegie Mellon). Morphfaux project explored methods in which plaster could be enhanced through modern fabrication techniques. Primary input through attempted scripting and machine control of moving head for KUKA robot.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Morphfaux Robot')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Early',
    featured: false
  },
  { 
    id: 'architecture-projects', 
    title: 'Architecture graduate projects', 
    summary: 'Taubman Architecture coursework', 
    description: 'Various architecture course projects',
    content: 'Collection of architecture course projects from Taubman Architecture program. Advanced graphic design, 3D modeling, rendering, and various modeling work demonstrating architectural design principles and visualization techniques.',
    image: `/api/placeholder?width=400&height=300&text=${encodeURIComponent('Architecture Projects')}`,
    tags: ['Productdesign'], 
    timePeriod: 'Early',
    featured: false
  },
];