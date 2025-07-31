// Simplified drone render shader

// Main rendering vertex shader with simple colors
export const droneRenderShaderVS = /*glsl*/ `
    uniform sampler2D uPositionTexture;
    uniform float uTime;
    uniform float uInstanceScale;
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

    vec3 hsl2rgb(vec3 c) { 
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); 
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0)); 
    }
    
    mat4 createMatrix(vec3 p, float s) { 
        return mat4(s,0,0,0, 0,s,0,0, 0,0,s,0, p.x,p.y,p.z,1.0); 
    }

    // Improved rainbow column color system with proper dim phase
    vec3 getRainbowColumnColor(float droneId, float time, float revealFactor, vec3 worldPosition) {
        // Fix: Use correct grid dimensions (128 rows × 32 columns)
        float row = floor(droneId / GRID_COLS); // droneId / 32.0
        float col = mod(droneId, GRID_COLS);    // mod(droneId, 32.0)
        
        // PROFESSIONAL DRONE SHOW: No distance dimming like real shows
        // Real drone shows maintain consistent brightness regardless of distance
        float distanceBrightness = 1.0; // Always full brightness like professional shows
        
        // BEAUTIFUL RAINBOW COLORS: Smooth spectrum across all 32 columns
        vec3 rainbowColor;
        
        // Create deep, rich rainbow transitions across all 32 columns
        float hue = col / 31.0; // 0 to 1 across all columns for full spectrum
        float saturation = 1.0; // Maximum saturation for deep, rich colors
        float lightness = 0.5;  // Medium lightness for deep, saturated colors (not washed out)
        
        // Convert HSL to RGB for smooth rainbow spectrum
        vec3 hslColor = vec3(hue, saturation, lightness);
        rainbowColor = hsl2rgb(hslColor);
        
        // Add special pink highlights at favorite positions (keeping your preference!)
        if (col == 8.0) {
            rainbowColor = vec3(1.0, 0.4, 0.7); // Beautiful Pink at column 8
        } else if (col == 24.0) {
            rainbowColor = vec3(1.0, 0.4, 0.7); // Another Pink at column 24
        }
        // Note: Removed white center to let rainbow flow naturally, but kept pink highlights
        
        // Apply distance brightness but keep colors pure and saturated
        rainbowColor = rainbowColor * distanceBrightness;
        
        // FOCUS SYSTEM: Dim side groups to highlight center formations
        float focusBrightness = 1.0;
        if (time > 15.0 && time < 105.0) { // Only during flight phase, NOT during rainbow formation
            // Calculate distance from center (X=0) to determine if drone is in side groups
            float distanceFromCenter = abs(worldPosition.x);
            
            if (distanceFromCenter > 150.0) { // Side groups are at X = ±300
                // Dim side groups significantly to focus attention on center
                focusBrightness = 0.3; // 70% dimmer than center formations
            }
        }
        
        rainbowColor = rainbowColor * focusBrightness;
        
        // Boss's simple color system - dim warm glow for reveal phase
        vec3 dimGlow = vec3(0.8, 0.6, 0.4) * 0.6; // Dim warm glow (no bloom)
        
        // Simple color logic based on reveal factor
        if (revealFactor <= 0.0) {
            // Completely hidden
            return vec3(0.0, 0.0, 0.0);
        } else if (time < 15.0) {
            // Column reveal phase (5-15s): Only dim warm glow - EXTENDED
            return dimGlow * revealFactor;
        } else {
            // Flight phase (15s+): Rainbow colors for flying drones - DELAYED
            return rainbowColor;
        }
    }
    
    // Boss's simple awakening system - no complex timing
    float getDroneAwakeningFactor(float droneId, float time) {
        if (time < 5.0) {
            return 0.0; // Completely hidden
        } else if (time < 15.0) {
            return 1.0; // Revealed with dim light - EXTENDED
        } else {
            return 1.0; // Flying drones - DELAYED
        }
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

// Simplified light shader
export const lightShaderFS = /*glsl*/ `
    uniform float uTime;
    uniform float uPulseFrequency;
    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vAwakeningFactor;
    varying float vRevealFactor;
    
    // Function to check if a drone should be lit for digit "8" pattern
    float getDigit8Pattern(vec3 worldPosition, float uTime) {
        // Only apply digit pattern to vertical square plane drones
        if (uTime < 155.0) return 1.0; // Before vertical square formation, all lights normal
        
        // Check if this drone is in the vertical square plane area
        float squarePlaneSize = 120.0;
        float gridSpacing = squarePlaneSize / 8.0; // 15 units spacing
        
        // Convert world position to grid coordinates
        float gridX = (worldPosition.x / gridSpacing) + 3.5; // 0-7 grid coordinates
        float gridY = (worldPosition.y - 350.0) / gridSpacing + 3.5; // 0-7 grid coordinates
        
        // Check if position is within the 8x8 grid bounds
        if (gridX < 0.0 || gridX >= 8.0 || gridY < 0.0 || gridY >= 8.0) {
            return 1.0; // Not in grid, normal lighting
        }
        
        // Check if this drone is actually part of the vertical square plane formation
        // If it's in the square plane area but not participating, turn it off
        if (abs(worldPosition.x) <= squarePlaneSize/2.0 && 
            abs(worldPosition.y - 350.0) <= squarePlaneSize/2.0 && 
            abs(worldPosition.z) <= 10.0) {
            // This drone is in the vertical square plane area, apply digit pattern
        } else {
            return 1.0; // Not in square plane area, normal lighting
        }
        
        // Round to integer grid positions
        int gX = int(gridX + 0.5);
        int gY = int(gridY + 0.5);
        
        // Digit "8" pattern in 8x8 grid (Y=0 is bottom, Y=7 is top)
        // Clear "8" pattern - two stacked circles
        bool isLit = false;
        
        // Create a clear "8" pattern
        // Top horizontal lines
        if (gY == 6 && gX >= 2 && gX <= 5) isLit = true; // Top horizontal
        if (gY == 0 && gX >= 2 && gX <= 5) isLit = true; // Bottom horizontal
        
        // Middle horizontal line
        if (gY == 3 && gX >= 2 && gX <= 5) isLit = true; // Middle horizontal
        
        // Left vertical lines
        if (gX == 1 && (gY == 1 || gY == 2)) isLit = true; // Bottom left vertical
        if (gX == 1 && (gY == 4 || gY == 5)) isLit = true; // Top left vertical
        
        // Right vertical lines  
        if (gX == 6 && (gY == 1 || gY == 2)) isLit = true; // Bottom right vertical
        if (gX == 6 && (gY == 4 || gY == 5)) isLit = true; // Top right vertical
        
        return isLit ? 1.0 : 0.0; // 1.0 = lit, 0.0 = dark
    }
    
    void main() { 
        // PROFESSIONAL: Minimal pulsing for consistent appearance like real shows
        float primaryPulse = (sin(uTime * uPulseFrequency * 0.5) + 1.0) / 2.0; // Slower pulse
        float h = primaryPulse * 0.3; // Much subtler pulsing effect
        h = pow(h, 0.8); // Gentler curve
        
        // Smart brightness control that works with adaptive bloom
        float baseBrightness = 20.0;
        float pulseBrightness = 40.0;
        
        // Boss's brightness control - simple and clean
        if (uTime < 5.0) {
            // Hidden phase: Complete darkness
            baseBrightness = 0.0;
            pulseBrightness = 0.0;
        } else if (uTime < 10.0) {
            // Column reveal phase: Dim light, NO BLOOM
            float revealProgress = (uTime - 5.0) / 5.0; // 0-1 over column reveal
            baseBrightness = 8.0 + revealProgress * 12.0; // 8-20 gentle ramp (reduced for no bloom)
            pulseBrightness = 10.0 + revealProgress * 15.0; // 10-25 gentle pulse (reduced for no bloom)
        } else {
            // Flight phase: CONTAINED brightness - no light pollution
            baseBrightness = 15.0; // Reduced from 40 to prevent bloom overflow
            pulseBrightness = 8.0; // Reduced from 20 for cleaner appearance
        }
        
        float brightness = baseBrightness + h * pulseBrightness;
        vec3 finalColor = vColor;
        
        finalColor = pow(finalColor, vec3(0.9));
        finalColor *= (1.0 + h * 0.3);
        
        float warmth = 0.95 + h * 0.1;
        finalColor.r *= warmth;
        finalColor.b *= (2.0 - warmth);
        
        // Boss's global brightness control - simple and effective
        float globalBrightness = 1.0;
        
        if (uTime < 5.0) {
            // Hidden phase: Complete darkness
            globalBrightness = 0.0;
        } else if (uTime < 10.0) {
            // Column reveal phase: Dim light buildup (NO BLOOM)
            float revealProgress = (uTime - 5.0) / 5.0; // 0-1 over reveal
            globalBrightness = 0.3 + revealProgress * 0.4; // 0.3 → 0.7 (dim, no bloom)
        } else {
            // Flight phase: CONTAINED brightness - crisp without bloom pollution
            globalBrightness = 0.8; // Reduced from 1.5 to prevent light overflow
            
            // FOCUS SYSTEM: Additional dimming for side groups in light shader
            float lightFocusBrightness = 1.0;
            if (uTime < 105.0) { // Only dim side groups before rainbow formation
                float distanceFromCenter = abs(vPosition.x);
                
                if (distanceFromCenter > 150.0) { // Side groups
                    lightFocusBrightness = 0.4; // Dim side group lights
                }
            }
            
            globalBrightness = globalBrightness * lightFocusBrightness;
        }
        
        // Fixed reveal system - completely hidden when reveal factor is 0
        float minVisibility = 0.0; // No minimum - allow complete invisibility
        float revealBrightness = max(minVisibility, vRevealFactor); // Use full reveal factor, not 0.8
        
        // Ensure complete invisibility when reveal factor is 0
        if (vRevealFactor <= 0.0) {
            revealBrightness = 0.0;
        }
        
        // Apply digit "8" pattern to vertical square plane drones
        float digitPattern = getDigit8Pattern(vPosition, uTime);
        float finalBrightness = globalBrightness * revealBrightness * digitPattern;
        
        gl_FragColor = vec4(finalColor * brightness * finalBrightness, 1.0);
    }
`

export const bodyShaderFS = /*glsl*/ `
    uniform vec3 uSunlightDirection;
    uniform float uAmbientLight;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vAwakeningFactor;
    varying float vRevealFactor;
    
    void main() { 
        float d = max(0.0, dot(vNormal, uSunlightDirection)); 
        float lighting = d + uAmbientLight;
        vec3 baseColor = vColor;
        
        // NEW: Add subtle vertical gradient based on world position
        float heightFactor = clamp((vPosition.y + 50.0) / 400.0, 0.0, 1.0);
        
        // Create gradient effect - darker bottom, brighter top
        float gradientStrength = 0.3; // Subtle effect
        vec3 gradientColor = baseColor * (0.8 + heightFactor * gradientStrength);
        
        // Add normal-based lighting enhancement for more 3D depth
        float normalGradient = max(0.0, vNormal.y); // Top surfaces brighter
        gradientColor = gradientColor * (0.9 + normalGradient * 0.2);
        
        // PROFESSIONAL DRONE BODY: Dark/black like real drone shows
        vec3 finalColor;
        if (uTime < 5.0) {
            // Hidden phase: completely black
            finalColor = vec3(0.0, 0.0, 0.0);
        } else if (uTime < 10.0) {
            // Column reveal phase: very dark warm glow
            vec3 darkWarmBase = vec3(0.1, 0.08, 0.06); // Much darker warm tone
            finalColor = darkWarmBase * (0.5 + heightFactor * 0.1); // Reduced brightness
        } else {
            // Flight phase: very dark body - focus on lights, not body
            finalColor = baseColor * 0.15; // Only 15% of original color - very dark
            
            // FOCUS SYSTEM: Even dimmer bodies for side groups
            float bodyFocusBrightness = 1.0;
            if (uTime < 105.0) { // Only dim side groups before rainbow formation
                float distanceFromCenter = abs(vPosition.x);
                
                if (distanceFromCenter > 150.0) { // Side groups
                    bodyFocusBrightness = 0.5; // Dim side group bodies further
                }
            }
            
            finalColor = finalColor * bodyFocusBrightness;
        }
        
        // MUCH DARKER BODY: Professional drone show appearance
        float minVisibility = 0.0; // No minimum - allow complete invisibility
        float revealBrightness = max(minVisibility, vRevealFactor * 0.3); // Reduced from 0.6 to 0.3
        
        // Ensure complete invisibility when reveal factor is 0
        if (vRevealFactor <= 0.0) {
            revealBrightness = 0.0;
        }
        
        // Additional darkness multiplier for professional look
        float bodyDarkness = 0.4; // Make body even darker
        
        gl_FragColor = vec4(finalColor * lighting * revealBrightness * bodyDarkness, 1.0);
    }
`
