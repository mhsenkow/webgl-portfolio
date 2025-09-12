# Portfolio WebGL

A stunning 3D portfolio experience built with React Three Fiber, featuring interactive WebGL cards, cinematic camera movements, and smooth transitions. This portfolio showcases projects across different time periods and categories in an immersive 3D environment.

## ✨ Features

### 🎮 **Interactive 3D Environment**
- **WebGL Card Cloud**: Projects displayed as floating 3D cards with glass morphism effects
- **Dynamic Positioning**: Cards positioned based on time period (horizontal) and category (vertical)
- **Smooth Animations**: Physics-based transitions with cubic-bezier easing
- **Particle System**: 16,000 animated background particles for atmospheric depth

### 🎬 **Cinematic Camera System**
- **Time Period Focus**: Click time period buttons to smoothly focus camera on relevant cards
- **Zoom Level Respect**: Maintains user's zoom level during transitions
- **Smooth Transitions**: Camera smoothly moves between time periods with proper easing
- **Non-Conflicting Controls**: Manual controls work seamlessly alongside automatic transitions

### 🎯 **Project Management**
- **Time-Based Organization**: Projects organized by Early, Mid, Recent, Current, Future
- **Category Filtering**: Filter by Product Design, Data Visualization, AI, Music, Writing
- **Featured Projects**: Special highlighting for featured projects with golden borders
- **Search Functionality**: Real-time search across project titles, summaries, and descriptions

### 🎨 **Visual Design**
- **Glass Morphism**: All cards feature modern glass morphism effects
- **Project Images**: Each card displays actual project images via API placeholders
- **Subtle Indicators**: Color-coded tag indicators and title hints
- **Responsive Layout**: Adapts to different screen sizes and orientations

### 🕹️ **Controls**
- **WASD Keys**: Move camera around the scene
- **Arrow Keys**: Alternative camera movement controls
- **Trackpad/Mouse**: Zoom, pan, and rotate for detailed exploration
- **Time Period Buttons**: Smooth camera transitions to focus on specific periods
- **Tag Filters**: Filter projects by category with smooth opacity transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-webgl
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### **Core Technologies**
- **Next.js 15.5.2**: React framework with App Router
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers for R3F
- **Three.js**: 3D graphics library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript

### **Key Components**

#### **3D Scene Components**
- `CardCloud.tsx`: Manages the 3D cloud of project cards
- `ProjectCard.tsx`: Individual 3D project card with glass morphism
- `Particles.tsx`: Background particle system
- `CameraController.tsx`: Handles cinematic camera movements
- `KeyboardControls.tsx`: WASD and arrow key controls

#### **UI Components**
- `Hud.tsx`: Head-up display with search, filters, and controls
- `AnimatedProjectDetail.tsx`: Fullscreen project detail view
- `ProjectsProvider.tsx`: Context provider for project state management

#### **Data Layer**
- `projects.ts`: Project data structure and sample data
- `useProjects.ts`: Custom hook for project management

### **State Management**
- **React Context**: Global state for projects, filters, and UI state
- **Local State**: Component-specific state for animations and interactions
- **Ref Management**: Performance-optimized refs for 3D objects

## 🎮 Controls Guide

### **Camera Movement**
- **WASD**: Move camera forward/backward/left/right
- **Arrow Keys**: Same as WASD for alternative control
- **Mouse Drag**: Orbit around the scene
- **Trackpad**: Pinch to zoom, drag to pan and rotate

### **Time Period Navigation**
- **Early**: Focus on early-stage projects (left side)
- **Mid**: Focus on mid-stage projects (center-left)
- **Recent**: Focus on recent projects (center)
- **Current**: Focus on current projects (center-right)
- **Future**: Focus on future projects (right side)

### **Filtering & Search**
- **Search Bar**: Type to search across all project content
- **Tag Filters**: Click tags to filter by category
- **Time Period Buttons**: Click to focus camera on specific time periods

## 🎨 Customization

### **Adding New Projects**
Edit `data/projects.ts` to add new projects:

```typescript
{
  id: 'unique-id',
  title: 'Project Title',
  summary: 'Brief summary',
  description: 'Detailed description',
  content: 'Full project content',
  image: '/path/to/image.jpg',
  tags: ['Productdesign', 'AI'], // Choose from available tags
  timePeriod: 'Current', // Early, Mid, Recent, Current, Future
  featured: true // Special highlighting
}
```

### **Styling**
- **Tailwind Classes**: Modify component classes for styling
- **CSS Animations**: Custom keyframes in `globals.css`
- **3D Materials**: Adjust glass morphism properties in `ProjectCard.tsx`

### **Camera Behavior**
Modify `CameraController.tsx` to adjust:
- Transition speed and easing
- Camera distances and angles
- Focus behavior

## 📁 Project Structure

```
portfolio-webgl/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main portfolio page
├── components/            # React components
│   ├── AnimatedProjectDetail.tsx
│   ├── CardCloud.tsx
│   ├── CameraController.tsx
│   ├── Hud.tsx
│   ├── KeyboardControls.tsx
│   ├── Particles.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectsProvider.tsx
│   └── CameraTransitionProvider.tsx
├── data/                  # Data layer
│   └── projects.ts       # Project data and types
├── hooks/                 # Custom React hooks
│   └── useProjects.ts    # Project management hook
├── public/               # Static assets
└── README.md            # This file
```

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### **Other Platforms**
```bash
npm run build
npm run start
```

## 🛠️ Development

### **Available Scripts**
- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### **Performance Optimizations**
- **Turbopack**: Fast bundling for development
- **React.memo**: Optimized re-renders
- **useMemo/useCallback**: Memoized calculations
- **Instanced Rendering**: Efficient 3D object rendering

## 🎯 Future Enhancements

- **Audio Integration**: Sound effects for interactions
- **VR Support**: WebXR compatibility
- **Advanced Animations**: More sophisticated transition effects
- **Project Upload**: Dynamic project management interface
- **Analytics**: User interaction tracking
- **Mobile Optimization**: Touch gesture improvements

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a personal portfolio project. For questions or suggestions, please contact the maintainer.

---

Built with ❤️ using React Three Fiber and Next.js