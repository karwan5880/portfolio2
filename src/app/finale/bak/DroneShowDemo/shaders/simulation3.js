import { choreography } from '../choreography'

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
        const float TEXTURE_SIZE = 64.0;

        //const float SIZE = 64.0;

        /*vec3 animateGroupA(vec3 pos, float time) {
            // A slow, circular breathing motion
            float angle = time * 0.5;
            pos.x += cos(angle) * 5.0;
            pos.z += sin(angle) * 5.0;
            return pos;
        }

        vec3 animateGroupB(vec3 pos, float time) {
            // The opposite motion to Group A
            float angle = time * 0.5;
            pos.x -= cos(angle) * 5.0;
            pos.z -= sin(angle) * 5.0;
            return pos;
        }*/

        void main() {
            vec3 currentPos = texture2D(uPositionTexture, vUv).xyz;
            //vec3 targetPos = texture2D(uTargetPositionTexture, vUv).xyz;
            vec3 baseTargetPos = texture2D(uTargetPositionTexture, vUv).xyz;
            vec4 droneInfo = texture2D(uDroneInfoTexture, vUv);
            //float groupId = droneInfo.x;
            
            
            float col = droneInfo.x;
            float row = droneInfo.y;
            float layer = droneInfo.z;
            
            // Critique 1 Fix: Arrival is based on layer and row, not a single sequence.
            float layerDelay = layer * 2.0; // Each layer waits 2 seconds after the last.
            float rowDelay = row * 0.2;     // Each row within a layer waits 0.2s.
            float arrivalTime = layerDelay + rowDelay;

            // Critique 2 Fix: A longer, smoother "wave" of animation.
            float arrivalDuration = 8.0; 

            float progress = smoothstep(0.0, arrivalDuration, uTime - arrivalTime);

            // Critique 3 Fix: A majestic starting gate off to the side and back.
            vec3 startPos = vec3(100.0, 50.0, -100.0);
            
            vec3 animatedTargetPos = mix(startPos, baseTargetPos, progress);



            /*vec3 animatedTargetPos = baseTargetPos;
            if (groupId == ${choreography.GROUP_A.toFixed(1)}) {
                animatedTargetPos = animateGroupA(baseTargetPos, uTime);
            } else if (groupId == ${choreography.GROUP_B.toFixed(1)}) {
                animatedTargetPos = animateGroupB(baseTargetPos, uTime);
            }*/

            // --- Move towards target (Damped Spring) ---
            //vec3 direction = targetPos - currentPos;
            vec3 direction = animatedTargetPos - currentPos;
            vec3 velocity = direction * 0.004; // Damping factor
            vec3 intendedPos = currentPos + velocity;
            
            vec3 repulsion = vec3(0.0);
            for (float x=-1.0; x<=1.0; x++) {
              for(float y=-1.0;y<=1.0;y++){
                if(x==0.0&&y==0.0)continue;
                  vec3 nPos=texture2D(uPositionTexture,vUv+vec2(x,y)/TEXTURE_SIZE).xyz;
                  vec3 diff=intendedPos-nPos;
                  float d=length(diff);
                  if(d<uRepulsionRadius){
                    repulsion+=normalize(diff)*(uRepulsionRadius-d);
                  }
                }
              }
            vec3 finalPos = intendedPos + repulsion * uRepulsionStrength;
            gl_FragColor = vec4(finalPos, 1.0);

            // --- Repulsion from neighbors ---
            /*vec3 repulsionVector = vec3(0.0);
            for (float x = -1.0; x <= 1.0; x++) {
                for (float y = -1.0; y <= 1.0; y++) {
                    if (x == 0.0 && y == 0.0) continue;

                    vec2 neighborUv = vUv + vec2(x, y) / SIZE;
                    vec3 neighborPos = texture2D(uPositionTexture, neighborUv).xyz;
                    vec3 diff = intendedPos - neighborPos;
                    float dist = length(diff);

                    if (dist < uRepulsionRadius) {
                        repulsionVector += normalize(diff) * (uRepulsionRadius - dist);
                    }
                }
            }
            vec3 finalPos = intendedPos + repulsionVector * uRepulsionStrength;
            gl_FragColor = vec4(finalPos, 1.0);
            */
        }
    `,
}
