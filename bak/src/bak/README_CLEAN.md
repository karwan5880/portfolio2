# 🚁 Drone Show Simulation - Clean Version

A beautiful React Three.js drone show simulation with 4096 drones performing synchronized formations and countdown display.

## 🎬 Show Sequence

1. **Intro Text** (0-25s) - Portfolio introduction with GitHub/LinkedIn links
2. **Drone Formations** (0-30s) - Ground takeoff → Random formation → Dome
3. **Screen Formation** (30-50s) - Selected drones form 32x32 display screen
4. **Countdown** (50.7-60.7s) - Bright white digits counting 9→0
5. **Pattern Display** (60.7s+) - 6 animated visual patterns cycling every 30s

## 🎯 Key Features

- **4096 Drones** - Full-scale simulation
- **Perfect Countdown** - 9→0 with proper "0" hole and no stutter
- **Smooth Formations** - Collision-free movement with staggered timing
- **Visual Patterns** - 6 different animated effects (ripples, spirals, plasma, etc.)
- **Intro Sequence** - Beautiful text overlay before show starts

## 🚀 Usage

### Production Version (Recommended)

```javascript
import { ProductionDroneShow } from './ProductionDroneShow.js'

function App() {
  return <ProductionDroneShow />
}
```

### Clean Version (No Intro)

```javascript
import { CleanDroneShow } from './CleanDroneShow.js'

function App() {
  return <CleanDroneShow />
}
```

### Original Version (Development)

```javascript
import { NewBeginningDemo } from './index.js'

function App() {
  return <NewBeginningDemo />
}
```

## ⚙️ Configuration

Key settings can be adjusted in `config/constants.js`:

```javascript
export const TIMING_CONFIG = {
  PHASES: {
    SCREEN_START: 30.0, // When screen formation begins
    COUNTDOWN_START: 50.7, // When countdown begins (shortened "9")
    COUNTDOWN_END: 60.7, // When countdown ends
  },
}
```

## 🎨 Visual Effects

### Countdown Digits (50.7-60.7s)

- **9→0** sequence with proper timing
- Bright white 7-segment style digits
- Dark background for maximum contrast
- "0" has proper center hole

### Animated Patterns (60.7s+)

1. **Ripple Waves** - Blue to cyan waves from center
2. **Rotating Spiral** - Purple to magenta spiral
3. **Plasma Effect** - Orange to yellow plasma
4. **Pulsing Circles** - Green to yellow pulses
5. **Dynamic Checkerboard** - Red to pink checkerboard
6. **Diagonal Waves** - Light blue to white waves

## 🔧 Technical Details

- **React Three.js** - 3D rendering and animation
- **WebGL Shaders** - GPU-accelerated particle system
- **Instanced Rendering** - Efficient rendering of 4096 drones
- **FBO Textures** - Position computation on GPU
- **Modular Architecture** - Clean, maintainable code structure

## 📱 Controls

- **Mouse** - Orbit camera (after scripted sequence)
- **Scroll** - Zoom in/out
- **Skip Button** - Skip intro text sequence

## 🎯 Perfect For

- Portfolio demonstrations
- WebGL/Three.js showcases
- Particle system examples
- Interactive 3D experiences
- Technical demonstrations

---

_Enjoy the drone show! 🎉_
