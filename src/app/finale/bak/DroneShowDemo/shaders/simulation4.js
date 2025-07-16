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

        void main() {
            vec3 currentPos = texture2D(uPositionTexture, vUv).xyz;
            vec3 baseTargetPos = texture2D(uTargetPositionTexture, vUv).xyz;
            vec4 droneInfo = texture2D(uDroneInfoTexture, vUv);
            
            
            float sequenceId = droneInfo.w;

            float arrivalTime = sequenceId * 1.0; 
            float arrivalDuration = 5.0; 
            float progress = smoothstep(0.0, arrivalDuration, uTime - arrivalTime);

            vec3 startPos = texture2D(uPositionTexture, vUv).xyz;

            vec3 animatedTargetPos = mix(startPos, baseTargetPos, progress);

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


        }
    `,
}
