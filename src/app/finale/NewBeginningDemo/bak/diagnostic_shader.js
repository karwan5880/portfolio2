export const DiagnosticShader = {
  vertexShader: /*glsl*/ `
    uniform sampler2D uPositionTexture;
    
    // We need to pass the UV coordinate to the fragment shader
    varying vec2 vUv; 
    
    void main() {
        // Pass the uv attribute to our varying
        vUv = uv;

        // The position logic remains the same
        vec3 pos = texture2D(uPositionTexture, uv).xyz;
        vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        gl_PointSize = 15.0;
    }
    `,
  fragmentShader: /*glsl*/ `
    // Receive the UV coordinate from the vertex shader
    varying vec2 vUv;

    void main() {
        // No more 'discard'. No more simple green.
        // The particle's color is now a direct visualization of its internal address.
        // R = u, G = v, B = 0, A = 1
        gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
    }
    `,
}
