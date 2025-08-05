export const ParticlesMaterial = {
  vertexShader: /*glsl*/ `
    uniform sampler2D uPositionTexture;
    attribute float a_id; // The unique ID of each particle
    varying float v_age;
    uniform float uTime;
    uniform float uSpawnRate;

    void main() {
      // Get position from the simulation texture
      vec3 pos = texture2D(uPositionTexture, uv).xyz;
      
      // Calculate the age of the particle
      float spawnTime = a_id * uSpawnRate;
      v_age = uTime - spawnTime;
      
      // Standard boilerplate
      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
      
      // Make particles smaller and fade them out over their lifetime
      gl_PointSize = 2.0;
    }
  `,
  fragmentShader: /*glsl*/ `
    varying float v_age;
    uniform float uFadeInTime;

    void main() {
      // Fade particles in as they spawn
      float opacity = smoothstep(0.0, uFadeInTime, v_age);
      
      // Make the head of the snake brighter
      if (v_age > (256.0 * 256.0 * 0.01) - 2.0) { // A bit of a hack to find the head
        // this is not working well
      }

      // A nice, glowing color
      vec3 color = vec3(0.8, 0.9, 1.0);
      
      gl_FragColor = vec4(color, opacity * 0.8);
    }
  `,
}
