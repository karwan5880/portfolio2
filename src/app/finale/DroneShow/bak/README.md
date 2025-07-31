# Drone Show - Refactored Architecture

This directory contains a refactored version of the drone show with improved modularity, maintainability, and extensibility for future development.

## 🏗️ Architecture Overview

The refactored codebase is organized into focused modules with clear separation of concerns:

```
NewBeginningDemo/
├── config/                 # Configuration and constants
├── utils/                  # Utility functions
├── formations/             # Formation calculation logic
├── patterns/               # Visual pattern generation
├── shaders/                # Modular shader system
├── animation/              # Animation controllers
├── components/             # React components
├── README.md               # This documentation
└── [legacy files]          # Original files for reference
```

## 📁 Directory Structure

### `/config`

- **`constants.js`** - All configuration constants in one place
  - Drone settings (count, scale, spacing)
  - Formation parameters (sphere, screen, dome)
  - Timing configuration (phases, transitions)
  - Visual settings (colors, bloom, brightness)
  - Camera configuration

### `/utils`

- **`mathUtils.js`** - Mathematical utility functions
  - Interpolation functions (lerp, smoothstep)
  - Color conversion (HSL to RGB)
  - 3D math utilities
  - Random number generation

### `/formations`

- **`FormationCalculator.js`** - Formation position calculations
  - Ground grid positions
  - Dome formation logic
  - Screen formation selection
  - Pattern area detection
  - Coordinate transformations

### `/patterns`

- **`PatternGenerator.js`** - Animated pattern system
  - 6 different visual patterns
  - Color and brightness calculation
  - Pattern timing and cycling
  - Modular pattern effects

### `/shaders`

- **`shaderUtils.js`** - Reusable GLSL utilities
  - Common shader functions
  - Phase detection utilities
  - Color generation functions
  - Brightness control system
- **`vertexShader.js`** - Modular vertex shader
- **`fragmentShaders.js`** - Modular fragment shaders

### `/animation`

- **`CameraController.js`** - Camera movement system
  - Scripted camera sequences
  - Smooth transitions
  - User control handoff
- **`BloomController.js`** - Bloom effect management
  - Dynamic bloom adjustment
  - Time-based transitions

### `/components`

- **`DroneShow.js`** - Main show component
- **`RefactoredParticleSystem.js`** - Modular particle system

## 🚀 Key Improvements

### 1. **Modularity**

- Each concern is separated into its own module
- Easy to modify individual aspects without affecting others
- Clear interfaces between components

### 2. **Configuration Management**

- All constants centralized in `config/constants.js`
- Easy to adjust timing, colors, and parameters
- No magic numbers scattered throughout code

### 3. **Reusable Utilities**

- Mathematical functions extracted to `utils/mathUtils.js`
- Shader utilities in `shaders/shaderUtils.js`
- Formation calculations in dedicated module

### 4. **Maintainable Shaders**

- Modular shader construction with `buildShader()`
- Reusable GLSL code snippets
- Clear separation of vertex and fragment logic

### 5. **Clean Component Structure**

- React components focused on rendering
- Business logic extracted to dedicated classes
- Clear data flow and state management

## 🔧 Usage

### Basic Usage

```javascript
import { NewBeginningDemoRefactored } from './NewBeginningDemoRefactored.js'

function App() {
  return <NewBeginningDemoRefactored />
}
```

### Customization Examples

#### Adjusting Timing

```javascript
// In config/constants.js
export const TIMING_CONFIG = {
  PHASES: {
    DOME_START: 20.0, // Start dome formation at 20s instead of 18s
    SCREEN_START: 35.0, // Start screen formation at 35s instead of 30s
    // ... other timings
  },
}
```

#### Adding New Patterns

```javascript
// In patterns/PatternGenerator.js
static generateNewPattern(x, y, time) {
  // Your custom pattern logic here
  return {
    color: [r, g, b],
    brightness: value
  }
}
```

#### Modifying Camera Behavior

```javascript
// In animation/CameraController.js
updateCamera(camera, controls, time) {
  // Custom camera movement logic
}
```

## 🎨 Visual Effects System

### Pattern System

The pattern system cycles through 6 different effects every 30 seconds:

1. **Ripple Waves** (0-5s) - Blue to cyan waves from center
2. **Rotating Spiral** (5-10s) - Purple to magenta spiral
3. **Plasma Effect** (10-15s) - Orange to yellow plasma
4. **Pulsing Circles** (15-20s) - Green to yellow pulses
5. **Dynamic Checkerboard** (20-25s) - Red to pink checkerboard
6. **Diagonal Waves** (25-30s) - Light blue to white waves

### Formation Phases

1. **Ground Formation** (0-2s) - Drones on ground in 64x64 grid
2. **Launch Phase** (2-12s) - Staggered takeoff to random heights
3. **Gathering Phase** (12-18s) - Hold formation positions
4. **Dome Formation** (18-30s) - Form hemisphere dome
5. **Screen Formation** (30s+) - Selected drones form 32x32 display
6. **Pattern Display** (30s+) - Animated visual patterns

## 🔄 Migration from Legacy Code

The original files are preserved for reference:

- `index.js` - Original main component
- `droneInstancedShader.js` - Original shader code
- `FinalParticleSystem.js` - Original particle system
- `cinematicShader.js` - Original position shader

To switch between versions:

```javascript
// Use refactored version
import { NewBeginningDemoRefactored } from './NewBeginningDemoRefactored.js'
// Use original version
import { NewBeginningDemo } from './index.js'
```

## 🛠️ Development Guidelines

### Adding New Features

1. **Identify the appropriate module** - Don't mix concerns
2. **Update constants** - Add new configuration to `config/constants.js`
3. **Create utilities** - Add reusable functions to appropriate utility modules
4. **Test incrementally** - Each module can be tested independently

### Best Practices

- Keep components focused on rendering
- Extract business logic to dedicated classes
- Use configuration constants instead of magic numbers
- Document new patterns and formations
- Maintain backward compatibility when possible

## 📈 Performance Considerations

The refactored architecture maintains the same performance characteristics as the original:

- GPU-based position computation using FBO
- Instanced rendering for 4096 drones
- Efficient shader compilation with modular utilities
- Minimal JavaScript computation in animation loop

## 🔮 Future Development

The modular structure makes it easy to:

- Add new visual patterns
- Create different formation types
- Implement new camera movements
- Extend the timing system
- Add interactive controls
- Create configuration UI
- Implement pattern editor
- Add sound synchronization

This refactored architecture provides a solid foundation for continued development and experimentation with the drone show system.
