export const ParticlesMaterial = {
  vertexShader: /*glsl*/ `
    uniform sampler2D uPositionTexture;
    varying vec2 vUv; 
    void main() {
        vUv = uv;
        vec3 pos = texture2D(uPositionTexture, uv).xyz;
        vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        gl_PointSize = 4.0;
    }
    `,
  fragmentShader: /*glsl*/ `
    uniform sampler2D uTargetColorTexture;
    varying vec2 vUv;
    void main() {
        vec4 colorData = texture2D(uTargetColorTexture, vUv);
        
        // Discard "dark" drones to achieve the instant reveal effect later
        if (colorData.a < 0.1) discard;

        // A nice glowing circle
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        gl_FragColor = vec4(colorData.rgb, 1.0);
    }
    `,
}
