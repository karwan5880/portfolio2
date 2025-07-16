export const ParticleShader = {
  vertexShader: /*glsl*/ `
    uniform float uTime;
    uniform float uGridSize;

    uniform float uFlyUpHeight;
    uniform float uScale;
    uniform float uSceneSize;
    uniform float uMorphProgress;
    uniform float uSplitLevel;
    uniform sampler2D uTextPositions; // Our "blueprint" texture
    uniform float uMasterProgress; // The master animation control

    const float PI = 3.14159265359;


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
    vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) {
      return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C;
    }
    vec3 getRecursiveSpherePos(float level, float id) {
        // --- Calculate Group Info ---
        float numGroups = pow(2.0, level);
        float groupSize = 4096.0 / numGroups;
        float groupIndex = floor(id / groupSize);
        float localId = mod(id, groupSize);
        float normalizedLocalId = localId / groupSize;    
        // --- Calculate the position of the GROUP'S CENTER on a "parent" sphere ---
        float parentRadius = 20.0 * uScale; // How far apart the groups are
        float groupPhi = acos(1.0 - 2.0 * (groupIndex / numGroups));
        float groupTheta = 2.0 * PI * random(groupIndex); // Use groupIndex for consistent placement
        vec3 groupCenter = vec3(
            parentRadius * sin(groupPhi) * cos(groupTheta),
            parentRadius * sin(groupPhi) * sin(groupTheta),
            parentRadius * cos(groupPhi)
        );        
        // --- Calculate the position of the DRONE on its "child" sphere ---
        float childRadius = 8.0 * uScale; // The size of the smaller spheres
        float childPhi = acos(1.0 - 2.0 * normalizedLocalId);
        float childTheta = 2.0 * PI * random(localId); // Use localId for unique placement
        vec3 localPos = vec3(
            childRadius * sin(childPhi) * cos(childTheta),
            childRadius * sin(childPhi) * sin(childTheta),
            childRadius * cos(childPhi)
        );        
        return groupCenter + localPos;
    }


    void main() {
    

        bool isGroup1 = a_id < 2048.0;
        if (isGroup1) {
            float hue = random(a_id); // Group 1 gets the multi-color treatment
            vColor = hsl2rgb(vec3(hue, 0.8, 0.6));
        } else {
            vColor = vec3(1.0, 0.2, 0.2); // Group 2 gets a distinct fiery red
        }

        
        
        float hue = random(a_id);
        // vColor = hsl2rgb(vec3(hue, 0.8, 0.6)); 
        vColor = vec3(0.0, 1.0, 0.4); // A vibrant, electric green

        float layer = floor(a_id / (uGridSize * uGridSize));
        float row = floor(mod(a_id, uGridSize * uGridSize) / uGridSize);
        float col = mod(a_id, uGridSize);
    
        float spacingx = 3.0;
        float spacingy = 3.0;
        float spacingz = 3.0;

        

        // --- TARGET A: THE CUBE (Same as before) ---
        vec3 endPosA = vec3(
            (col - (uGridSize - 1.0) / 2.0) * 3.0,
            (row - (uGridSize - 1.0) / 2.0) * 3.0 + uFlyUpHeight,
            (layer - (uGridSize - 1.0) / 2.0) * 3.0
        ) * uScale;
            
        // --- TARGET B: THE SPHERE (This is now simpler) ---
        // Since we aren't doing the recursive split, we go back to the single sphere logic
        float droneId_norm = a_id / 4096.0;
        float phi = acos(1.0 - 2.0 * droneId_norm);
        float theta = 2.0 * PI * random(a_id);
        float radius = 15.0 * uScale;
        vec3 endPosB = vec3(
            radius * sin(phi) * cos(theta),
            radius * sin(phi) * sin(theta),
            radius * cos(phi)
        );
        endPosB.y += uFlyUpHeight * uScale;

        // --- TARGET C: THE "FINALE" TEXT ---
        // We look up the position from our data texture.
        float texSize = 64.0; // The texture is 64x64 pixels
        vec2 uv = vec2(mod(a_id, texSize) / texSize, floor(a_id / texSize) / texSize);
        vec3 endPosC = texture2D(uTextPositions, uv).xyz;
        endPosC.y += uFlyUpHeight * uScale; // Center it vertically

        // --- THE FINAL MULTI-STAGE MORPH ---
        // We use smoothstep to blend between the 3 stages based on uMasterProgress
        vec3 morphedPos = mix(endPosA, endPosB, smoothstep(0.0, 1.0, uMasterProgress));
        morphedPos = mix(morphedPos, endPosC, smoothstep(1.0, 2.0, uMasterProgress));
        
        // The collision avoidance still works beautifully!
        vec3 finalEndPos = getQuadraticBezier(endPosA, controlPos, morphedPos, uMasterProgress > 1.0 ? 1.0 : uMasterProgress);


        // // --- TARGET B: THE SPHERE (Same as before) ---
        // vec3 endPosB;        
        // float groupId = isGroup1 ? a_id : a_id - 2048.0;
        // float droneId_norm = groupId / 2048.0;
        // float phi = acos(1.0 - 2.0 * droneId_norm);
        // float theta = 2.0 * PI * random(a_id); 
        // float radius = 10.0 * uScale;
        // endPosB = vec3(
        //     radius * sin(phi) * cos(theta),
        //     radius * sin(phi) * sin(theta),
        //     radius * cos(phi)
        // );
        // endPosB.y += uFlyUpHeight * uScale;
        // float horizontalOffset = 20.0 * uScale;
        // if (isGroup1) {
        //     endPosB.x -= horizontalOffset; // Move Group 1 left
        // } else {
        //     endPosB.x += horizontalOffset; // Move Group 2 right
        // }

        // // ========================================================================
        // // --- 3. THE RECURSIVE MORPH LOGIC ---
        // // ========================================================================
        // vec3 formationCenter = vec3(0.0, uFlyUpHeight * uScale, 0.0);
        // vec3 outwardDirection = normalize(endPosA - formationCenter);
        // float detourDistance = 75.0 * uScale;
        // vec3 controlPos = endPosA + outwardDirection * detourDistance;

        // // We calculate the positions for the current split level and the next one.
        // vec3 spherePos_L0 = getRecursiveSpherePos(floor(uSplitLevel), a_id);
        // vec3 spherePos_L1 = getRecursiveSpherePos(ceil(uSplitLevel), a_id);

        // // We smoothly interpolate between the two levels.
        // vec3 endPosB = mix(spherePos_L0, spherePos_L1, fract(uSplitLevel));
        // endPosB.y += uFlyUpHeight * uScale; // Apply the final height offset

        // vec3 finalEndPos = getQuadraticBezier(endPosA, controlPos, endPosB, uMorphProgress);


        
        // ========================================================================
        // --- 2. THE NEW LAUNCHPAD GRID ---
        // This creates a perfect, tight 64x64 grid on the ground.
        // ========================================================================
        float launchpadSize = 64.0;
        float launchpadSpacing = 2.0 * uScale;
        float launchCol = mod(a_id, launchpadSize);
        float launchRow = floor(a_id / launchpadSize);
        vec3 startPos = vec3(
            (launchCol - launchpadSize / 2.0) * launchpadSpacing,
            -70.0, // The "ground" level
            (launchRow - launchpadSize / 2.0) * launchpadSpacing
        );

        // float launchpadSize = 64.0;
        // float launchpadSpacing = 1.0;
        // float startCol = mod(a_id, launchpadSize);
        // float startRow = floor(a_id / launchpadSize); // 
        // vec3 startPos = vec3(
        //     (mod(a_id, 64.0) - 31.5) * 1.0,
        //     -70.0,
        //     (floor(a_id / 64.0) - 31.5) * 1.0 
        // ) * uScale; 
        // startPos.y = -70.0; 

        // vec3 startPos = vec3(
        //     (startCol - (launchpadSize - 1.0) / 2.0) * launchpadSpacing,
        //     // -0.0, 
        //     -70.0, // A fixed, low Y position (the "ground")
        //     (startRow - (launchpadSize - 1.0) / 2.0) * launchpadSpacing - 50.0 + 50.0 //
        // );


        float flightDuration = 2.0; 
        // float row = floor(mod(a_id, uGridSize * uGridSize) / uGridSize);
        float rowDelay = (15.0 - row) * 2.0; 
        float droneDelay = random(a_id) * 0.01;
        float startTime = rowDelay + droneDelay;
        float progress = clamp((uTime - startTime) / flightDuration, 0.0, 1.0);
        vProgress = smoothstep(0.0, 1.0, progress);
        
        // vec3 finalPos = mix(startPos, endPos, vProgress);
        vec3 finalPos = mix(startPos, finalEndPos, progress);

        float hoverAmplitude = 0.15;
        vec3 hoverOffset = vec3(
            sin(uTime * 1.5 + a_id * 5.0),
            cos(uTime * 1.2 + a_id * 3.5),
            cos(uTime * 1.8 + a_id * 4.2)
        ) * hoverAmplitude;
        finalPos += hoverOffset * vProgress;

        // vec4 modelPosition = modelMatrix * vec4(finalPos, 1.0);
        // vec4 viewPosition = viewMatrix * modelPosition;
        // gl_Position = projectionMatrix * viewPosition;     
        // gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
        
        gl_PointSize = 15.0;

        // float startSize = 1.0;
        // float endSize = 4.0;
        // gl_PointSize = mix(startSize, endSize, vProgress);
    }
    `,
  fragmentShader: /*glsl*/ `
    uniform sampler2D uTexture;
    uniform float uTime; 
    uniform float uHeartbeatDuration;

    varying vec3 vColor;
    varying float vProgress;

    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float core = smoothstep(0.15, 0.1, dist);
        
        // float pulse = (sin(uTime * 3.0) + 1.0) * 0.25 + 0.5;
        // float glow = smoothstep(0.5, 0.0, dist) * pulse;
        // float alpha = glow * .6 + core * 1.5;
        // if (alpha < 0.01) discard;
        // gl_FragColor = vec4(vColor * (alpha * 1.5), alpha);
        
        float glowShape = smoothstep(0.5, 0.0, dist);
        float heartbeat = (sin(uTime * 5.0) + 1.0) / 2.0;
        heartbeat = pow(heartbeat, 3.0);        
        float launchFade = 1.0 - smoothstep(0.0, uHeartbeatDuration, uTime);
        float alpha = core * 1.5 + glowShape * heartbeat * launchFade;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(vColor, alpha);
        
    }
    `,
}
