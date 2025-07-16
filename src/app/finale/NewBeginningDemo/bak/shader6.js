export const ParticleShader = {
  vertexShader: /*glsl*/ `
    uniform float uTime;
    uniform float uGridSize;
    // uniform float uFlyUpHeight;
    // uniform float uScale;

    attribute float a_id;

    varying vec3 vColor;
    varying float vProgress;

    float random(float n) {
        return fract(sin(n) * 43758.5453123);
    }
    
    vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }

    void main() {
        float hue = random(a_id);
        vColor = hsl2rgb(vec3(hue, 0.8, 0.6)); 

        float layer = floor(a_id / (uGridSize * uGridSize));
        float row = floor(mod(a_id, uGridSize * uGridSize) / uGridSize);
        float col = mod(a_id, uGridSize);
    
        float spacingx = 3.0;
        float spacingy = 3.0;
        float spacingz = 3.0;

        vec3 endPos = vec3(
            (col - (uGridSize - 1.0) / 2.0) * spacingx,
            (row - (uGridSize - 1.0) / 2.0) * spacingy + 50.0,
            (layer - (uGridSize - 1.0) / 2.0) * spacingz - 50.0
        ) ;
                
        float launchpadSize = 64.0;
        float launchpadSpacing = 1.0;
        float startCol = mod(a_id, launchpadSize);
        float startRow = floor(a_id / launchpadSize); // 

        // vec3 startPos = vec3(
        //     (mod(a_id, 64.0) - 31.5) * 4.0, // Spread them out more horizontally
        //     -100.0, // Start from even lower down
        //     -1200.0 // Start way, way back at Z = -1200
        // ) * uScale;

        vec3 startPos = vec3(
            (startCol - (launchpadSize - 1.0) / 2.0) * launchpadSpacing,
            // -0.0, 
            -70.0, // A fixed, low Y position (the "ground")
            (startRow - (launchpadSize - 1.0) / 2.0) * launchpadSpacing - 50.0 + 50.0 // Position it behind the cube
        ) ;

        // vec3 startPos = vec3(
        //     (mod(a_id, 64.0) - 31.5) * 1.0, -70.0,
        //     (floor(a_id / 64.0) - 31.5) * 1.0 - 50.0 + 300.0
        // );

        float flightDuration = 2.0; 
        float rowDelay = (15.0 - row) * .5; 
        float droneDelay = random(a_id) * 0.001;
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

        // gl_PointSize = 15.0;
        // gl_PointSize = 200.0 * vProgress + 5.0; // Let's also make them grow on arrival
        // --- DYNAMIC SIZE ---
        float startSize = 1.0;
        float endSize = 4.0;
        // gl_PointSize = mix(startSize, endSize, vProgress);
        // gl_PointSize = 5.0;
        // gl_PointSize = 4.0;
    }
    `,
  fragmentShader: /*glsl*/ `
    uniform sampler2D uTexture;
    uniform float uTime; 

    varying vec3 vColor;
    varying float vProgress;

    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        
        // ENERGY PULSE
        vec3 color = vec3(0.4, 0.9, 1.0);
        float dist = length(gl_PointCoord - vec2(0.5));
        float pulse = (sin(uTime * 3.0) + 1.0) * 0.25 + 0.5;
        float glow = smoothstep(0.5, 0.0, dist) * pulse;
        float core = smoothstep(0.1, 0.08, dist);
        // float core = smoothstep(0.15, 0.1, dist);
        float alpha = glow * 4.0 + core * 5.5;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(color * (alpha * 6.0), alpha);
        
        // // VERY VERY NICE GLOWING EFFECT
        // vec3 color = vec3(0.8, 0.9, 0.7); // An electric blue/cyan
        // float dist = length(gl_PointCoord - vec2(0.5));
        // float glow = smoothstep(0.5, 0.0, dist);
        // float core = smoothstep(0.15, 0.1, dist);
        // float alpha = glow * 0.3 + core * 1.0;
        // if (alpha < 0.01) discard;
        // gl_FragColor = vec4(color, alpha);
        
        // float dist = length(gl_PointCoord - vec2(0.5));
        // float alpha = smoothstep(0.5, 0.0, dist);
        // if (alpha < 0.01) discard;
        // vec3 color = vec3(0.1, 0.7, 1.0); // Cyan
        // gl_FragColor = vec4(color, alpha);

        // vec3 color = vec3(.8, 0.9, 0.7); //
        // float dist = length(gl_PointCoord - vec2(0.5));
        // if (dist > 0.5) discard;        
        // gl_FragColor = vec4(color, 1.0);
    }
    `,
}
