// Refactored fragment shaders with modular structure
import { buildShader } from './shaderUtils.js'

// Light shader with pattern system and countdown digits
const LIGHT_SHADER_MAIN = /*glsl*/ `
  uniform float uTime;
  uniform float uPulseFrequency;
  varying vec3 vColor;
  varying vec3 vPosition;
  
  // ===== COUNTDOWN DIGIT SYSTEM =====
  
  // Get current countdown digit (10 to 1, then null)
  float getCurrentDigit(float time) {
    float countdownStart = 40.0;
    float countdownEnd = 50.0;
    
    if (time < countdownStart || time >= countdownEnd) {
      return -1.0; // No countdown active
    }
    
    float countdownProgress = time - countdownStart;
    float digit = max(1.0, ceil(10.0 - countdownProgress));
    return digit > 10.0 ? 10.0 : digit;
  }
  
  // Check if a 32x32 grid position should be lit for the given digit
  bool getDigitPixel(float digit, int row, int col) {
    if (digit == 1.0) {
      // Digit 1: Vertical line on right with top angle
      if ((col >= 18 && col <= 21 && row >= 4 && row <= 28) ||
          (row >= 4 && row <= 8 && col >= 15 && col <= 18)) {
        return true;
      }
    } else if (digit == 2.0) {
      // Digit 2: Z-shape
      if ((row >= 4 && row <= 7 && col >= 8 && col <= 24) ||
          (row >= 14 && row <= 17 && col >= 8 && col <= 24) ||
          (row >= 25 && row <= 28 && col >= 8 && col <= 24) ||
          (row >= 7 && row <= 14 && col >= 21 && col <= 24) ||
          (row >= 17 && row <= 25 && col >= 8 && col <= 11)) {
        return true;
      }
    } else if (digit == 3.0) {
      // Digit 3: Right side with all horizontal bars
      if ((row >= 4 && row <= 7 && col >= 8 && col <= 24) ||
          (row >= 14 && row <= 17 && col >= 8 && col <= 24) ||
          (row >= 25 && row <= 28 && col >= 8 && col <= 24) ||
          (row >= 7 && row <= 25 && col >= 21 && col <= 24)) {
        return true;
      }
    } else if (digit == 4.0) {
      // Digit 4: Left top, middle bar, right side
      if ((row >= 14 && row <= 17 && col >= 8 && col <= 24) ||
          (row >= 4 && row <= 14 && col >= 8 && col <= 11) ||
          (row >= 4 && row <= 28 && col >= 21 && col <= 24)) {
        return true;
      }
    } else if (digit == 5.0) {
      // Digit 5: S-shape
      if ((row >= 4 && row <= 7 && col >= 8 && col <= 24) ||
          (row >= 14 && row <= 17 && col >= 8 && col <= 24) ||
          (row >= 25 && row <= 28 && col >= 8 && col <= 24) ||
          (row >= 7 && row <= 14 && col >= 8 && col <= 11) ||
          (row >= 17 && row <= 25 && col >= 21 && col <= 24)) {
        return true;
      }
    } else if (digit == 6.0) {
      // Digit 6: Like 5 but with bottom left
      if ((row >= 4 && row <= 7 && col >= 8 && col <= 24) ||
          (row >= 14 && row <= 17 && col >= 8 && col <= 24) ||
          (row >= 25 && row <= 28 && col >= 8 && col <= 24) ||
          (row >= 7 && row <= 25 && col >= 8 && col <= 11) ||
          (row >= 17 && row <= 25 && col >= 21 && col <= 24)) {
        return true;
      }
    } else if (digit == 7.0) {
      // Digit 7: Top bar and right side
      if ((row >= 4 && row <= 7 && col >= 8 && col <= 24) ||
          (row >= 7 && row <= 28 && col >= 21 && col <= 24)) {
        return true;
      }
    } else if (digit == 8.0) {
      // Digit 8: Full 7-segment
      if ((row >= 4 && row <= 7 && col >= 8 && col <= 24) ||
          (row >= 14 && row <= 17 && col >= 8 && col <= 24) ||
          (row >= 25 && row <= 28 && col >= 8 && col <= 24) ||
          (row >= 7 && row <= 25 && col >= 8 && col <= 11) ||
          (row >= 7 && row <= 25 && col >= 21 && col <= 24)) {
        return true;
      }
    } else if (digit == 9.0) {
      // Digit 9: Like 8 but no bottom left
      if ((row >= 4 && row <= 7 && col >= 8 && col <= 24) ||
          (row >= 14 && row <= 17 && col >= 8 && col <= 24) ||
          (row >= 25 && row <= 28 && col >= 8 && col <= 24) ||
          (row >= 7 && row <= 14 && col >= 8 && col <= 11) ||
          (row >= 7 && row <= 25 && col >= 21 && col <= 24)) {
        return true;
      }
    } else if (digit == 10.0) {
      // Digit 10: "1" and "0" side by side
      // Left side: "1" (cols 10-13)
      if ((col >= 10 && col <= 13 && row >= 4 && row <= 28) ||
          (row >= 4 && row <= 8 && col >= 7 && col <= 10)) {
        return true;
      }
      // Right side: "0" (cols 19-26)
      if ((col >= 19 && col <= 26 && row >= 4 && row <= 7) ||
          (col >= 19 && col <= 26 && row >= 25 && row <= 28) ||
          (row >= 7 && row <= 25 && col >= 19 && col <= 22) ||
          (row >= 7 && row <= 25 && col >= 23 && col <= 26)) {
        return true;
      }
    }
    
    return false;
  }
  
  // ===== ANIMATED PATTERN SYSTEM =====
  
  vec3 getAnimatedPattern(float x, float y, float time) {
    float patternTime = mod(time, 30.0);
    
    if (patternTime < 5.0) {
      // Pattern 1: Ripple waves from center
      float distance = length(vec2(x - 0.5, y - 0.5));
      float wave = sin(distance * 15.0 - time * 6.0) * 0.5 + 0.5;
      return vec3(0.2 + wave * 0.8, 0.8, 1.0); // Blue to cyan waves
      
    } else if (patternTime < 10.0) {
      // Pattern 2: Rotating spiral
      float angle = atan(y - 0.5, x - 0.5);
      float radius = length(vec2(x - 0.5, y - 0.5));
      float spiral = sin(angle * 4.0 + radius * 20.0 - time * 5.0) * 0.5 + 0.5;
      return vec3(1.0, 0.3 + spiral * 0.7, 1.0); // Purple to magenta spiral
      
    } else if (patternTime < 15.0) {
      // Pattern 3: Plasma effect
      float plasma = sin(x * 8.0 + time * 3.0) + 
                    sin(y * 10.0 + time * 2.5) + 
                    sin((x + y) * 6.0 + time * 4.0);
      plasma = (plasma + 3.0) / 6.0;
      return vec3(1.0, 0.5 + plasma * 0.5, 0.2 + plasma * 0.8); // Orange to yellow plasma
      
    } else if (patternTime < 20.0) {
      // Pattern 4: Pulsing circles with moving center
      float centerX = 0.5 + sin(time * 1.2) * 0.3;
      float centerY = 0.5 + cos(time * 1.5) * 0.3;
      float distance = length(vec2(x - centerX, y - centerY));
      float pulse = sin(distance * 25.0 - time * 8.0) * 0.5 + 0.5;
      return vec3(0.2 + pulse * 0.8, 1.0, 0.3 + pulse * 0.7); // Green to yellow pulses
      
    } else if (patternTime < 25.0) {
      // Pattern 5: Dynamic checkerboard
      float checker = step(0.5, mod(x * 12.0 + time * 2.0, 1.0)) * 
                     step(0.5, mod(y * 12.0 + time * 1.5, 1.0));
      return vec3(1.0, checker * 0.5, checker); // Red to pink checkerboard
      
    } else {
      // Pattern 6: Diagonal waves
      float diagonal = (x + y) * 0.5;
      float wave = sin(diagonal * 20.0 - time * 6.0) * 0.5 + 0.5;
      return vec3(0.8 + wave * 0.2, 0.4 + wave * 0.6, 1.0); // Light blue to white waves
    }
  }
  
  float getPatternBrightness(float x, float y, float time) {
    float patternTime = mod(time, 30.0);
    
    if (patternTime < 5.0) {
      float distance = length(vec2(x - 0.5, y - 0.5));
      float wave = sin(distance * 15.0 - time * 6.0) * 0.5 + 0.5;
      return 25.0 + wave * 25.0;
    } else if (patternTime < 10.0) {
      float angle = atan(y - 0.5, x - 0.5);
      float radius = length(vec2(x - 0.5, y - 0.5));
      float spiral = sin(angle * 4.0 + radius * 20.0 - time * 5.0) * 0.5 + 0.5;
      return 20.0 + spiral * 30.0;
    } else if (patternTime < 15.0) {
      float plasma = sin(x * 8.0 + time * 3.0) + 
                    sin(y * 10.0 + time * 2.5) + 
                    sin((x + y) * 6.0 + time * 4.0);
      plasma = (plasma + 3.0) / 6.0;
      return 15.0 + plasma * 35.0;
    } else if (patternTime < 20.0) {
      float centerX = 0.5 + sin(time * 1.2) * 0.3;
      float centerY = 0.5 + cos(time * 1.5) * 0.3;
      float distance = length(vec2(x - centerX, y - centerY));
      float pulse = sin(distance * 25.0 - time * 8.0) * 0.5 + 0.5;
      return 20.0 + pulse * 30.0;
    } else if (patternTime < 25.0) {
      float checker = step(0.5, mod(x * 12.0 + time * 2.0, 1.0)) * 
                     step(0.5, mod(y * 12.0 + time * 1.5, 1.0));
      return 25.0 + checker * 20.0;
    } else {
      float diagonal = (x + y) * 0.5;
      float wave = sin(diagonal * 20.0 - time * 6.0) * 0.5 + 0.5;
      return 20.0 + wave * 30.0;
    }
  }
  
  // Check if this drone is part of the pattern display area
  bool isPatternDrone(vec3 pos) {
    bool inXRange = (pos.x >= -200.0 && pos.x <= 200.0);
    bool inYRange = (pos.y >= 200.0 && pos.y <= 600.0);
    bool inZRange = (abs(pos.z) < 50.0);
    return (inXRange && inYRange && inZRange);
  }
  
  void main() { 
    float h = (sin(uTime * uPulseFrequency) + 1.0) / 2.0; 
    h = pow(h, 3.0);
    
    bool showPatterns = isPatternDrone(vPosition);
    
    float brightness = 10.0 + h * 5.0;
    vec3 finalColor = vColor;
    
    if (showPatterns) {
      // Get normalized coordinates for patterns (0-1 range)
      float normalizedX = (vPosition.x + 200.0) / 400.0;
      float normalizedY = (vPosition.y - 200.0) / 400.0;
      
      normalizedX = clamp(normalizedX, 0.0, 1.0);
      normalizedY = clamp(normalizedY, 0.0, 1.0);
      
      // Check if countdown is active - digits take priority over patterns
      float currentDigit = getCurrentDigit(uTime);
      
      if (currentDigit > 0.0) {
        // COUNTDOWN MODE: Show digits
        // Convert normalized coordinates to 32x32 grid position
        int gridRow = int(floor(normalizedY * 32.0));
        int gridCol = int(floor(normalizedX * 32.0));
        
        // Clamp to valid grid bounds
        gridRow = clamp(gridRow, 0, 31);
        gridCol = clamp(gridCol, 0, 31);
        
        bool isLit = getDigitPixel(currentDigit, gridRow, gridCol);
        
        if (isLit) {
          // Bright white for countdown digits
          finalColor = vec3(1.0, 1.0, 1.0);
          brightness = 100.0; // Very bright
        } else {
          // Very dark for non-digit areas during countdown
          finalColor = vec3(0.02, 0.02, 0.02);
          brightness = 1.0; // Minimal brightness
        }
      } else {
        // PATTERN MODE: Show animated patterns (when no countdown)
        finalColor = getAnimatedPattern(normalizedX, normalizedY, uTime);
        brightness = getPatternBrightness(normalizedX, normalizedY, uTime);
      }
    }
    
    // Apply global brightness control
    float globalBrightness = showPatterns ? 1.0 : 0.3;
    
    gl_FragColor = vec4(finalColor * brightness * globalBrightness, 1.0); 
  }
`

// Body shader
const BODY_SHADER_MAIN = /*glsl*/ `
  uniform vec3 uSunlightDirection;
  uniform float uAmbientLight;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying vec3 vPosition;
  
  void main() { 
    float d = max(0.0, dot(vNormal, uSunlightDirection)); 
    float lighting = d + uAmbientLight;
    vec3 finalColor = vColor;
    
    // Global color control - synchronized with vertex shader phases
    if (isCountdownActive(uTime)) {
      finalColor = vec3(0.02, 0.02, 0.02); // Very dark during countdown
      lighting = 0.3; // Minimal lighting
    } else if (uTime >= 30.0) {
      // After dome formation complete: gradually dim drone bodies
      float domeCompleteTime = 30.0;
      float countdownStartTime = 40.0;
      float fadeProgress = (uTime - domeCompleteTime) / (countdownStartTime - domeCompleteTime);
      float dimFactor = 1.0 - (fadeProgress * 0.95);
      
      finalColor = finalColor * dimFactor;
      lighting = lighting * (0.5 + dimFactor * 0.5);
    }
    
    gl_FragColor = vec4(finalColor * lighting * 0.8, 1.0);
  }
`

// Simple glow shader
const GLOW_SHADER_MAIN = /*glsl*/ `
  void main() { 
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); 
  }
`

export const lightShaderFS = buildShader(LIGHT_SHADER_MAIN, ['HSL_TO_RGB'])
export const bodyShaderFS = buildShader(BODY_SHADER_MAIN, [])
export const glowShaderFS = buildShader(GLOW_SHADER_MAIN, [])
