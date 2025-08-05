// Shader utility functions and common GLSL code snippets

/**
 * Common GLSL utility functions that can be injected into shaders
 */
export const GLSL_UTILS = {
  // HSL to RGB conversion
  HSL_TO_RGB: /*glsl*/ `
    vec3 hsl2rgb(vec3 c) { 
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); 
      return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0)); 
    }
  `,

  // Random function
  RANDOM: /*glsl*/ `
    float random(float n) { 
      return fract(sin(n) * 43758.5453123); 
    }
  `,

  // Matrix creation
  CREATE_MATRIX: /*glsl*/ `
    mat4 createMatrix(vec3 p, float s) { 
      return mat4(s,0,0,0, 0,s,0,0, 0,0,s,0, p.x,p.y,p.z,1.0); 
    }
  `,

  // Quadratic bezier
  QUADRATIC_BEZIER: /*glsl*/ `
    vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) { 
      return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C; 
    }
  `,

  // Smooth step
  SMOOTH_STEP: /*glsl*/ `
    float smoothStep(float edge0, float edge1, float x) {
      float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
      return t * t * (3.0 - 2.0 * t);
    }
  `,
}

/**
 * Common shader constants
 */
export const SHADER_CONSTANTS = /*glsl*/ `
  #define PI 3.14159265359
  #define DRONE_COUNT 4096.0
  #define TEXTURE_SIZE 64.0
  #define GRID_SIZE 64.0
`

/**
 * Formation phase detection functions
 */
export const PHASE_DETECTION = /*glsl*/ `
  bool isDomeFormationStarted(float time) {
    return (time >= 18.0);
  }
  
  bool isDomeFormationComplete(float time) {
    return (time >= 30.0);
  }
  
  bool isCountdownActive(float time) {
    return (time >= 40.0 && time < 50.0);
  }
  
  bool isPatternPhaseActive(float time) {
    return (time >= 30.0);
  }
`

/**
 * Color generation functions
 */
export const COLOR_FUNCTIONS = /*glsl*/ `
  vec3 getBeautifulRandomColor(float droneId, float time) {
    float timeStep = floor(time * 2.0);
    float randomSeed = droneId * 0.1234 + timeStep * 0.5678;
    
    float baseHue = fract(sin(randomSeed * 12.9898) * 43758.5453);
    float colorType = mod(droneId, 8.0);
    
    float hue;
    if (colorType < 1.0) {
      hue = 0.02 + baseHue * 0.06; // Coral/Salmon
    } else if (colorType < 2.0) {
      hue = 0.45 + baseHue * 0.10; // Teal/Turquoise
    } else if (colorType < 3.0) {
      hue = 0.75 + baseHue * 0.10; // Lavender/Purple
    } else if (colorType < 4.0) {
      hue = 0.08 + baseHue * 0.07; // Peach/Apricot
    } else if (colorType < 5.0) {
      hue = 0.35 + baseHue * 0.07; // Mint/Seafoam
    } else if (colorType < 6.0) {
      hue = 0.88 + baseHue * 0.10; // Rose/Pink
    } else if (colorType < 7.0) {
      hue = 0.58 + baseHue * 0.10; // Sky/Periwinkle
    } else {
      hue = 0.12 + baseHue * 0.06; // Gold/Amber
    }
    
    float saturation = 0.7 + 0.3 * fract(sin(randomSeed * 78.233) * 43758.5453);
    float lightness = 0.5 + 0.3 * fract(sin(randomSeed * 37.719) * 43758.5453);
    
    return hsl2rgb(vec3(hue, saturation, lightness));
  }
`

/**
 * Brightness control functions
 */
export const BRIGHTNESS_CONTROL = /*glsl*/ `
  float getSmoothDimFactor(float time) {
    float domeCompleteTime = 30.0;
    float countdownStartTime = 40.0;
    
    if (time < domeCompleteTime) {
      return 1.0;
    } else if (time < countdownStartTime) {
      float fadeProgress = (time - domeCompleteTime) / (countdownStartTime - domeCompleteTime);
      return 1.0 - (fadeProgress * 0.95);
    } else {
      return 0.05;
    }
  }
  
  float getGlobalBrightness(float time, float baseBrightness) {
    if (isCountdownActive(time)) {
      return baseBrightness * 0.05;
    } else {
      float dimFactor = getSmoothDimFactor(time);
      return baseBrightness * dimFactor;
    }
  }
`

/**
 * Build a complete shader with utilities
 */
export function buildShader(mainCode, requiredUtils = []) {
  const utilsCode = requiredUtils.map((util) => GLSL_UTILS[util] || '').join('\n')

  return `
    ${SHADER_CONSTANTS}
    ${utilsCode}
    ${PHASE_DETECTION}
    ${COLOR_FUNCTIONS}
    ${BRIGHTNESS_CONTROL}
    ${mainCode}
  `
}
