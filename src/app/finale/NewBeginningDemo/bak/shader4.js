export const ParticleShader = {
  vertexShader: /*glsl*/ `
    uniform float uTime;
    uniform float uGridSize;
    uniform float uFlyUpHeight;

    attribute float a_id;

    // We need to pass the unique color to the fragment shader
    varying vec3 vColor;
    // We also pass progress to control the flicker start
    varying float vProgress;

    // A function to create a pseudo-random number from an ID
    float random(float n) {
        return fract(sin(n) * 43758.5453123);
    }
    
    // A function to convert HSL (Hue, Saturation, Lightness) to RGB
    // This is great for creating a nice color palette
    vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }


    void main() {
        // --- UNIQUE COLOR GENERATION ---
        // We generate a hue based on the drone's ID.
        // This creates a beautiful, varied, but cohesive palette.
        float hue = random(a_id);
        vColor = hsl2rgb(vec3(hue, 0.8, 0.6)); // Hue, Saturation, Lightness

        // ... (the rest of the position calculation logic is the same)
        float layer = floor(a_id / (uGridSize * uGridSize));
        float row = floor(mod(a_id, uGridSize * uGridSize) / uGridSize);
        float col = mod(a_id, uGridSize);

        vec3 endPos = vec3(
            (col - (uGridSize - 1.0) / 2.0) * 3.0,
            (row - (uGridSize - 1.0) / 2.0) * 3.0 + uFlyUpHeight,
            (layer - (uGridSize - 1.0) / 2.0) * 3.0
        );
        
        vec3 startPos = vec3(
            (mod(a_id, 64.0) - 31.5) * 1.0, -70.0,
            (floor(a_id / 64.0) - 31.5) * 1.0 - 50.0 + 200.0
        );

        float flightDuration = 5.0; 
        float rowDelay = (15.0 - row) * 2.0; 
        float droneDelay = random(a_id) * 0.2;
        float startTime = rowDelay + droneDelay;
        float progress = clamp((uTime - startTime) / flightDuration, 0.0, 1.0);
        vProgress = smoothstep(0.0, 1.0, progress);
        
        vec3 finalPos = mix(startPos, endPos, vProgress);

        float hoverAmplitude = 0.15;
        vec3 hoverOffset = vec3(
            sin(uTime * 1.5 + a_id * 5.0),
            cos(uTime * 1.2 + a_id * 3.5),
            cos(uTime * 1.8 + a_id * 4.2)
        ) * hoverAmplitude;
        finalPos += hoverOffset * vProgress;

        vec4 modelPosition = modelMatrix * vec4(finalPos, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        gl_Position = projectionMatrix * viewPosition;

        // Keep a nice large point size for the texture
        gl_PointSize = 20.0;
    }
    `,
  fragmentShader: /*glsl*/ `
    uniform sampler2D uTexture;
    uniform float uTime; // We need time for the flicker

    // Get the color and progress from the vertex shader
    varying vec3 vColor;
    varying float vProgress;

    // A random function for the flicker
    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        // --- FLICKER EFFECT ---
        // Create a flickering value that changes over time, using both time and the particle's screen position
        float flicker = random(gl_FragCoord.xy + uTime) * 0.5 + 0.5;
        // Make the flicker stronger and less frequent
        flicker = pow(flicker, 20.0);

        // --- TEXTURE & FINAL COLOR ---
        // Sample the texture color
        vec4 texColor = texture2D(uTexture, gl_PointCoord);
        
        // The final alpha is the texture's alpha, multiplied by our flicker value.
        // We also multiply by vProgress, so the flicker only starts when the drone has arrived.
        float finalAlpha = texColor.r * flicker * vProgress;

        // Discard transparent pixels
        if (finalAlpha < 0.01) discard;

        // The final color uses the unique vColor, and the calculated finalAlpha
        gl_FragColor = vec4(vColor, finalAlpha);
    }
    `,
}
