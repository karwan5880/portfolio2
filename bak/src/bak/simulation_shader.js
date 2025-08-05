export const SimulationShader = {
  vertexShader: /*glsl*/ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
  fragmentShader: /*glsl*/ `
        varying vec2 vUv;
        uniform sampler2D uPositionTexture;
        void main() {
            vec3 currentPos = texture2D(uPositionTexture, vUv).xyz;
            vec3 newPos = currentPos + vec3(0.01, 0.01, 0.0);
            gl_FragColor = vec4(newPos, 1.0);
        }
    `,
}
