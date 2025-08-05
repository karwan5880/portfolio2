// Drone light and color shaders - controls visual appearance

// Configuration constants
const SHOW_CONFIG = {
  DRONE_COUNT: 4096,
  GRID_ROWS: 128,
  GRID_COLS: 32,
  TEXTURE_SIZE: 64,

  // Timing constants
  HIDDEN_PHASE_END: 5.0,
  REVEAL_PHASE_END: 12.0,
  RECTANGLE_FORMATION_START: 52.0,

  // Color constants
  RAINBOW_SATURATION: 1.0,
  RAINBOW_LIGHTNESS: 0.5,
  SPECIAL_PINK_COLUMNS: [8, 24],
  SPECIAL_PINK_COLOR: [1.0, 0.4, 0.7],

  // Text display
  TEXT_THRESHOLD: 0.5,
  TEXT_BACKGROUND_COLOR: [0.02, 0.02, 0.02],

  // Disco mode
  DISCO_COLOR_CHANGE_INTERVAL: 2.0,
}

// Main rendering vertex shader with colors and lighting setup
export const droneRenderShaderVS = /*glsl*/ `
    uniform sampler2D uPositionTexture;
    uniform sampler2D uTextTexture;
    uniform float uTime;
    uniform float uInstanceScale;
    uniform float uTextActive;
    uniform vec3 uTextColor;
    attribute float a_id;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    varying float vAwakeningFactor;
    varying float vRevealFactor;
    
    #define DRONE_COUNT 4096.0
    #define TEXTURE_SIZE 64.0
    #define GRID_COLS 32.0
    #define GRID_ROWS 128.0

    float random(float n) { 
        return fract(sin(n) * 43758.5453123); 
    }

    vec3 hsl2rgb(vec3 c) { 
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); 
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0)); 
    }
    
    mat4 createMatrix(vec3 p, float s) { 
        return mat4(s,0,0,0, 0,s,0,0, 0,0,s,0, p.x,p.y,p.z,1.0); 
    }

    // Fixed text coordinate mapping for rectangle formation
    vec2 calculateTextureCoordinates(float row, float col) {
        float textureX, textureY;
        
        // FIXED: Symmetric mapping for equal left/right quadrant heights
        // Grid: 128 rows × 32 columns → Texture: 128×32
        // Left half: columns 0-15, Right half: columns 16-31
        
        if (row >= 64.0 && col <= 15.0) {
            // Top-left quadrant (rows 64-127, cols 0-15)
            textureX = (127.0 - row);           // Maps to texture X: 0-63
            textureY = (15.0 - col);            // Maps to texture Y: 0-15
        } else if (row >= 64.0 && col >= 16.0) {
            // Top-right quadrant (rows 64-127, cols 16-31)
            textureX = 64.0 + (127.0 - row);   // Maps to texture X: 64-127
            textureY = (31.0 - col);            // FIXED: Maps to texture Y: 0-15 (was inverted)
        } else if (row <= 63.0 && col <= 15.0) {
            // Bottom-left quadrant (rows 0-63, cols 0-15)
            textureX = (63.0 - row);            // Maps to texture X: 0-63
            textureY = 16.0 + (15.0 - col);    // Maps to texture Y: 16-31
        } else {
            // Bottom-right quadrant (rows 0-63, cols 16-31)
            textureX = 64.0 + (63.0 - row);    // Maps to texture X: 64-127
            textureY = 16.0 + (31.0 - col);    // FIXED: Maps to texture Y: 16-31 (symmetric)
        }
        
        return vec2(textureX / 127.0, textureY / 31.0);
    }
    
    // Generate cyan/teal color variations for background drones
    vec3 generateCyanVariations(float droneId, float time) {
        float timeInRect = time - 52.0;
        float colorCycle = floor(timeInRect / 3.0); // Slower transitions (every 3 seconds)
        float randomSeed = droneId * 0.001 + colorCycle * 0.1; // Gentler randomness
        
        // Create variations around cyan/teal (180-200 degrees hue)
        float baseHue = 180.0; // Cyan base
        float hueVariation = (random(randomSeed) - 0.5) * 40.0; // ±20 degrees variation
        float finalHue = baseHue + hueVariation; // 160-200 degrees (teal to cyan to light blue)
        
        // Varied saturation and lightness for visual interest
        float saturation = 0.6 + random(randomSeed + 0.1) * 0.3; // 0.6-0.9 (vibrant but not overwhelming)
        float lightness = 0.4 + random(randomSeed + 0.2) * 0.3;  // 0.4-0.7 (visible but not too bright)
        
        vec3 hslColor = vec3(finalHue / 360.0, saturation, lightness);
        return hsl2rgb(hslColor);
    }
    
    // Generate rainbow colors for flight phase
    vec3 generateRainbowColor(float col) {
        float hue = col / 31.0;
        vec3 hslColor = vec3(hue, 1.0, 0.5);
        vec3 rainbowColor = hsl2rgb(hslColor);
        
        // Special pink highlights
        if (col == 8.0 || col == 24.0) {
            rainbowColor = vec3(1.0, 0.4, 0.7);
        }
        
        return rainbowColor;
    }
    
    // Enhanced text color calculation with anti-aliasing support
    vec3 calculateTextColor(vec2 textureCoord, vec3 baseTextColor, float droneId, float time) {
        vec4 textSample = texture2D(uTextTexture, textureCoord);
        float textIntensity = textSample.r;
        
        // Enhanced brightness mapping for smoother text
        if (textIntensity >= 0.9) {
            // Full brightness text pixels
            return baseTextColor;
        } else if (textIntensity >= 0.6) {
            // High brightness - anti-aliasing edges
            return baseTextColor * 0.9;
        } else if (textIntensity >= 0.3) {
            // Medium brightness - soft edges
            return baseTextColor * 0.6;
        } else if (textIntensity >= 0.15) {
            // Low brightness - very soft edges
            return baseTextColor * 0.3;
        } else {
            // Background - almost invisible like dark Chongqing night
            return vec3(0.001, 0.001, 0.001); // Extremely dark, almost black
        }
    }
    
    // Main color calculation function with enhanced text rendering
    vec3 getRainbowColumnColor(float droneId, float time, float revealFactor, vec3 worldPosition) {
        float row = floor(droneId / GRID_COLS);
        float col = mod(droneId, GRID_COLS);
        
        // Rectangle formation phase
        if (time >= 52.0) {
            if (uTextActive > 0.5) {
                // Enhanced text display mode with anti-aliasing
                vec2 textureCoord = calculateTextureCoordinates(row, col);
                return calculateTextColor(textureCoord, uTextColor, droneId, time);
            } else {
                // No text active - almost invisible background
                return vec3(0.001, 0.001, 0.001);
            }
        }
        
        // Early phases
        if (revealFactor <= 0.0) {
            return vec3(0.0, 0.0, 0.0);
        } else if (time < 12.0) {
            // Reveal phase - warm glow
            vec3 dimGlow = vec3(0.8, 0.6, 0.4) * 0.6;
            return dimGlow * revealFactor;
        } else {
            // Flight phase - rainbow colors
            return generateRainbowColor(col);
        }
    }
    
    // Simple awakening system
    float getDroneAwakeningFactor(float droneId, float time) {
        if (time < 5.0) return 0.0;
        return 1.0;
    }

    void main() {
        vNormal = normalize(normalMatrix * normal);

        // Get position from texture
        vec2 ownUv = vec2(mod(a_id, TEXTURE_SIZE) + 0.5, floor(a_id / TEXTURE_SIZE) + 0.5) / TEXTURE_SIZE;
        vec4 positionData = texture2D(uPositionTexture, ownUv);
        vec3 idealPos = positionData.xyz;
        float droneRevealFactor = positionData.w;

        vAwakeningFactor = getDroneAwakeningFactor(a_id, uTime);
        vRevealFactor = droneRevealFactor;
        
        // Use rainbow column colors
        vColor = getRainbowColumnColor(a_id, uTime, droneRevealFactor, idealPos);

        vec3 finalPos = idealPos;
        vPosition = finalPos;

        mat4 finalMatrix = createMatrix(finalPos, uInstanceScale);
        vec4 worldPosition = finalMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * worldPosition;
        vViewPosition = viewPosition.xyz;
        
        gl_Position = projectionMatrix * viewPosition;
    }
`

// Light shader configuration
const LIGHT_CONFIG = {
  PULSE_INTENSITY: 0.3,
  PULSE_CURVE: 0.8,

  // Phase-specific brightness values
  HIDDEN_BASE: 0.0,
  HIDDEN_PULSE: 0.0,

  REVEAL_BASE_START: 8.0,
  REVEAL_BASE_END: 20.0,
  REVEAL_PULSE_START: 10.0,
  REVEAL_PULSE_END: 25.0,

  FLIGHT_BASE: 15.0,
  FLIGHT_PULSE: 8.0,

  // Global brightness multipliers
  REVEAL_GLOBAL_START: 0.3,
  REVEAL_GLOBAL_END: 0.7,
  FLIGHT_GLOBAL: 0.8,
}

// Light shader - controls drone light brightness and effects
export const lightShaderFS = /*glsl*/ `
    uniform float uTime;
    uniform float uPulseFrequency;
    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vAwakeningFactor;
    varying float vRevealFactor;
    
    // Calculate pulse effect
    float calculatePulse(float time, float frequency) {
        float primaryPulse = (sin(time * frequency * 0.5) + 1.0) / 2.0;
        float h = primaryPulse * 0.3;
        return pow(h, 0.8);
    }
    
    // Calculate brightness based on show phase
    vec2 calculateBrightness(float time) {
        if (time < 5.0) {
            return vec2(0.0, 0.0);
        } else if (time < 12.0) {
            float progress = (time - 5.0) / 7.0;
            float base = 8.0 + progress * 12.0;
            float pulse = 10.0 + progress * 15.0;
            return vec2(base, pulse);
        } else {
            return vec2(15.0, 8.0);
        }
    }
    
    // Calculate global brightness multiplier
    float calculateGlobalBrightness(float time) {
        if (time < 5.0) {
            return 0.0;
        } else if (time < 12.0) {
            float progress = (time - 5.0) / 7.0;
            return 0.3 + progress * 0.4;
        } else {
            return 0.8;
        }
    }
    
    // Apply color enhancements
    vec3 enhanceColor(vec3 color, float pulseEffect) {
        vec3 enhanced = pow(color, vec3(0.9));
        enhanced *= (1.0 + pulseEffect * 0.3);
        
        float warmth = 0.95 + pulseEffect * 0.1;
        enhanced.r *= warmth;
        enhanced.b *= (2.0 - warmth);
        
        return enhanced;
    }

    void main() { 
        float pulseEffect = calculatePulse(uTime, uPulseFrequency);
        vec2 brightnessValues = calculateBrightness(uTime);
        float brightness = brightnessValues.x + pulseEffect * brightnessValues.y;
        
        vec3 finalColor = enhanceColor(vColor, pulseEffect);
        float globalBrightness = calculateGlobalBrightness(uTime);
        
        // Apply reveal factor (complete invisibility when 0)
        float revealBrightness = vRevealFactor <= 0.0 ? 0.0 : vRevealFactor;
        
        float finalBrightness = globalBrightness * revealBrightness;
        
        gl_FragColor = vec4(finalColor * brightness * finalBrightness, 1.0);
    }
`

// Body shader configuration
const BODY_CONFIG = {
  GRADIENT_STRENGTH: 0.3,
  NORMAL_ENHANCEMENT: 0.2,

  // Phase colors
  HIDDEN_COLOR: [0.0, 0.0, 0.0],
  REVEAL_WARM_BASE: [0.1, 0.08, 0.06],
  FLIGHT_BRIGHTNESS: 0.15,

  // Brightness multipliers
  REVEAL_BRIGHTNESS_FACTOR: 0.3,
  BODY_DARKNESS: 0.4,
}

// Body shader - controls drone body appearance (dark physical parts)
export const bodyShaderFS = /*glsl*/ `
    uniform vec3 uSunlightDirection;
    uniform float uAmbientLight;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vAwakeningFactor;
    varying float vRevealFactor;
    
    // Calculate lighting effects
    float calculateLighting(vec3 normal, vec3 sunDirection, float ambient) {
        float directional = max(0.0, dot(normal, sunDirection));
        return directional + ambient;
    }
    
    // Calculate height-based gradient
    vec3 applyHeightGradient(vec3 baseColor, vec3 position, vec3 normal) {
        float heightFactor = clamp((position.y + 50.0) / 400.0, 0.0, 1.0);
        vec3 gradientColor = baseColor * (0.8 + heightFactor * 0.3);
        
        float normalGradient = max(0.0, normal.y);
        return gradientColor * (0.9 + normalGradient * 0.2);
    }
    
    // Calculate phase-specific color
    vec3 calculatePhaseColor(float time, vec3 baseColor, vec3 position) {
        if (time < 5.0) {
            return vec3(0.0, 0.0, 0.0);
        } else if (time < 12.0) {
            vec3 darkWarmBase = vec3(0.1, 0.08, 0.06);
            float heightFactor = clamp((position.y + 50.0) / 400.0, 0.0, 1.0);
            return darkWarmBase * (0.5 + heightFactor * 0.1);
        } else {
            return baseColor * 0.15;
        }
    }

    void main() { 
        float lighting = calculateLighting(vNormal, uSunlightDirection, uAmbientLight);
        vec3 gradientColor = applyHeightGradient(vColor, vPosition, vNormal);
        vec3 finalColor = calculatePhaseColor(uTime, gradientColor, vPosition);
        
        // Apply reveal factor with professional darkness
        float revealBrightness = vRevealFactor <= 0.0 ? 0.0 : vRevealFactor * 0.3;
        
        gl_FragColor = vec4(finalColor * lighting * revealBrightness * 0.4, 1.0);
    }
`
