# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Modern browser with WebGL support

### Setup
```bash
git clone <repository-url>
cd portfolio-webgl
npm install
npm run dev
```

## Project Structure

```
portfolio-webgl/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main portfolio page
├── components/            # React components
│   ├── AnimatedProjectDetail.tsx  # Fullscreen project view
│   ├── CardCloud.tsx              # 3D card cloud manager
│   ├── CameraController.tsx       # Cinematic camera system
│   ├── CameraTransitionProvider.tsx # Camera state management
│   ├── Hud.tsx                    # UI overlay
│   ├── KeyboardControls.tsx       # WASD controls
│   ├── Particles.tsx              # Background particles
│   ├── ProjectCard.tsx            # Individual 3D card
│   └── ProjectsProvider.tsx       # Global state
├── data/                  # Data layer
│   └── projects.ts       # Project data and types
├── hooks/                 # Custom React hooks
│   └── useProjects.ts    # Project management hook
└── public/               # Static assets
```

## Key Concepts

### 3D Scene Management
The portfolio uses React Three Fiber (R3F) for 3D rendering:

```typescript
<Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
  <CameraTransitionProvider>
    <color attach="background" args={["#000"]} />
    <ambientLight intensity={0.6} />
    <directionalLight position={[4, 6, 8]} intensity={1.2} />
    <Particles count={16000} />
    <CardCloud {...props} />
    <OrbitControls enableDamping dampingFactor={0.05} />
    <KeyboardControls />
    <CameraController timePeriod={timePeriod} />
  </CameraTransitionProvider>
</Canvas>
```

### State Management
Uses React Context for global state:

```typescript
// ProjectsProvider manages project data and UI state
const { timePeriod, selectedProject, query, tag } = useProjectsContext();

// CameraTransitionProvider coordinates camera transitions
const { isTransitioning, setIsTransitioning } = useCameraTransition();
```

### Card Positioning Logic
Cards are positioned in 3D space based on project metadata:

```typescript
// X-axis: Time period (Early to Future)
const x = (timeIndex - 2) * 2.5;

// Y-axis: Category tags
const y = (tagIndex - 2) * 1.5;

// Z-axis: Featured status and relevance
const z = project.featured ? Math.random() * 2 + 1 : Math.random() * 3 + 2;
```

## Adding New Projects

### 1. Update Project Data
Edit `data/projects.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Project Title',
  summary: 'Brief summary',
  description: 'Detailed description',
  content: 'Full project content',
  image: '/path/to/image.jpg', // or API endpoint
  tags: ['Productdesign', 'AI'], // Choose from available tags
  timePeriod: 'Current', // Early, Mid, Recent, Current, Future
  featured: true // Special highlighting
}
```

### 2. Available Tags
- `Productdesign`: UI/UX design and product development
- `DataViz`: Data visualization and analytics
- `AI`: Artificial intelligence and machine learning
- `Music`: Audio and musical projects
- `Writing`: Content creation and documentation

### 3. Time Periods
- `Early`: Initial projects and experiments
- `Mid`: Development and iteration phase
- `Recent`: Recently completed work
- `Current`: Currently active projects
- `Future`: Planned and upcoming projects

## Customizing Styling

### Glass Morphism Effects
Modify glass morphism properties in `ProjectCard.tsx`:

```typescript
<meshStandardMaterial
  color="#ffffff"
  transparent
  opacity={opacity * 0.85}
  roughness={0.1}
  metalness={0.1}
  envMapIntensity={0.5}
/>
```

### CSS Animations
Add custom animations in `globals.css`:

```css
@keyframes customAnimation {
  0% { transform: scale(0.1); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-custom {
  animation: customAnimation 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Tailwind Configuration
Extend Tailwind in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    animation: {
      'custom': 'customAnimation 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    keyframes: {
      customAnimation: {
        '0%': { transform: 'scale(0.1)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      }
    }
  }
}
```

## Camera System

### Camera Controller
The `CameraController` manages cinematic movements:

```typescript
// Only runs during transitions
if (!isTransitioning) {
  currentPositionRef.current.copy(camera.position);
  return;
}

// Smooth interpolation to target position
currentPositionRef.current.lerp(targetPositionRef.current, lerpFactor);
camera.position.copy(currentPositionRef.current);
```

### Manual Controls
`KeyboardControls` handles WASD movement:

```typescript
// Disabled during transitions
if (isTransitioning) return;

// Move camera based on key presses
if (keys['w']) camera.position.z -= 0.05;
if (keys['s']) camera.position.z += 0.05;
// ... etc
```

## Performance Optimization

### React Optimizations
```typescript
// Memoize expensive calculations
const positions = useMemo(() => {
  return projects.map(project => calculatePosition(project));
}, [timePeriod]);

// Memoize event handlers
const handleCardClick = useCallback((project: Project) => {
  setSelectedProject(project);
}, [setSelectedProject]);

// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(Component);
```

### 3D Optimizations
```typescript
// Use refs for 3D objects
const meshRef = useRef<THREE.Mesh>(null);

// Reuse materials
const material = useMemo(() => new THREE.MeshStandardMaterial({
  color: '#ffffff',
  transparent: true,
}), []);

// Frame-rate independent animations
useFrame((state, delta) => {
  const lerpFactor = Math.min(delta * 2, 1);
  // ... smooth interpolation
});
```

## Debugging

### Common Issues

#### Cards Not Positioning Correctly
- Check `timePeriod` and `tags` values in project data
- Verify positioning logic in `CardCloud.tsx`
- Ensure `useMemo` dependencies are correct

#### Camera Controls Not Working
- Verify `isTransitioning` state management
- Check for conflicts between `CameraController` and `KeyboardControls`
- Ensure `OrbitControls` is properly configured

#### Performance Issues
- Check for unnecessary re-renders with React DevTools
- Verify `useMemo` and `useCallback` usage
- Monitor 3D object creation in `useFrame`

### Debug Tools
```typescript
// Add debug logging
console.log('Camera position:', camera.position);
console.log('Transitioning:', isTransitioning);
console.log('Time period:', timePeriod);

// Use React DevTools Profiler
// Monitor Three.js performance with stats.js
```

## Testing

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { CardCloud } from './CardCloud';

test('renders project cards', () => {
  render(<CardCloud onCardClick={jest.fn()} />);
  // Test assertions
});
```

### Integration Testing
```typescript
test('camera transitions work correctly', async () => {
  // Test camera movement between time periods
  // Verify smooth transitions
  // Check zoom level preservation
});
```

## Deployment

### Build Process
```bash
npm run build
npm run start
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENVIRONMENT=production
```

### Performance Monitoring
- Use Next.js Analytics
- Monitor WebGL performance
- Track user interactions
- Measure loading times

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use meaningful variable names
- Add JSDoc comments for complex functions

### Git Workflow
```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### Pull Request Process
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit pull request
5. Code review and merge
