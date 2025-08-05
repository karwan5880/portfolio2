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
    
    // Simple fade transition between texts - no colorful effects
    vec3 calculateSimpleFade(float time, float row, float col, float droneId) {
        // Just return dim background color during transitions
        return vec3(0.001, 0.001, 0.001); // Very dim, almost off
    }
    
    // Simple pause between texts - no carnival effects
    vec3 calculateTextPause(float time, float row, float col, float droneId) {
        // Just return dim background color during pauses
        return vec3(0.001, 0.001, 0.001); // Very dim, almost off
    }
    
    // Spiral wipe transition - colors spiral from center outward (using texture coordinates)
    vec3 calculateSpiralWipe(float time, float row, float col, float droneId) {
        float animTime = time - 102.0; // 0 to 2 seconds
        
        // Use texture coordinates for proper rectangle mapping
        vec2 textureCoord = calculateTextureCoordinates(row, col);
        float textureX = textureCoord.x * 127.0; // 0-127 range
        float textureY = textureCoord.y * 31.0;  // 0-31 range
        
        // Calculate position relative to center using texture coordinates
        float centerX = 63.5;  // Center of 128-wide rectangle
        float centerY = 15.5;  // Center of 32-high rectangle
        float deltaX = textureX - centerX;
        float deltaY = textureY - centerY;
        
        // Calculate angle and distance from center
        float angle = atan(deltaY, deltaX) + 3.14159; // 0 to 2π
        float distance = sqrt(deltaX * deltaX + deltaY * deltaY);
        float maxDistance = sqrt(63.5 * 63.5 + 15.5 * 15.5);
        float normalizedDistance = distance / maxDistance;
        
        // Spiral progress
        float spiralProgress = mod(angle / 6.28318 + animTime * 2.0, 1.0);
        float waveProgress = animTime / 2.0;
        
        // Color based on spiral position
        if (spiralProgress < waveProgress) {
            float hue = mod(spiralProgress + normalizedDistance * 0.5, 1.0);
            return hsl2rgb(vec3(hue, 0.8, 0.7));
        } else {
            return vec3(0.01, 0.01, 0.01);
        }
    }
    
    // Emotional finale color - gentle, melancholic approach
    vec3 calculateFinaleColor(float time, float droneId, vec3 worldPosition) {
        float finaleTime = time - 137.0; // Time since finale started (updated timing)
        
        // Distance from camera (updated to match position shader)
        vec3 cameraPos = vec3(0.0, 50.0, 1000.0); // Updated to match dramatic dive
        float distanceToCamera = length(worldPosition - cameraPos);
        
        // Brightness increases as drones get closer to camera
        float proximityBrightness = 1.0 - clamp(distanceToCamera / 1000.0, 0.0, 1.0);
        
        // Very gentle breathing effect instead of harsh pulsing
        float breathe = (sin(finaleTime * 1.5 + droneId * 0.005) + 1.0) / 2.0;
        
        // Color shifts from emotional blue-white to soft warm white as they approach
        vec3 startColor = vec3(0.7, 0.8, 1.0); // Emotional blue-white from text
        vec3 endColor = vec3(1.0, 0.95, 0.9);  // Soft warm white (not harsh)
        
        vec3 finalColor = mix(startColor, endColor, proximityBrightness);
        
        // Gentle brightness increase for emotional finale
        float finalBrightness = 0.6 + proximityBrightness * 0.3 + breathe * 0.2;
        
        return finalColor * finalBrightness;
    }

    // Simple transition - just fade to dim
    vec3 calculateSimpleTransition(float time, float row, float col, float droneId) {
        // Just return dim background color during transitions
        return vec3(0.001, 0.001, 0.001); // Very dim, almost off
    }

    // Calculate rectangle formation target position (copied from position shader)
    vec3 calculateRectangleTarget(float row, float col) {
        bool isTopQuadrant = row >= 64.0;
        bool isLeftQuadrant = col < 16.0;
        
        // X position: row-based column positioning
        float columnIndex = isTopQuadrant ? (127.0 - row) : (63.0 - row);
        float quadrantXOffset = isLeftQuadrant ? -384.0 : 0.0;
        float finalX = 0.0 + quadrantXOffset + columnIndex * 6.0;
        
        // Y position: column-based with quadrant offset
        float colWithinQuadrant = isLeftQuadrant ? col : (col - 16.0);
        float quadrantYOffset = isTopQuadrant ? 8.0 : -8.0;
        float finalY = 150.0 + quadrantYOffset * 6.0 + colWithinQuadrant * 6.0;
        
        return vec3(finalX, finalY, 150.0);
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
    
    // Border Turn-Off transition - outer drones turn off progressively toward center with slow fade
    vec3 calculateBorderTurnOff(float time, float row, float col, float droneId) {
        float transitionTime = time - 85.0; // 0 to 4 seconds (85-89s)
        float transitionDuration = 4.0;
        
        // Use texture coordinates to determine position in rectangle
        vec2 textureCoord = calculateTextureCoordinates(row, col);
        float textureX = textureCoord.x * 127.0; // 0-127 range
        float textureY = textureCoord.y * 31.0;  // 0-31 range
        
        // Calculate distance from border (0 = on border, higher = toward center)
        float distanceFromBorder = min(
            min(textureX, 127.0 - textureX),
            min(textureY, 31.0 - textureY)
        );
        
        // Normalize distance (max distance to center is about 15.5)
        float maxDistanceToCenter = 15.5;
        float normalizedDistance = clamp(distanceFromBorder / maxDistanceToCenter, 0.0, 1.0);
        
        // Global brightness fade - all drones slowly fade over the entire duration
        float globalFade = 1.0 - (transitionTime / transitionDuration);
        globalFade = clamp(globalFade, 0.0, 1.0);
        
        // Calculate when this drone should turn off based on distance from border
        // Border drones turn off first (at 1s), center drones turn off last (at 3.5s)
        float turnOffStartTime = 1.0 + normalizedDistance * 2.5; // 1.0s to 3.5s range
        float turnOffDuration = 0.5; // Each drone takes 0.5s to fade out completely
        
        // Base orange-red color from rectangle formation
        vec3 orangeColor = vec3(1.0, 0.3, 0.1);
        
        if (transitionTime < turnOffStartTime) {
            // Still on - show orange color with global fade
            return orangeColor * globalFade;
        } else if (transitionTime < turnOffStartTime + turnOffDuration) {
            // Individual drone fading out
            float individualFadeProgress = (transitionTime - turnOffStartTime) / turnOffDuration;
            float individualFade = 1.0 - smoothstep(0.0, 1.0, individualFadeProgress);
            
            // Combine global fade with individual fade
            float combinedFade = globalFade * individualFade;
            return orangeColor * combinedFade;
        } else {
            // Completely off
            return vec3(0.001, 0.001, 0.001);
        }
    }

    // Gentle emotional border effects
    vec3 calculateTextBorder(float row, float col, float time, float textRevealProgress, vec2 textureCoord) {
        // Check if any text is currently active
        bool isTextActive = (time >= 90.0 && time < 100.0) ||  // 新年快乐
                           (time >= 101.0 && time < 111.0) ||  // 家承运昌
                           (time >= 112.0 && time < 122.0) ||  // 身安心安
                           (time >= 123.0);                    // 艺臻恬然 (continues forever)
        
        if (!isTextActive) return vec3(0.0, 0.0, 0.0);
        
        // Use texture coordinates to determine border - exactly one drone thick
        float textureX = textureCoord.x * 127.0; // Convert back to 0-127 range
        float textureY = textureCoord.y * 31.0;  // Convert back to 0-31 range
        
        // Check if this drone maps to the exact border of the text rectangle (128x32)
        bool isBorder = (textureX == 0.0 || textureX == 127.0 || textureY == 0.0 || textureY == 31.0);
        
        if (isBorder) {
            // Soft, emotional blue-white glow - like moonlight
            vec3 emotionalColor = vec3(0.7, 0.8, 1.0); // Soft blue-white
            
            // Very gentle breathing effect - slow and peaceful
            float breathe = (sin(time * 0.8) + 1.0) / 2.0; // Slow breathing rhythm
            float brightness = 0.3 + breathe * 0.2; // Subtle brightness variation (0.3-0.5)
            
            // Gentle fade based on distance from corners for organic feel
            float cornerFade = 1.0;
            float distFromCorner = min(
                min(textureX, 127.0 - textureX),
                min(textureY, 31.0 - textureY)
            ) / 10.0;
            cornerFade = clamp(distFromCorner, 0.7, 1.0); // Subtle corner softening
            
            // Return border color (fade-out handled externally)
            return emotionalColor * brightness * cornerFade * textRevealProgress;
        }
        
        return vec3(0.0, 0.0, 0.0); // No border
    }

    // Gentle emotional text reveal - slow, contemplative fade-in
    float calculateTextRevealProgress(float time, float characterIndex) {
        // Get current message timing - updated for longer, more emotional pacing
        float messageStartTime = 0.0;
        float revealDuration = 2.0; // 2 seconds to reveal all characters (slower)
        float characterDelay = 0.5; // 0.5 seconds between each character (more contemplative)
        
        // Determine current message start time with updated timing
        if (time >= 90.0 && time < 100.0) {
            messageStartTime = 90.0; // 新年快乐 (10s total: 8s display + 2s fade-out)
        } else if (time >= 101.0 && time < 111.0) {
            messageStartTime = 101.0; // 家承运昌 (10s total: 8s display + 2s fade-out)
        } else if (time >= 112.0 && time < 122.0) {
            messageStartTime = 112.0; // 身安心安 (10s total: 8s display + 2s fade-out)
        } else if (time >= 123.0) {
            messageStartTime = 123.0; // 艺臻恬然 (NO fade-out - stays visible during finale)
        } else {
            return 0.0; // No text active
        }
        
        // Calculate when this character should start appearing
        float characterStartTime = messageStartTime + characterIndex * characterDelay;
        float characterEndTime = characterStartTime + 1.0; // 1 second to fully appear (gentle)
        
        if (time < characterStartTime) {
            return 0.0; // Not yet time for this character
        } else if (time >= characterEndTime) {
            return 1.0; // Character fully revealed
        } else {
            // Character is in the process of appearing - very gentle fade
            float progress = (time - characterStartTime) / 1.0;
            return smoothstep(0.0, 1.0, progress * progress); // Extra smooth, emotional fade-in
        }
    }

    // Calculate unified fade-out multiplier for text messages
    float calculateTextFadeMultiplier(float time) {
        float fadeOutDuration = 2.0; // 2 seconds for gentle fade-out
        
        if (time >= 90.0 && time < 100.0) {
            // 新年快乐 (90-100s with fade-out)
            if (time >= 98.0) {
                return 1.0 - ((time - 98.0) / fadeOutDuration);
            }
            return 1.0;
        } else if (time >= 101.0 && time < 111.0) {
            // 家承运昌 (101-111s with fade-out)
            if (time >= 109.0) {
                return 1.0 - ((time - 109.0) / fadeOutDuration);
            }
            return 1.0;
        } else if (time >= 112.0 && time < 122.0) {
            // 身安心安 (112-122s with fade-out)
            if (time >= 120.0) {
                return 1.0 - ((time - 120.0) / fadeOutDuration);
            }
            return 1.0;
        } else if (time >= 123.0) {
            // 艺臻恬然 (123s+ NO fade-out - stays visible during finale)
            return 1.0;
        }
        
        return 0.0; // No text active
    }

    // Enhanced text color calculation with animated reveal
    vec3 calculateTextColor(vec2 textureCoord, vec3 baseTextColor, float droneId, float time) {
        vec4 textSample = texture2D(uTextTexture, textureCoord);
        float textIntensity = textSample.r;
        
        // Calculate which character grid this drone belongs to (0-3 for 4 characters)
        float row = floor(droneId / GRID_COLS);
        float col = mod(droneId, GRID_COLS);
        
        // More precise character detection for 32x32 grids
        float preciseCharIndex = 0.0;
        if (col >= 24.0) preciseCharIndex = 3.0;      // Character 4: columns 24-31
        else if (col >= 16.0) preciseCharIndex = 2.0; // Character 3: columns 16-23  
        else if (col >= 8.0) preciseCharIndex = 1.0;  // Character 2: columns 8-15
        else preciseCharIndex = 0.0;                  // Character 1: columns 0-7
        
        // Calculate text reveal animation progress
        float textRevealProgress = calculateTextRevealProgress(time, preciseCharIndex);
        
        // Calculate unified fade-out multiplier
        float textFadeMultiplier = calculateTextFadeMultiplier(time);
        
        // Apply reveal animation and fade-out
        if (textRevealProgress <= 0.0 || textFadeMultiplier <= 0.0) {
            // Character not yet revealed or completely faded out
            return vec3(0.001, 0.001, 0.001);
        }
        
        // Enhanced brightness mapping for smoother text
        vec3 finalTextColor;
        if (textIntensity >= 0.9) {
            // Full brightness text pixels
            finalTextColor = baseTextColor;
        } else if (textIntensity >= 0.6) {
            // High brightness - anti-aliasing edges
            finalTextColor = baseTextColor * 0.9;
        } else if (textIntensity >= 0.3) {
            // Medium brightness - soft edges
            finalTextColor = baseTextColor * 0.6;
        } else if (textIntensity >= 0.15) {
            // Low brightness - very soft edges
            finalTextColor = baseTextColor * 0.3;
        } else {
            // Background - almost invisible like dark Chongqing night
            finalTextColor = vec3(0.001, 0.001, 0.001);
        }
        
        // Check if this drone should show border using texture coordinates
        vec3 borderColor = calculateTextBorder(row, col, time, textRevealProgress, textureCoord);
        if (borderColor.r > 0.01 || borderColor.g > 0.01 || borderColor.b > 0.01) {
            return borderColor * textFadeMultiplier; // Apply fade-out to border too
        }
        
        // Apply reveal animation fade-in and fade-out
        return finalTextColor * textRevealProgress * textFadeMultiplier;
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
                // Rectangle formation phase (52-85s) then border turn-off (85-89s)
                if (time < 85.0) {
                    // Calculate target rectangle position for this drone
                    vec3 targetPos = calculateRectangleTarget(row, col);
                    
                    // Calculate current position (we need to replicate the movement logic)
                    vec3 currentPos = worldPosition;
                    
                    // Calculate distance to target position
                    float distanceToTarget = length(currentPos - targetPos);
                    
                    // Normalize distance (assume max distance is around 800 units from split formation)
                    float maxDistance = 800.0;
                    float normalizedDistance = clamp(distanceToTarget / maxDistance, 0.0, 1.0);
                    
                    // Invert so 0 = at target, 1 = far from target
                    float progressToTarget = 1.0 - normalizedDistance;
                    
                    // Add some randomness per drone for visual variety
                    float randomOffset = (random(droneId * 0.001) - 0.5) * 0.2;
                    float adjustedProgress = clamp(progressToTarget + randomOffset, 0.0, 1.0);
                    
                    // Position-based color transition: Far → Close to target
                    vec3 farColor = vec3(0.0, 0.8, 0.9);      // Bright cyan (far from target)
                    vec3 movingColor = vec3(0.2, 0.6, 0.8);   // Teal (moving)
                    vec3 approachColor = vec3(0.5, 0.4, 0.9); // Purple (approaching)
                    vec3 nearColor = vec3(1.0, 0.3, 0.1);     // Orange-red (near target)
                    
                    // Smooth multi-stage transition based on distance to target
                    vec3 finalColor;
                    if (adjustedProgress < 0.33) {
                        // Far to Moving (0-33%)
                        float localProgress = adjustedProgress / 0.33;
                        finalColor = mix(farColor, movingColor, localProgress);
                    } else if (adjustedProgress < 0.66) {
                        // Moving to Approaching (33-66%)
                        float localProgress = (adjustedProgress - 0.33) / 0.33;
                        finalColor = mix(movingColor, approachColor, localProgress);
                    } else {
                        // Approaching to Near Target (66-100%)
                        float localProgress = (adjustedProgress - 0.66) / 0.34;
                        finalColor = mix(approachColor, nearColor, localProgress);
                    }
                    
                    return finalColor;
                } else if (time >= 85.0 && time < 89.0) {
                    // Border Turn-Off transition (85-89s) - outer drones turn off progressively toward center with fade
                    return calculateBorderTurnOff(time, row, col, droneId);
                } else {
                    // Simple transitions - no colorful effects, just dim background
                    if (time >= 98.0 && time < 101.0) {
                        // Pause between first and second text (98-101s) - 3 seconds
                        return vec3(0.001, 0.001, 0.001);
                    } else if (time >= 109.0 && time < 112.0) {
                        // Pause between second and third text (109-112s) - 3 seconds
                        return vec3(0.001, 0.001, 0.001);
                    } else if (time >= 120.0 && time < 123.0) {
                        // Pause between third and fourth text (120-123s) - 3 seconds
                        return vec3(0.001, 0.001, 0.001);
                    } else {
                        // Default background - almost invisible
                        return vec3(0.001, 0.001, 0.001);
                    }
                }
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
