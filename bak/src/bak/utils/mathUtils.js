// Mathematical utility functions for drone formations and animations

/**
 * Smooth interpolation function with easing
 */
export function smoothstep(min, max, value) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return t * t * (3.0 - 2.0 * t)
}

/**
 * Linear interpolation between two values
 */
export function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1))
  const m = l - c / 2

  let r, g, b

  if (h < 1 / 6) {
    ;[r, g, b] = [c, x, 0]
  } else if (h < 2 / 6) {
    ;[r, g, b] = [x, c, 0]
  } else if (h < 3 / 6) {
    ;[r, g, b] = [0, c, x]
  } else if (h < 4 / 6) {
    ;[r, g, b] = [0, x, c]
  } else if (h < 5 / 6) {
    ;[r, g, b] = [x, 0, c]
  } else {
    ;[r, g, b] = [c, 0, x]
  }

  return [r + m, g + m, b + m]
}

/**
 * Generate random value from seed
 */
export function random(seed) {
  return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1
}

/**
 * Calculate quadratic bezier curve point
 */
export function getQuadraticBezier(A, B, C, t) {
  const oneMinusT = 1 - t
  return {
    x: oneMinusT * oneMinusT * A.x + 2 * oneMinusT * t * B.x + t * t * C.x,
    y: oneMinusT * oneMinusT * A.y + 2 * oneMinusT * t * B.y + t * t * C.y,
    z: oneMinusT * oneMinusT * A.z + 2 * oneMinusT * t * B.z + t * t * C.z,
  }
}

/**
 * Calculate distance between two 3D points
 */
export function distance3D(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Calculate 2D distance
 */
export function distance2D(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}
