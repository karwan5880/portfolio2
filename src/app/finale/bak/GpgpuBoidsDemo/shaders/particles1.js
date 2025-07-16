export const ParticlesMaterial = {
  vertexShader: /*glsl*/ `uniform sampler2D uPositionTexture;varying vec2 vUv;void main(){vec3 pos=texture2D(uPositionTexture,uv).xyz;vUv=uv;vec4 modelPosition=modelMatrix*vec4(pos,1.0);vec4 viewPosition=viewMatrix*modelPosition;vec4 projectedPosition=projectionMatrix*viewPosition;gl_Position=projectedPosition;gl_PointSize=1.7;}`,
  fragmentShader: /*glsl*/ `varying vec2 vUv; uniform sampler2D uTargetColorTexture; void main() { vec3 finalColor = texture2D(uTargetColorTexture, vUv).rgb; float brightness = length(finalColor); float glow = brightness < 0.6 ? 0.8 : 1.5; gl_FragColor = vec4(finalColor * glow, 0.8); }`,
}
