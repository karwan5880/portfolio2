// Backup of lightShader.js before text display implementation
// Created as safety checkpoint

// Drone light and color shaders - controls visual appearance

// Main rendering vertex shader with colors and lighting setup
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

    // Rainbow column color system - each column gets unique hue
    vec3 getRainbowColumnColor(float droneId, float time, float revealFactor, vec3 worldPosition) {
        // Use correct grid dimensions (128 rows × 32 columns)
        float row = floor(droneId / GRID_COLS); // droneId / 32.0
        float col = mod(droneId, GRID_COLS);    // mod(droneId, 32.0)
        
        // Professional drone show: consistent brightness regardless of distance
        float distanceBrightness = 1.0;
        
        // RECTANGLE FORMATION: Random colors every 2 seconds! (RESTORED)
        if (time >= 52.0) {
            // DISCO MODE: Random colors change every 2 seconds
            float timeInRect = time - 52.0; // Time since rectangle formation started
            float colorChangeInterval = 2.0; // Change every 2 seconds - Elegant transitions!
            float colorCycle = floor(timeInRect / colorChangeInterval); // Which color cycle (0, 1, 2, 3...)
            
            // Create HIGHLY unique random seed for each drone and color cycle
            float randomSeed = droneId * 12.9898 + colorCycle * 78.233; // Much larger multipliers for better distribution
            
            // Generate random HSL color with HIGHLY distributed seeds
            float randomHue = random(randomSeed) * 360.0; // 0-360 degrees
            float randomSaturation = 0.7 + random(randomSeed + 43.758) * 0.3; // 0.7-1.0 (vibrant)
            float randomLightness = 0.4 + random(randomSeed + 91.234) * 0.4; // 0.4-0.8 (visible)
            
            // Convert HSL to RGB
            vec3 hslColor = vec3(randomHue / 360.0, randomSaturation, randomLightness);
            vec3 randomColor = hsl2rgb(hslColor);
            
            return randomColor;
        }
        
        // Rainbow colors: smooth spectrum across all 32 columns
        vec3 rainbowColor;
        
        // Create deep, rich rainbow transitions across all 32 columns
        float hue = col / 31.0; // 0 to 1 across all columns for full spectrum
        float saturation = 1.0; // Maximum saturation for deep, rich colors
        float lightness = 0.5;  // Medium lightness for deep, saturated colors
        
        // Convert HSL to RGB for smooth rainbow spectrum
        vec3 hslColor = vec3(hue, saturation, lightness);
        rainbowColor = hsl2rgb(hslColor);
        
        // Special pink highlights at favorite positions
        if (col == 8.0) {
            rainbowColor = vec3(1.0, 0.4, 0.7); // Beautiful Pink at column 8
        } else if (col == 24.0) {
            rainbowColor = vec3(1.0, 0.4, 0.7); // Another Pink at column 24
        }
        
        // Apply distance brightness but keep colors pure and saturated
        rainbowColor = rainbowColor * distanceBrightness;
        
        // FOCUS SYSTEM: DISABLED - All drones same brightness
        float focusBrightness = 1.0; // Always full brightness
        
        rainbowColor = rainbowColor * focusBrightness;
        
        // Simple color system - dim warm glow for reveal phase
        vec3 dimGlow = vec3(0.8, 0.6, 0.4) * 0.6; // Dim warm glow (no bloom)
        
        // Simple color logic based on reveal factor
        if (revealFactor <= 0.0) {
            // Completely hidden
            return vec3(0.0, 0.0, 0.0);
        } else if (time < 12.0) {
            // Column reveal phase (5-12s): Only dim warm glow
            return dimGlow * revealFactor;
        } else {
            // Flight phase (12s+): Rainbow colors for flying drones
            return rainbowColor;
        }
    }
    
    // Simple awakening system - no complex timing
    float getDroneAwakeningFactor(float droneId, float time) {
        if (time < 5.0) {
            return 0.0; // Completely hidden
        } else if (time < 12.0) {
            return 1.0; // Revealed with dim light
        } else {
            return 1.0; // Flying drones
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

// Light shader - controls drone light brightness and effects
export const lightShaderFS = /*glsl*/ `
    uniform float uTime;
    uniform float uPulseFrequency;
    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vAwakeningFactor;
    varying float vRevealFactor;
    
    // Function to check if drone is in circle formation and should turn off lights
    float getCircleLightPattern(vec3 worldPosition, float uTime) {
        // DISABLED: Circle light pattern interferes with rectangle formation
        // The circle formation was turning off lights for drones near (0,350,0)
        // which created holes in our rectangle formation at (0,300,0)
        return 1.0; // Always keep lights on
    }

    void main() { 
        // Professional: minimal pulsing for consistent appearance
        float primaryPulse = (sin(uTime * uPulseFrequency * 0.5) + 1.0) / 2.0; // Slower pulse
        float h = primaryPulse * 0.3; // Much subtler pulsing effect
        h = pow(h, 0.8); // Gentler curve
        
        // Smart brightness control that works with adaptive bloom
        float baseBrightness = 20.0;
        float pulseBrightness = 40.0;
        
        // Brightness control - simple and clean
        if (uTime < 5.0) {
            // Hidden phase: Complete darkness
            baseBrightness = 0.0;
            pulseBrightness = 0.0;
        } else if (uTime < 12.0) {
            // Column reveal phase: Dim light, NO BLOOM
            float revealProgress = (uTime - 5.0) / 7.0; // 0-1 over column reveal (adjusted for 12s)
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
        
        // Global brightness control - simple and effective
        float globalBrightness = 1.0;
        
        if (uTime < 5.0) {
            // Hidden phase: Complete darkness
            globalBrightness = 0.0;
        } else if (uTime < 12.0) {
            // Column reveal phase: Dim light buildup (NO BLOOM)
            float revealProgress = (uTime - 5.0) / 7.0; // 0-1 over reveal (adjusted for 12s)
            globalBrightness = 0.3 + revealProgress * 0.4; // 0.3 → 0.7 (dim, no bloom)
        } else {
            // Flight phase: CONTAINED brightness - crisp without bloom pollution
            globalBrightness = 0.8; // Reduced from 1.5 to prevent light overflow
            
            // FOCUS SYSTEM: DISABLED - All drones same brightness
            float lightFocusBrightness = 1.0; // Always full brightness
            
            globalBrightness = globalBrightness * lightFocusBrightness;
        }
        
        // Fixed reveal system - completely hidden when reveal factor is 0
        float minVisibility = 0.0; // No minimum - allow complete invisibility
        float revealBrightness = max(minVisibility, vRevealFactor); // Use full reveal factor, not 0.8
        
        // Ensure complete invisibility when reveal factor is 0
        if (vRevealFactor <= 0.0) {
            revealBrightness = 0.0;
        }
        
        // Apply circle light pattern - turn off lights for circle drones after 3s
        float circleLightPattern = getCircleLightPattern(vPosition, uTime);
        float finalBrightness = globalBrightness * revealBrightness * circleLightPattern;
        
        gl_FragColor = vec4(finalColor * brightness * finalBrightness, 1.0);
    }
`

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
    
    void main() { 
        float d = max(0.0, dot(vNormal, uSunlightDirection)); 
        float lighting = d + uAmbientLight;
        vec3 baseColor = vColor;
        
        // Add subtle vertical gradient based on world position
        float heightFactor = clamp((vPosition.y + 50.0) / 400.0, 0.0, 1.0);
        
        // Create gradient effect - darker bottom, brighter top
        float gradientStrength = 0.3; // Subtle effect
        vec3 gradientColor = baseColor * (0.8 + heightFactor * gradientStrength);
        
        // Add normal-based lighting enhancement for more 3D depth
        float normalGradient = max(0.0, vNormal.y); // Top surfaces brighter
        gradientColor = gradientColor * (0.9 + normalGradient * 0.2);
        
        // Professional drone body: dark/black like real drone shows
        vec3 finalColor;
        if (uTime < 5.0) {
            // Hidden phase: completely black
            finalColor = vec3(0.0, 0.0, 0.0);
        } else if (uTime < 12.0) {
            // Column reveal phase: very dark warm glow
            vec3 darkWarmBase = vec3(0.1, 0.08, 0.06); // Much darker warm tone
            finalColor = darkWarmBase * (0.5 + heightFactor * 0.1); // Reduced brightness
        } else {
            // Flight phase: very dark body - focus on lights, not body
            finalColor = baseColor * 0.15; // Only 15% of original color - very dark
            
            // FOCUS SYSTEM: DISABLED - All drone bodies same brightness
            float bodyFocusBrightness = 1.0; // Always full brightness
            
            finalColor = finalColor * bodyFocusBrightness;
        }
        
        // Much darker body: professional drone show appearance
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
