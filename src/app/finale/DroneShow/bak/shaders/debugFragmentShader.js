// Debug fragment shader with early countdown timing and obvious effects
import { buildShader } from './shaderUtils.js'

const DEBUG_LIGHT_SHADER_MAIN = /*glsl*/ `
  uniform float uTime;
  uniform float uPulseFrequency;
  varying vec3 vColor;
  varying vec3 vPosition;
  
  // ===== DEBUG COUNTDOWN SYSTEM =====
  
  // Get current countdown digit - STARTS AT 10 SECONDS for debugging
  float getCurrentDigit(float time) {
    float countdownStart = 10.0; // DEBUG: Start at 10s instead of 40s
    float countdownEnd = 20.0;   // DEBUG: End at 20s instead of 50s
    
    if (time < countdownStart || time >= countdownEnd) {
      return -1.0; // No countdown active
    }
    
    float countdownProgress = time - countdownStart;
    float digit = max(1.0, ceil(10.0 - countdownProgress));
    return digit > 10.0 ? 10.0 : digit;
  }
  
  // Simplified digit patterns for debugging - just test digit "5"
  bool getDigitPixel(float digit, int row, int col) {
    // For debugging, let's make a simple "5" pattern that's very obvious
    if (digit == 5.0) {
      // Top horizontal bar
      if (row >= 4 && row <= 7 && col >= 8 && col <= 24) {
        return true;
      }
      // Middle horizontal bar
      if (row >= 14 && row <= 17 && col >= 8 && col <= 24) {
        return true;
      }
      // Bottom horizontal bar
      if (row >= 25 && row <= 28 && col >= 8 && col <= 24) {
        return true;
      }
      // Top left vertical
      if (row >= 7 && row <= 14 && col >= 8 && col <= 11) {
        return true;
      }
      // Bottom right vertical
      if (row >= 17 && row <= 25 && col >= 21 && col <= 24) {
        return true;
      }
    }
    
    // For other digits, just make a simple cross pattern for debugging
    if (digit > 0.0) {
      // Vertical line
      if (col >= 15 && col <= 17 && row >= 8 && row <= 24) {
        return true;
      }
      // Horizontal line
      if (row >= 15 && row <= 17 && col >= 8 && col <= 24) {
        return true;
      }
    }
    
    return false;
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
        // DEBUG: Make countdown VERY obvious
        // Convert normalized coordinates to 32x32 grid position
        int gridRow = int(floor(normalizedY * 32.0));
        int gridCol = int(floor(normalizedX * 32.0));
        
        // Clamp to valid grid bounds
        gridRow = clamp(gridRow, 0, 31);
        gridCol = clamp(gridCol, 0, 31);
        
        bool isLit = getDigitPixel(currentDigit, gridRow, gridCol);
        
        if (isLit) {
          // SUPER BRIGHT WHITE for countdown digits
          finalColor = vec3(1.0, 1.0, 1.0);
          brightness = 200.0; // VERY bright
        } else {
          // VERY DARK for non-digit areas during countdown
          finalColor = vec3(0.0, 0.0, 0.0);
          brightness = 0.1; // Almost black
        }
      } else {
        // PATTERN MODE: Simple solid color for debugging
        if (uTime < 10.0) {
          // Before countdown: solid blue
          finalColor = vec3(0.0, 0.5, 1.0);
          brightness = 30.0;
        } else {
          // After countdown: solid green
          finalColor = vec3(0.0, 1.0, 0.5);
          brightness = 30.0;
        }
      }
    }
    
    // Apply global brightness control
    float globalBrightness = showPatterns ? 1.0 : 0.1;
    
    gl_FragColor = vec4(finalColor * brightness * globalBrightness, 1.0); 
  }
`

export const debugLightShaderFS = buildShader(DEBUG_LIGHT_SHADER_MAIN, ['HSL_TO_RGB'])
