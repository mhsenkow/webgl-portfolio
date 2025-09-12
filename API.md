# API Documentation

## Components API

### CardCloud

Manages the 3D cloud of project cards with dynamic positioning and filtering.

#### Props
```typescript
interface CardCloudProps {
  /** Callback when a card is clicked */
  onCardClick: (project: Project, position: { x: number; y: number; z: number }) => void;
  /** Current time period filter */
  timePeriod?: string | null;
  /** Whether detail view is open (affects card opacity) */
  isDetailOpen?: boolean;
  /** Search query for filtering */
  query?: string;
  /** Tag filter for filtering */
  tag?: string | null;
}
```

#### Features
- **Dynamic Positioning**: Cards positioned based on time period (X) and category (Y)
- **Smooth Interpolation**: Uses LERP for smooth position transitions
- **Visibility Filtering**: Reduces opacity of non-matching cards instead of hiding them
- **Glass Morphism**: All cards feature modern glass morphism effects

### ProjectCard

Individual 3D project card component with glass morphism and project-specific content.

#### Props
```typescript
interface ProjectCardProps {
  /** Project data to display */
  project: Project;
  /** 3D position in the scene */
  position: THREE.Vector3;
  /** Click handler */
  onClick: () => void;
  /** Opacity multiplier for filtering effects */
  opacity: number;
}
```

#### Visual Elements
- **Main Card**: Glass morphism background with transparency
- **Project Image**: Loaded via THREE.TextureLoader from project.image
- **Title Indicator**: Subtle dark bar showing project title
- **Tag Indicator**: Color-coded bar based on primary tag
- **Featured Border**: Golden outline for featured projects

### CameraController

Manages cinematic camera movements for time period focus.

#### Props
```typescript
interface CameraControllerProps {
  /** Current selected time period for camera focus */
  timePeriod: string | null;
}
```

#### Features
- **Smooth Transitions**: Camera smoothly moves to focus on selected time period
- **Zoom Level Respect**: Maintains user's current zoom level during transitions
- **Non-Conflicting**: Works alongside manual controls without interference
- **Automatic Completion**: Detects when transitions are complete

### KeyboardControls

Handles WASD and arrow key camera movement.

#### Features
- **WASD Keys**: Standard FPS-style movement controls
- **Arrow Keys**: Alternative movement controls
- **Transition-Aware**: Automatically disabled during camera transitions
- **Smooth Movement**: Frame-rate independent movement

### AnimatedProjectDetail

Fullscreen project detail view with smooth expansion animation.

#### Props
```typescript
interface AnimatedProjectDetailProps {
  /** Project data to display */
  project: Project;
  /** Position of the clicked card for animation origin */
  cardPosition?: { x: number; y: number; z: number };
  /** Close handler */
  onClose: () => void;
}
```

#### Animation Features
- **Card Expansion**: Grows from card position to fullscreen
- **Physics-Based**: Uses cubic-bezier easing for natural feel
- **Smooth Transitions**: 700ms duration with custom easing
- **Responsive Layout**: Adapts to different screen sizes

## Data Types

### Project

```typescript
type Project = {
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
```

### Time Periods

- **Early**: Initial projects and experiments
- **Mid**: Development and iteration phase
- **Recent**: Recently completed work
- **Current**: Currently active projects
- **Future**: Planned and upcoming projects

### Categories

- **Productdesign**: UI/UX design and product development
- **DataViz**: Data visualization and analytics
- **AI**: Artificial intelligence and machine learning
- **Music**: Audio and musical projects
- **Writing**: Content creation and documentation

## Context API

### ProjectsProvider

Global state management for projects and UI state.

#### Context Value
```typescript
interface ProjectsContextType {
  /** Current time period filter */
  timePeriod: string | null;
  /** Set time period filter */
  setTimePeriod: (period: string | null) => void;
  /** Currently selected project */
  selectedProject: Project | null;
  /** Set selected project */
  setSelectedProject: (project: Project | null) => void;
  /** Position of clicked card */
  cardPosition: { x: number; y: number; z: number } | null;
  /** Set card position */
  setCardPosition: (position: { x: number; y: number; z: number } | null) => void;
  /** Search query */
  query: string;
  /** Set search query */
  setQuery: (query: string) => void;
  /** Selected tag filter */
  tag: string | null;
  /** Set tag filter */
  setTag: (tag: string | null) => void;
}
```

### CameraTransitionProvider

Manages camera transition state to coordinate between components.

#### Context Value
```typescript
interface CameraTransitionContextType {
  /** Whether camera is currently transitioning */
  isTransitioning: boolean;
  /** Set transition state */
  setIsTransitioning: (transitioning: boolean) => void;
}
```

## Styling

### CSS Classes

#### Glass Morphism
```css
.bg-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

#### Animations
```css
@keyframes cardExpandFullscreen {
  0% { transform: scale(0.1) rotateX(15deg); opacity: 0.1; }
  30% { transform: scale(0.3) rotateX(5deg); opacity: 0.3; }
  70% { transform: scale(1.1) rotateX(0deg); opacity: 0.8; }
  100% { transform: scale(1) rotateX(0deg); opacity: 1; }
}
```

## Performance Considerations

### Optimization Strategies
- **React.memo**: Prevents unnecessary re-renders
- **useMemo**: Memoizes expensive calculations
- **useCallback**: Memoizes event handlers
- **Ref Management**: Uses refs for 3D objects to avoid re-creation
- **LERP Interpolation**: Smooth animations without frame drops

### 3D Rendering
- **Instanced Rendering**: Efficient rendering of multiple similar objects
- **Material Reuse**: Shared materials across similar objects
- **Texture Caching**: THREE.TextureLoader caches loaded textures
- **Frame Rate Independence**: All animations use delta time

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **WebGL Support**: Requires WebGL 1.0 or 2.0
- **ES2020**: Uses modern JavaScript features
- **CSS Grid/Flexbox**: Modern CSS layout features
