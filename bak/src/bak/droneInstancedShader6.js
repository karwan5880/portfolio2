// droneInstancedShader.js - Active shaders for the drone particle system

// Main rendering vertex shader with formation-based colors
export const finalRenderShaderVS = /*glsl*/ `
    uniform sampler2D uPositionTexture;
    uniform float uTime;
    uniform float uSafetyRadius;
    uniform float uSeparationStrength;
    attribute float a_id;
    varying vec3 vNormal;
    varying vec3 vColor;
    #define DRONE_COUNT 4096.0
    #define TEXTURE_SIZE 64.0

    vec3 hsl2rgb(vec3 c) { 
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); 
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0)); 
    }
    mat4 createMatrix(vec3 p, float s) { return mat4(s,0,0,0, 0,s,0,0, 0,0,s,0, p.x,p.y,p.z,1.0); }

    vec3 getFormationColor(float formationGroup, float time) {
        // Dynamic color cycling based on time
        float timeOffset = time * 0.5;
        
        if (formationGroup < 0.5) {
            // HERO DRONE: Bright gold/white - the star of the show
            return hsl2rgb(vec3(0.15 + sin(timeOffset) * 0.05, 0.9, 0.95));
        } else if (formationGroup < 1.5) {
            // INNER CIRCLE: Electric blue - supporting cast
            return hsl2rgb(vec3(0.6 + sin(timeOffset + 1.0) * 0.1, 0.8, 0.8));
        } else if (formationGroup < 2.5) {
            // MIDDLE RING: Vibrant purple/magenta - dramatic accent
            return hsl2rgb(vec3(0.8 + sin(timeOffset + 2.0) * 0.1, 0.85, 0.75));
        } else {
            // OUTER RING: Deep red/orange - atmospheric backdrop
            return hsl2rgb(vec3(0.05 + sin(timeOffset + 3.0) * 0.08, 0.9, 0.7));
        }
    }

    void main() {
        vNormal = normalize(normalMatrix * normal);

        // Get position and formation group from texture
        vec2 ownUv = vec2(mod(a_id, TEXTURE_SIZE) + 0.5, floor(a_id / TEXTURE_SIZE) + 0.5) / TEXTURE_SIZE;
        vec4 positionData = texture2D(uPositionTexture, ownUv);
        vec3 idealPos = positionData.xyz;
        float formationGroup = positionData.w;

        // Assign formation-based colors
        vColor = getFormationColor(formationGroup, uTime);

        // Use structured positions directly
        vec3 finalPos = idealPos;

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
