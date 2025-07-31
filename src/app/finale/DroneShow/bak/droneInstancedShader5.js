// droneInstancedShader.js

export const positionComputeShaderFS = /*glsl*/ `
    uniform float uTime;
    uniform float uScale;
    uniform float uMasterProgress;
    uniform sampler2D uTextPositions;
    uniform float uTextureSize;

    #define PI 3.14159265359
    #define DRONE_COUNT 4096.0
    #define GRID_SIZE 16.0
    #define FLY_UP_HEIGHT 25.0
    #define FLIGHT_DURATION 10.0

    float random(float n) { return fract(sin(n) * 43758.5453123); }
    vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) { return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C; }

    void main() {
        float a_id = gl_FragCoord.x - 0.5 + (gl_FragCoord.y - 0.5) * uTextureSize;

        if (a_id >= DRONE_COUNT) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        
        float layer = floor(a_id / (GRID_SIZE * GRID_SIZE));
        float row = floor(mod(a_id, GRID_SIZE * GRID_SIZE) / GRID_SIZE);
        float col = mod(a_id, GRID_SIZE);
        vec3 endPosA = vec3((col-7.5)*50.,(row-7.5)*50.,(layer-7.5)*50.);
        endPosA.y += FLY_UP_HEIGHT * uScale;
        float droneId_norm = a_id / DRONE_COUNT;
        float phi = acos(1. - 2. * droneId_norm);
        float theta = 2. * PI * random(a_id);
        float radius = 400.;
        vec3 endPosB = vec3(radius*sin(phi)*cos(theta), radius*sin(phi)*sin(theta), radius*cos(phi));
        endPosB.y += FLY_UP_HEIGHT * uScale;
        vec2 uv_text = vec2(mod(a_id, uTextureSize)/uTextureSize, floor(a_id/uTextureSize)/uTextureSize);
        vec3 endPosC = texture2D(uTextPositions, uv_text).xyz;
        endPosC.y += FLY_UP_HEIGHT * uScale;
        vec3 finalEndPos = mix(endPosA, endPosB, smoothstep(0.,1.,uMasterProgress));
        finalEndPos = mix(finalEndPos, endPosC, smoothstep(1.,2.,uMasterProgress));
        vec3 startPos = vec3((mod(a_id, 64.)-31.5)*40., -70., (floor(a_id/64.)-31.5)*40.);
        float rowDelay = (15. - row) * 0.2;
        float droneDelay = random(a_id) * 0.1;
        float startTime = rowDelay + droneDelay;
        float progress = smoothstep(0.,1.,clamp((uTime-startTime)/FLIGHT_DURATION,0.,1.));
        vec3 controlPos = endPosA + normalize(endPosA-vec3(0,FLY_UP_HEIGHT*uScale,0))*750.;
        vec3 finalPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress);
        gl_FragColor = vec4(finalPos, 1.0);
    }
`

// SHADER 1: Position Calculation (Fragment Shader)
export const positionComputeShaderFS2 = /*glsl*/ `
    uniform float uTime;
    uniform float uScale;
    uniform float uMasterProgress;
    uniform sampler2D uTextPositions;
    varying vec2 vUv;

    #define PI 3.14159265359
    #define DRONE_COUNT 4096.0
    #define GRID_SIZE 16.0
    #define FLY_UP_HEIGHT 25.0
    #define FLIGHT_DURATION 10.0

    float random(float n) { return fract(sin(n) * 43758.5453123); }
    vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) { return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C; }

    void main() {
        float texSize = sqrt(DRONE_COUNT);
        // float a_id = floor(vUv.x * texSize) + floor(vUv.y * texSize) * texSize;
        float a_id = gl_FragCoord.x - 0.5 + (gl_FragCoord.y - 0.5) * uTextureSize;

        
        float layer = floor(a_id / (GRID_SIZE * GRID_SIZE));
        float row = floor(mod(a_id, GRID_SIZE * GRID_SIZE) / GRID_SIZE);
        float col = mod(a_id, GRID_SIZE);
        vec3 endPosA = vec3((col-7.5)*50.,(row-7.5)*50.,(layer-7.5)*50.);
        endPosA.y += FLY_UP_HEIGHT * uScale;
        float droneId_norm = a_id / DRONE_COUNT;
        float phi = acos(1. - 2. * droneId_norm);
        float theta = 2. * PI * random(a_id);
        float radius = 400.;
        vec3 endPosB = vec3(radius*sin(phi)*cos(theta), radius*sin(phi)*sin(theta), radius*cos(phi));
        endPosB.y += FLY_UP_HEIGHT * uScale;
        vec2 uv_text = vec2(mod(a_id, texSize)/texSize, floor(a_id/texSize)/texSize);
        vec3 endPosC = texture2D(uTextPositions, uv_text).xyz;
        endPosC.y += FLY_UP_HEIGHT * uScale;
        vec3 finalEndPos = mix(endPosA, endPosB, smoothstep(0.,1.,uMasterProgress));
        finalEndPos = mix(finalEndPos, endPosC, smoothstep(1.,2.,uMasterProgress));
        vec3 startPos = vec3((mod(a_id, 64.)-31.5)*40., -70., (floor(a_id/64.)-31.5)*40.);
        float rowDelay = (15. - row) * 0.2;
        float droneDelay = random(a_id) * 0.1;
        float startTime = rowDelay + droneDelay;
        float progress = smoothstep(0.,1.,clamp((uTime-startTime)/FLIGHT_DURATION,0.,1.));
        vec3 controlPos = endPosA + normalize(endPosA-vec3(0,FLY_UP_HEIGHT*uScale,0))*750.;
        vec3 finalPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress);
        gl_FragColor = vec4(finalPos, 1.0);
    }
`

// SHADER 2: Grid Hashing (Fragment Shader)
export const hashComputeShaderFS = /*glsl*/ `
    uniform sampler2D uPositionTexture;
    uniform float uGridCellSize;
    varying vec2 vUv;
    #define DRONE_COUNT 4096.0
    #define TEXTURE_SIZE 64.0

    void main() {
        vec3 pos = texture2D(uPositionTexture, vUv).xyz;
        ivec3 cellCoords = ivec3(floor(pos / uGridCellSize));
        float hash = float(cellCoords.x*92837111 ^ cellCoords.y*689287499 ^ cellCoords.z*283923481);
        float droneId = gl_FragCoord.x - 0.5 + (gl_FragCoord.y - 0.5) * TEXTURE_SIZE;
        gl_FragColor = vec4(hash, droneId, 0.0, 1.0);
    }
`

// SHADER 3: Bitonic Sort (Fragment Shader)
export const bitonicSortShaderFS = /*glsl*/ `
    uniform sampler2D uTexture;
    uniform int uStage;
    uniform int uSubStage;
    uniform float uTextureSize;
    varying vec2 vUv;

    void main() {
        int index = int(gl_FragCoord.x - 0.5) + int(gl_FragCoord.y - 0.5) * int(uTextureSize);
        
        int pairDistance = 1 << uSubStage;
        int blockWidth = pairDistance * 2;
        int stageWidth = 1 << uStage;

        int a = (index / blockWidth) * blockWidth + int(mod(float(index), float(pairDistance)));
        int b = a + int(pairDistance);
        
        vec2 uvA = vec2(mod(float(a), uTextureSize) + 0.5, floor(float(a) / uTextureSize) + 0.5) / uTextureSize;
        vec2 uvB = vec2(mod(float(b), uTextureSize) + 0.5, floor(float(b) / uTextureSize) + 0.5) / uTextureSize;

        vec4 valA = texture2D(uTexture, uvA);
        vec4 valB = texture2D(uTexture, uvB);

        bool isGreater = (mod(floor(float(index) / float(stageWidth)), 2.0)) < 1.0;

        if (valA.x > valB.x == isGreater) {
            gl_FragColor = valB;
        } else {
            gl_FragColor = valA;
        }
    }
`

// SHADER 4: Final Rendering (Vertex Shader) - TEMPORARY DEBUG VERSION
export const finalRenderShaderVS2 = /*glsl*/ `
    uniform sampler2D uPositionTexture; // We only need this one texture for the test
    attribute float a_id;
    varying vec3 vNormal;
    varying vec3 vColor;
    
    #define TEXTURE_SIZE 64.0

    // We don't need random() for this test, but keep hsl2rgb for color
    vec3 hsl2rgb(vec3 c) { vec3 rgb=clamp(abs(mod(c.x*6.+vec3(0,4,2),6.)-3.)-1.,0.,1.);return c.z+c.y*(rgb-.5)*(1.-abs(2.*c.z-1.)); }
    mat4 createMatrix(vec3 p, float s) { return mat4(s,0,0,0, 0,s,0,0, 0,0,s,0, p.x,p.y,p.z,1.0); }

    void main() {
        vNormal = normalize(normalMatrix * normal);

        // We can still color the drones to make sure they have a unique ID
        float hue = fract(sin(a_id) * 43758.5453123);
        vColor = hsl2rgb(vec3(hue, 0.8, 0.6));

        // --- THE DEBUG LOGIC ---
        // 1. Find our own coordinate in the texture
        vec2 ownUv = vec2(mod(a_id, TEXTURE_SIZE) / TEXTURE_SIZE, floor(a_id / TEXTURE_SIZE) / TEXTURE_SIZE);
        
        // 2. Read our ideal position directly from the output of the first compute pass
        vec3 finalPos = texture2D(uPositionTexture, ownUv).xyz;
        
        // 3. Completely IGNORE the sorting and separation force.
        // We are just checking if the base positions are being calculated correctly.

        mat4 finalMatrix = createMatrix(finalPos, 1.0);
        gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
    }
`

export const finalRenderShaderVS3 = /*glsl*/ `
    // We only need the position texture. We IGNORE the sorted hashes for this test.
    uniform sampler2D uPositionTexture;
    uniform float uTime;
    uniform float uSafetyRadius;
    uniform float uSeparationStrength;
    attribute float a_id;
    varying vec3 vNormal;
    varying vec3 vColor;
    
    #define DRONE_COUNT 4096.0
    #define TEXTURE_SIZE 64.0

    float random(float n) { return fract(sin(n + uTime) * 43758.5453123); }
    vec3 hsl2rgb(vec3 c) { vec3 rgb=clamp(abs(mod(c.x*6.+vec3(0,4,2),6.)-3.)-1.,0.,1.);return c.z+c.y*(rgb-.5)*(1.-abs(2.*c.z-1.)); }
    mat4 createMatrix(vec3 p, float s) { return mat4(s,0,0,0, 0,s,0,0, 0,0,s,0, p.x,p.y,p.z,1.0); }

    void main() {
        vNormal = normalize(normalMatrix * normal);
        float hue = random(a_id);
        vColor = hsl2rgb(vec3(hue, 0.8, 0.6));

        vec2 ownUv = vec2(mod(a_id, TEXTURE_SIZE) + 0.5, floor(a_id / TEXTURE_SIZE) + 0.5) / TEXTURE_SIZE;
        vec3 idealPos = texture2D(uPositionTexture, ownUv).xyz;

        // --- DEBUG: Use the old "Random Neighbor" check ---
        // This logic only depends on uPositionTexture, completely bypassing the sort.
        vec3 separationForce = vec3(0.0);
        for (int i = 0; i < 16; i++) {
            float neighborId = floor(random(float(i)) * DRONE_COUNT);
            if (neighborId == a_id) continue;

            vec2 neighborPosUv = vec2(mod(neighborId, TEXTURE_SIZE) + 0.5, floor(neighborId / TEXTURE_SIZE) + 0.5) / TEXTURE_SIZE;
            vec3 neighborPos = texture2D(uPositionTexture, neighborPosUv).xyz;

            float dist = distance(idealPos, neighborPos);
            if (dist < uSafetyRadius) {
                vec3 pushVector = idealPos - neighborPos;
                separationForce += normalize(pushVector) / (dist * dist);
            }
        }
        
        vec3 finalPos = idealPos + separationForce * uSeparationStrength;

        mat4 finalMatrix = createMatrix(finalPos, 1.0);
        gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
    }
`

// SHADER 4: Final Rendering (Vertex Shader)
export const finalRenderShaderVS = /*glsl*/ `
    uniform sampler2D uPositionTexture;
    uniform sampler2D uSortedHashes;
    uniform float uTime;
    uniform float uSafetyRadius;
    uniform float uSeparationStrength;
    attribute float a_id;
    varying vec3 vNormal;
    varying vec3 vColor;
    #define DRONE_COUNT 4096.0
    #define TEXTURE_SIZE 64.0

    float random(float n) { return fract(sin(n + uTime) * 43758.5453123); }
    vec3 hsl2rgb(vec3 c) { vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0)); }
    mat4 createMatrix(vec3 p, float s) { return mat4(s,0,0,0, 0,s,0,0, 0,0,s,0, p.x,p.y,p.z,1.0); }

    void main() {
        vNormal = normalize(normalMatrix * normal);
        float hue = random(a_id);
        vColor = hsl2rgb(vec3(hue, 0.8, 0.6));

        vec2 ownUv = vec2(mod(a_id, TEXTURE_SIZE) / TEXTURE_SIZE, floor(a_id / TEXTURE_SIZE) / TEXTURE_SIZE);
        vec3 idealPos = texture2D(uPositionTexture, ownUv).xyz;

        vec3 separationForce = vec3(0.0);
        for (int i = -8; i <= 8; i++) {
            if (i == 0) continue;
            float neighborIndex = a_id + float(i);
            if (neighborIndex < 0.0 || neighborIndex >= DRONE_COUNT) continue;
            
            vec2 neighborSortedUv = vec2(mod(neighborIndex, TEXTURE_SIZE) + 0.5, floor(neighborIndex / TEXTURE_SIZE) + 0.5) / TEXTURE_SIZE;
            vec2 neighborData = texture2D(uSortedHashes, neighborSortedUv).xy;
            float originalNeighborId = neighborData.y;
            
            vec2 neighborPosUv = vec2(mod(originalNeighborId, TEXTURE_SIZE) + 0.5, floor(originalNeighborId / TEXTURE_SIZE) + 0.5) / TEXTURE_SIZE;
            vec3 neighborPos = texture2D(uPositionTexture, neighborPosUv).xyz;
            
            float dist = distance(idealPos, neighborPos);
            if (dist < uSafetyRadius) {
                vec3 pushVector = idealPos - neighborPos;
                separationForce += normalize(pushVector) / (dist * dist);
            }
        }
        vec3 finalPos = idealPos + separationForce * uSeparationStrength;

        mat4 finalMatrix = createMatrix(finalPos, 1.0);
        gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
    }
`

// SHADER 5 & 6: Light and Body Appearance (Fragment Shaders)
export const lightShaderFS = /*glsl*/ `
    uniform float uTime;
    uniform float uPulseFrequency;
    varying vec3 vColor;
    void main() { float h = (sin(uTime * uPulseFrequency) + 1.0) / 2.0; h = pow(h, 3.0); gl_FragColor = vec4(vColor * (10.0 + h * 5.0), 1.0); }
`
export const bodyShaderFS = /*glsl*/ `
    uniform vec3 uSunlightDirection;
    uniform float uAmbientLight;
    varying vec3 vNormal;
    void main() { float d = max(0.0, dot(vNormal, uSunlightDirection)); gl_FragColor = vec4(vec3(0.05) * (vec3(d) + vec3(uAmbientLight)), 1.0); }
`
