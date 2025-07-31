export const ParticleShader = {
  vertexShader: /*glsl*/ `
    uniform float uTime; 
    
    attribute float a_id;

    // const float SIZE = 64.0;
    const float SIZE = 16.0;
    const float DRONE_COUNT = 4096.0;

    float random(float n) {
        return fract(sin(n) * 43758.5453123);
    }

    void main() {
        float layer = floor(a_id / (SIZE * SIZE));
        // float row = floor(a_id / SIZE);
        float row = floor(mod(a_id, SIZE * SIZE) / SIZE);        
        float col = mod(a_id, SIZE); 

        float finalLayer = floor(a_id / (SIZE * SIZE));
        float finalRow = floor(mod(a_id, SIZE * SIZE) / SIZE);
        float finalCol = mod(a_id, SIZE);

        vec3 endPos = vec3(
            (col - (SIZE - 1.0) / 2.0) * 3.0,
            (row - (SIZE - 1.0) / 2.0) * 3.0,
            (layer - (SIZE - 1.0) / 2.0) * 3.0
        );
        // vec3 endPos = vec3(
        //     (col - (SIZE - 1.0) / 2.0) * 1.5,
        //     (row - (SIZE - 1.0) / 2.0) * 1.5,
        //     0.0
        // );

        float launchpadSize = 64.0;
        float launchpadSpacing = 1.0;

        float stagingCols = 256.0;
        float stagingRows = 16.0;
        float stagingSpacing = 0.5;
        
        // float startCol = mod(a_id, stagingCols);
        // float startRow = floor(a_id / stagingCols);
                
        float startCol = mod(a_id, launchpadSize);
        float startRow = floor(a_id / launchpadSize); // This now corresponds to the Z-axis

        // vec3 startPos = vec3(
        //     (startCol - (stagingCols - 1.0) / 2.0) * stagingSpacing,
        //     (startRow - (stagingRows - 1.0) / 2.0) * stagingSpacing - 50.0, // Position it low
        //     150.0 // Start far behind the camera
        // );
        
        vec3 startPos = vec3(
            (startCol - (launchpadSize - 1.0) / 2.0) * launchpadSpacing,
            -70.0, // A fixed, low Y position (the "ground")
            (startRow - (launchpadSize - 1.0) / 2.0) * launchpadSpacing - 50.0 + 200.0 // Position it behind the cube
        );

        // // --- 2. Calculate the START position (The "Groundswell" Curtain) ---
        // // A large, randomized plane located only in the lower half of the view.
        // vec3 startPos = vec3(
        //     (random(a_id * 2.0) - 0.5) * 200.0, // Random X position
        //     (random(a_id * 3.0) - 1.0) * 100.0, // Random Y, but only from -200 to 0
        //     150.0                               // Start behind the camera
        // );
        // // vec3 startPos = vec3(endPos.xy, 150.0);
        
        // float flightDuration = 22.0; // How long an individual drone takes to fly 
        // float maxArrivalTime = 20.0;
        // float startTime = a_id * 0.21;
        // float delay = a_id * 0.002; 
        // float duration = 12.0;         
        // float maxArrivalTime = 46.0;
        // float startTime = random(a_id) * maxArrivalTime;
        // float layerDelay = (15.0 - layer) * 2.0; // Layer 15 starts at 0s, Layer 14 at 2s, etc.
        // float droneDelay = random(a_id) * 1.0; // Add a tiny random delay to each drone within the layer for a "shimmer" effect.
        // float startTime = waveDelay + droneDelay;
        
        float flightDuration = 5.0; 
        
        // // Calculate the row's distance from the vertical center (7.5).
        // // 'abs(row - 7.5)' gives us a value from 7.5 (for top/bottom rows) down to 0.5 (for middle rows).
        // float distFromCenter = abs(row - (SIZE - 1.0) / 2.0);
        
        // // The start time is now based on this distance.
        // // The outermost rows (distFromCenter = 7.5) will start first.
        // // The innermost rows (distFromCenter = 0.5) will start last.
        // float waveDelay = (7.5 - distFromCenter) * 2.0;

        float rowDelay = (15.0 - row) * 2.0; 
        float droneDelay = 0.001; // Add a tiny random delay to each drone within the layer for a "shimmer" effect.
        float startTime = rowDelay + droneDelay;
        float progress = clamp((uTime - startTime) / flightDuration, 0.0, 1.0);
        progress = smoothstep(0.0, 1.0, progress);
        // float progress = clamp((uTime - delay) / duration, 0.0, 1.0);
        // float progress = (uTime - startTime) / flightDuration;
        // progress = clamp(progress, 0.0, 1.0);
        // progress = smoothstep(0.0, 1.0, progress); 
        // float delay = a_id * 0.001; 

        vec3 finalPos = mix(startPos, endPos, progress);

        vec4 modelPosition = modelMatrix * vec4(finalPos, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        
        gl_PointSize = 5.0;
    }
    `,
  fragmentShader: /*glsl*/ `
    void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
    `,
}

// export const ParticleShader = {
//   vertexShader: /*glsl*/ `
//     uniform sampler2D uStartPositions;
//     uniform sampler2D uEndPositions;
//     uniform float uTime;

//     const float DRONE_COUNT = 4096.0;
//     const float SIZE = 64.0;

//     attribute float a_id;

//     vec2 getUVFromID(float id) {
//         float row = floor(id / SIZE);
//         float col = mod(id, SIZE);
//         return vec2(col / (SIZE - 1.0), row / (SIZE - 1.0));
//     }

//     void main() {
//         float radius = 500.0;
//         float y = 1.0 - (a_id / (DRONE_COUNT - 1.0)) * 2.0;
//         float radiusAtY = sqrt(1.0 - y * y);
//         float theta = 3.14159265359 * (3.0 - sqrt(5.0)) * a_id;
//         vec3 startPos = vec3(
//             cos(theta) * radiusAtY * radius,
//             y * radius,
//             sin(theta) * radiusAtY * radius
//         );
//         float col = mod(a_id, SIZE);
//         float row = floor(a_id / SIZE);
//         vec3 endPos = vec3(
//             (col - (SIZE - 1.0) / 2.0) * 1.5,
//             (row - (SIZE - 1.0) / 2.0) * 1.5,
//             0.0
//         );
//         float duration = 8.0;
//         float progress = clamp(uTime / duration, 0.0, 1.0);
//         progress = smoothstep(0.0, 1.0, progress);
//         vec3 finalPos = mix(startPos, endPos, progress);
//         vec4 modelPosition = modelMatrix * vec4(finalPos, 1.0);
//         vec4 viewPosition = viewMatrix * modelPosition;
//         vec4 projectedPosition = projectionMatrix * viewPosition;
//         gl_Position = projectedPosition;
//         gl_PointSize = 5.0;

//         /*vec3 startPos = texture2D(uStartPositions, uv).xyz;
//         vec3 endPos = texture2D(uEndPositions, uv).xyz;
//         float duration = 8.0; // 8 seconds for the full entrance
//         float progress = smoothstep(0.0, 1.0, uTime / duration);
//         progress = clamp(progress, 0.0, 1.0);
//         vec3 newPos = mix(startPos, endPos, progress);
//         vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
//         vec4 viewPosition = viewMatrix * modelPosition;
//         vec4 projectedPosition = projectionMatrix * viewPosition;
//         gl_Position = projectedPosition;
//         gl_PointSize = 5.0;*/
//     }
//     `,
//   fragmentShader: /*glsl*/ `
//     void main() {
//         float dist = length(gl_PointCoord - vec2(0.5));
//         if (dist > 0.5) discard;
//         gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
//     }
//     `,
// }

// // export const ParticleShader = {
// //   vertexShader: /*glsl*/ `
// //     // The initial position of each particle, read from a texture.
// //     uniform sampler2D uPositions;
// //     // The current time of the simulation.
// //     uniform float uTime;

// //     // We need the UV attribute to know which particle we are.
// //     //attribute vec2 uv;

// //     void main() {
// //         // Read the particle's unique starting position from the texture.
// //         vec3 startPos = texture2D(uPositions, uv).xyz;

// //         // --- THE ANIMATION LOGIC ---
// //         // We calculate the new position directly here.
// //         // The animation is simple: move constantly based on time.
// //         vec3 newPos = startPos + vec3(uTime * 2.0, uTime * 2.0, 0.0);

// //         // Standard boilerplate to render the particle.
// //         vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
// //         vec4 viewPosition = viewMatrix * modelPosition;
// //         vec4 projectedPosition = projectionMatrix * viewPosition;
// //         gl_Position = projectedPosition;

// //         gl_PointSize = 15.0;
// //     }
// //     `,
// //   fragmentShader: /*glsl*/ `
// //     void main() {
// //         // A simple, undeniable green circle.
// //         float dist = length(gl_PointCoord - vec2(0.5));
// //         if (dist > 0.5) discard;
// //         gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// //     }
// //     `,
// // }

// // // export const BasicParticleShader = {
// // //   vertexShader: /*glsl*/ `
// // //     //attribute vec2 uv;
// // //     //varying vec2 vUv;
// // //     uniform sampler2D uPositionTexture;
// // //     void main() {
// // //         vec3 pos = texture2D(uPositionTexture, uv).xyz;
// // //         //vUv = uv;
// // //         vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
// // //         vec4 viewPosition = viewMatrix * modelPosition;
// // //         vec4 projectedPosition = projectionMatrix * viewPosition;
// // //         gl_Position = projectedPosition;
// // //         gl_PointSize = 15.0;
// // //     }
// // //     `,
// // //   fragmentShader: /*glsl*/ `
// // //     void main() {
// // //         float dist = length(gl_PointCoord - vec2(0.5));
// // //         if (dist > 0.5) discard;
// // //         gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
// // //     }
// // //     `,
// // // }
