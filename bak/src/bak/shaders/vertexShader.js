// Refactored vertex shader with modular structure
import { buildShader } from './shaderUtils.js'

const VERTEX_MAIN = /*glsl*/ `
  uniform sampler2D uPositionTexture;
  uniform float uTime;
  uniform float uSafetyRadius;
  uniform float uSeparationStrength;
  uniform float uInstanceScale;
  attribute float a_id;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  vec3 getGlobalDroneColor(float droneId, float time) {
    if (isCountdownActive(time)) {
      return vec3(0.02, 0.02, 0.02); // Very dark during countdown
    } else if (isDomeFormationComplete(time)) {
      float dimFactor = getSmoothDimFactor(time);
      return getBeautifulRandomColor(droneId, time) * dimFactor;
    } else {
      return getBeautifulRandomColor(droneId, time);
    }
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);

    // Get position from texture
    vec2 ownUv = vec2(mod(a_id, TEXTURE_SIZE) + 0.5, floor(a_id / TEXTURE_SIZE) + 0.5) / TEXTURE_SIZE;
    vec4 positionData = texture2D(uPositionTexture, ownUv);
    vec3 idealPos = positionData.xyz;

    // Set color using global color control system
    vColor = getGlobalDroneColor(a_id, uTime);

    // Set position
    vec3 finalPos = idealPos;
    vPosition = finalPos;

    mat4 finalMatrix = createMatrix(finalPos, uInstanceScale);
    vec4 worldPosition = finalMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * worldPosition;
    vViewPosition = viewPosition.xyz;
    
    gl_Position = projectionMatrix * viewPosition;
  }
`

export const finalRenderShaderVS = buildShader(VERTEX_MAIN, ['HSL_TO_RGB', 'CREATE_MATRIX'])
