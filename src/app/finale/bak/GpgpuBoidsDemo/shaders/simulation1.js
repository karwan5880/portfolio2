export const SimulationMaterial = {
  vertexShader: /*glsl*/ `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader: /*glsl*/ `varying vec2 vUv;uniform sampler2D uPositionTexture;uniform sampler2D uTargetPositionTexture;uniform sampler2D uDroneDataTexture;uniform float uTime;uniform float uSwitchTime;uniform vec2 uTexelSize;uniform float uRepulsionRadius;uniform float uRepulsionStrength;uniform float uSearchRadius;vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod(Pi0,289.);Pi1=mod(Pi1,289.);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.yy,Pi1.yy);vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0/7.;vec4 gy0=fract(floor(gx0)/7.)-.5;gx0=fract(gx0);vec4 gz0=.5-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1/7.;vec4 gy1=fract(floor(gx1)/7.)-.5;gx1=fract(gx1);vec4 gz1=.5-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);vec3 fade_xyz=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);return 2.2*n_xyz;}
    void main(){
      vec3 currentPos = texture2D(uPositionTexture, vUv).xyz;
      vec3 targetPos = texture2D(uTargetPositionTexture, vUv).xyz;
      vec4 droneData = texture2D(uDroneDataTexture, vUv);
      vec3 intendedPos = currentPos;
      float takeoffDelay = 1.5;
      float takeoffTime = uSwitchTime + droneData.x * takeoffDelay;
      if(uTime >= takeoffTime){
        vec3 direction = targetPos - currentPos;
        float distance = length(direction);
        vec3 velocity = vec3(0.0);
        float speed = 0.08;
        if(distance > 0.01){
          if(distance < speed){
            velocity = direction;
          } else {
            velocity = normalize(direction) * speed;
          }
        }
        float noise = cnoise(currentPos * 0.5 + uTime * 0.5);
        velocity += noise * 0.005;
        intendedPos = currentPos + velocity;
      }
      vec3 repulsionVector = vec3(0.0);
      for (float x = -uSearchRadius; x <= uSearchRadius; x++) {
        for (float y = -uSearchRadius; y <= uSearchRadius; y++) {
          if (x == 0.0 && y == 0.0) continue;
          vec2 neighborUv = vUv + vec2(x, y) * uTexelSize;
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
    }`,
}
