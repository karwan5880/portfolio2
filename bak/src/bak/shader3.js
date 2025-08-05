export const ParticleShader = {
  vertexShader: /*glsl*/ `
    uniform float uTime; 
    uniform float uGridSize; 
    
    attribute float a_id;

    varying vec3 vFinalPos;

    const float SIZE = 16.0;
    // const float SIZE = uGridSize;
    const float DRONE_COUNT = 4096.0;

    varying float vProgress ;    // We'll pass the progress to the fragment shader
    varying vec3 vColor;


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


        float layer = floor(a_id / (SIZE * SIZE));
        float row = floor(mod(a_id, SIZE * SIZE) / SIZE);        
        float col = mod(a_id, SIZE); 

        float finalLayer = floor(a_id / (SIZE * SIZE));
        float finalRow = floor(mod(a_id, SIZE * SIZE) / SIZE);
        float finalCol = mod(a_id, SIZE);

        vec3 endPos = vec3(
            (col - (SIZE - 1.0) / 2.0) * 3.0,
            (row - (SIZE - 1.0) / 2.0) * 3.0 + 120.0,
            (layer - (SIZE - 1.0) / 2.0) * 3.0 - 120.0
        );

        vFinalPos = endPos;


        float launchpadSize = 64.0;
        float launchpadSpacing = 1.0;
        // float launchpadSpacing = 10.0;

        float stagingCols = 256.0;
        float stagingRows = 16.0;
        float stagingSpacing = 0.5;
        
        float startCol = mod(a_id, launchpadSize);
        float startRow = floor(a_id / launchpadSize); //
        
        vec3 startPos = vec3(
            (startCol - (launchpadSize - 1.0) / 2.0) * launchpadSpacing,
            -70.0, // A fixed, low Y position (the "ground")
            (startRow - (launchpadSize - 1.0) / 2.0) * launchpadSpacing - 50.0 + 50.0 // Position it behind the cube
        );

        float flightDuration = 15.0;         
        float rowDelay = (15.0 - row) * 2.0; 
        float droneDelay = 0.001; //
        float startTime = rowDelay + droneDelay;
        float progress = clamp((uTime - startTime) / flightDuration, 0.0, 1.0);
        vProgress  = smoothstep(0.0, 1.0, progress);
                
        vec3 finalPos = mix(startPos, endPos, vProgress );
        

        // --- DYNAMIC SIZE ---
        // The size will be small at the start and grow as it arrives.
        float startSize = 2.0;
        float endSize = 2.0;
        gl_PointSize = mix(startSize, endSize, vProgress );


        // --- INDIVIDUAL HOVER ANIMATION ---
        // 1. Define the strength of the hover effect.
        float hoverAmplitude = 0.15;
        // 2. Create a unique, looping offset using the drone's ID and time.
        // Using different multipliers for time and ID on each axis makes the motion more complex and natural.
        vec3 hoverOffset = vec3(
            sin(uTime * 1.5 + a_id * 5.0) * hoverAmplitude,
            cos(uTime * 1.2 + a_id * 3.5) * hoverAmplitude,
            cos(uTime * 1.8 + a_id * 4.2) * hoverAmplitude
        );
        // 3. Add the hover offset to the final position.
        // We multiply by 'progress' so the hover effect only appears when the drone arrives.
        finalPos += hoverOffset * vProgress ;


        vec4 modelPosition = modelMatrix * vec4(finalPos, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        
        gl_PointSize = 18.0;
    }
    `,
  fragmentShader: /*glsl*/ `
    uniform float uTime; // You would need to add this uniform and pass it
    varying vec3 vFinalPos;
    varying float vProgress ;    // Receive the progress value from the vertex shader
    uniform sampler2D uTexture;
    
    // Get the color and progress from the vertex shader
    varying vec3 vColor;

    // A random function for the flicker
    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }


    void main() {
    

        vec3 color = vec3(0.1, 0.7, 1.0); // An electric blue/cyan
        // vec3 color = vec3(1.0, 0.2, 0.2); //

        float dist = length(gl_PointCoord - vec2(0.5));
        
        // 3. Create the soft outer glow.
        // It starts fading in at a distance of 0.5 and is fully transparent at 0.0
        float glow = smoothstep(0.5, 0.0, dist);

        // if (dist > 0.5) discard;
        
        // float innerRadius = 0.4;
        // float outerRadius = 0.5;
        // float ring = smoothstep(innerRadius, innerRadius + 0.05, dist) - smoothstep(outerRadius - 0.05, outerRadius, dist);
        // float innerRadius = 0.2;
        // float outerRadius = 0.25;
        float innerRadius = 0.8;
        float outerRadius = 0.9;
        float ring = smoothstep(innerRadius, innerRadius + 0.02, dist) - smoothstep(outerRadius - 0.02, outerRadius, dist);
        // if (ring < 0.1) discard;
        
        // 5. Combine them.
        // The final alpha is the soft glow plus the sharp ring.
        // This layers the bright ring on top of the transparent glow.
        float alpha = glow * 12.9 + ring * 1.0;

        // Discard the fragment if it's fully transparent.
        if (alpha < 0.01) discard;
        
        // // --- Color Calculation ---
        // // 4. Create a color based on the final position.
        // // We normalize the position to map it into a 0.0 to 1.0 color range.
        // // The cube's total size is (uGridSize * 3.0), so we divide by that.
        // // You can play with these values to change the gradient!
        // float colorRange = 16.0 * 3.0;
        // float r = vFinalPos.x / colorRange + 0.5;
        // float g = vFinalPos.y / colorRange + 0.5;
        // float b = vFinalPos.z / colorRange + 0.5;

        // // Create a pulsating alpha value using sine, making it loop between ~0.3 and 1.0
        // float alpha = smoothstep(0.5, 0.0, dist);
        // float pulse = (sin(uTime * 2.0 + vFinalPos.y) + 1.0) / 2.0; // a value from 0.0 to 1.0


        

        // // Sample the texture using the particle's coordinates (gl_PointCoord)
        // // Then multiply by a color to tint the texture
        // vec4 texColor = texture2D(uTexture, gl_PointCoord);
        // vec3 finalColor = vec3(0.1, 0.7, 1.0); // Our cyan tint        
        // // The final color is the texture's pixel, tinted by our color.
        // // The alpha comes directly from the texture's grayscale values.
        // gl_FragColor = vec4(finalColor, texColor.r);
        
        // // --- DYNAMIC COLOR ---
        // // Define a start color (e.g., a dim white) and an end color (our cyan)
        // vec3 travelColor = vec3(0.1, 0.2, 0.1);
        // vec3 finalColor = vec3(0.1, 0.7, 1.0);        
        // // Mix between the colors based on the drone's flight progress
        // vec3 finalMixedColor = mix(travelColor, finalColor, vProgress);
        // gl_FragColor = vec4(finalMixedColor, 1.0);
        
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

        // gl_FragColor = vec4(color, alpha);
        // gl_FragColor = vec4(0.0, 1.0, 1.0, alpha * (0.3 + pulse * 0.7));
        // gl_FragColor = vec4(0.0, 1.0, 0.0, alpha * (0.3 + pulse * 0.7));
        // gl_FragColor = vec4(r, g, b, 1.0);
        // gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
    `,
}
