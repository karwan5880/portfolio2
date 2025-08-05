// Configuration constants for the drone show
export const DRONE_CONFIG = {
  COUNT: 4096,
  TEXTURE_SIZE: 64, // Math.sqrt(4096)
  GRID_SIZE: 64,
  SPACING: 15.0,
  SCALE: 2.0,
  LIGHT_SCALE: {
    INITIAL: 2.0,
    FINAL: 4.0,
    START_TIME: 30.0,
    DURATION: 10.0,
  },
}

export const FORMATION_CONFIG = {
  SPHERE: {
    COUNT: 512,
    RADIUS: 350,
  },
  SCREEN: {
    WIDTH: 32,
    HEIGHT: 32,
    SPACING: 12.0,
    BASE_HEIGHT: 590.0,
  },
  COUNTDOWN: {
    WIDTH: 32,
    HEIGHT: 16,
    COUNT: 512,
    SPACING: 8.0,
  },
  DOME: {
    RADIUS: 700.0,
    HEIGHT: 200.0,
    BASE_ALTITUDE: 500.0,
  },
}

export const TIMING_CONFIG = {
  LAUNCH: {
    MIN: 2.0,
    MAX: 6.0,
  },
  PHASES: {
    GATHERING_END: 12.0,
    DOME_START: 18.0,
    DOME_COMPLETE: 30.0,
    SCREEN_START: 30.0,
    COUNTDOWN_START: 40.0,
    COUNTDOWN_END: 50.0,
  },
  CAMERA: {
    GROUND_PHASE: 7.0,
    ANIMATION_END: 30.0,
    USER_CONTROL: 32.0,
  },
  PATTERNS: {
    CYCLE_DURATION: 30.0,
    PATTERN_DURATION: 5.0,
    PATTERN_COUNT: 6,
  },
}

export const VISUAL_CONFIG = {
  COLORS: {
    BACKGROUND: '#000000',
    AMBIENT_LIGHT: 1.0,
    DIRECTIONAL_LIGHT: 1.5,
  },
  BLOOM: {
    INITIAL_INTENSITY: 0.9,
    INITIAL_RADIUS: 0.9,
    DECREASE_RATE: 0.1,
    MIN_VALUE: 0.01,
  },
  BRIGHTNESS: {
    BASE: 10.0,
    PULSE_MULTIPLIER: 5.0,
    PATTERN_BASE: 15.0,
    PATTERN_MULTIPLIER: 35.0,
  },
}

export const CAMERA_CONFIG = {
  POSITIONS: {
    START: { x: 0, y: 4, z: 90 },
    END: { x: 0, y: 200, z: 750 },
    USER_CONTROL: { x: 0, y: 250, z: 900 },
  },
  LOOK_AT: {
    START: { x: 0, y: 25, z: 0 },
    END: { x: 0, y: 600, z: 0 },
    USER_CONTROL: { x: 0, y: 500, z: 0 },
  },
  FOV: 60,
  NEAR: 0.1,
  FAR: 4160000,
}
