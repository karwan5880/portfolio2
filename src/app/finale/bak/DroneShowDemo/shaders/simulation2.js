export const SimulationMaterial = {
  vertexShader: /*glsl*/ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
  fragmentShader: /*glsl*/ `
        varying vec2 vUv;
        uniform sampler2D uPositionTexture;
        uniform sampler2D uTargetPositionTexture;
        uniform sampler2D uDroneInfoTexture;
        uniform float uTime;
        uniform float uRepulsionRadius;
        uniform float uRepulsionStrength;
        uniform float uShowProgress; // For entrance/exit animation

        const float TEXTURE_SIZE = 64.0;

        // --- Animation Functions ---
        vec3 animateTail(vec3 pos, float time) {
            pos.x += sin(time * 0.5) * 5.0;
            return pos;
        }
        vec3 animateHead(vec3 pos, float time) {
            pos.x -= sin(time * 0.5) * 5.0;
            return pos;
        }

        void main() {
            vec3 currentPos = texture2D(uPositionTexture, vUv).xyz;
            vec3 baseTargetPos = texture2D(uTargetPositionTexture, vUv).xyz;
            vec4 droneInfo = texture2D(uDroneInfoTexture, vUv);
            float groupId = droneInfo.x;

            // --- Apply Independent Animation ---
            vec3 animatedTargetPos = baseTargetPos;
            if (groupId == ${choreography.DRAGON_TAIL.toFixed(1)}) {
                animatedTargetPos = animateTail(baseTargetPos, uTime);
            } else if (groupId == ${choreography.DRAGON_HEAD.toFixed(1)}) {
                animatedTargetPos = animateHead(baseTargetPos, uTime);
            }
            
            // --- Entrance/Exit Animation ---
            vec3 offscreenPos = vec3(currentPos.x, -50.0, currentPos.z);
            vec3 finalTargetPos = mix(offscreenPos, animatedTargetPos, uShowProgress);

            // --- Physics (Movement & Repulsion) ---
            vec3 direction = finalTargetPos - currentPos;
            vec3 velocity = direction * 0.1;
            vec3 intendedPos = currentPos + velocity;
            
            vec3 repulsion = vec3(0.0);
            // ... (repulsion logic is the same)
            for (float x=-1.0; x<=1.0; x++) {for(float y=-1.0;y<=1.0;y++){if(x==0.0&&y==0.0)continue;vec3 neighborPos=texture2D(uPositionTexture,vUv+vec2(x,y)/TEXTURE_SIZE).xyz;vec3 diff=intendedPos-neighborPos;float dist=length(diff);if(dist<uRepulsionRadius){repulsion+=normalize(diff)*(uRepulsionRadius-dist);}}}

            vec3 finalPos = intendedPos + repulsion * uRepulsionStrength;
            gl_FragColor = vec4(finalPos, 1.0);
        }
    `,
}
