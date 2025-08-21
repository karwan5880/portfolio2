// This is a standard 4D simplex noise function. We don't need to understand
// the math, just that it gives us a smooth, random-like value.
const noise = `
  // Simplex 4D Noise
  // Copyright (c) 2017, Ian McEwan and Stefan Gustavson. All rights reserved.
  // https://github.com/stegu/webgl-noise
  
  vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec4 v) {
    const vec2 C = vec2(0.138196601125010504, 0.309016994374947451);
    vec4 i = floor(v + dot(v, C.yyyy));
    vec4 x0 = v - i + dot(i, C.xxxx);
    vec4 i0;
    vec3 isX = step(x0.yzw, x0.xxx);
    vec3 isYZ = step(x0.zww, x0.yyz);
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    i0.y += isYZ.x;
    i0.z += isYZ.y;
    i0.w += isYZ.z;
    i0.z += isYZ.x;
    i0.w += isYZ.y;
    i0.w += isYZ.x;
    vec4 i1 = i0;
    vec4 i2 = i0;
    vec4 i3 = i0;
    i1.x += 1.0; i2.y += 1.0; i3.z += 1.0;
    i1.yzw -= 1.0 - isX;
    i2.yzw -= 1.0 - isX;
    i3.yzw -= 1.0 - isX;
    i1.y -= isYZ.x; i1.z -= isYZ.y; i1.w -= isYZ.z;
    i2.y -= isYZ.x; i2.z -= isYZ.y; i2.w -= isYZ.z;
    i3.y -= isYZ.x; i3.z -= isYZ.y; i3.w -= isYZ.z;
    vec4 p0 = permute(i);
    vec4 p1 = permute(i + i1);
    vec4 p2 = permute(i + i2);
    vec4 p3 = permute(i + i3);
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - 1.0 + C.xxxx * 2.0;
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m*m;
    m = m*m;
    vec4 sx = x0 * m;
    vec4 sy = x2 * m;
    float A = dot(sx, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    return 10.0 * A;
  }
`

export default noise
