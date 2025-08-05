export const SimulationMaterial = {
  vertexShader: /*glsl*/ `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader: /*glsl*/ `
    varying vec2 vUv;
    uniform sampler2D uPositionTexture;
    uniform float uTime;
    uniform float uSpawnRate;
    uniform float uFollowDistance;
    uniform float uFollowStrength;
    uniform float uNoiseSpeed;
    uniform float uNoiseStrength;

    const float SIZE = 256.0;

    // Simplex Noise function for smooth, organic movement
    vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
    vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
    vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.792842914-r*0.8537347209;}
    float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}

    void main() {
      // Calculate the unique ID of this particle
      float id = floor(vUv.y * SIZE) * SIZE + floor(vUv.x * SIZE);
      
      // Determine when this particle should spawn
      float spawnTime = id * uSpawnRate;

      vec3 currentPos = texture2D(uPositionTexture, vUv).xyz;
      vec3 finalPos = currentPos;

      // Only update particles that have spawned
      if (uTime >= spawnTime) {
        vec3 targetPos;

        // The Head Particle (ID 0)
        if (id == 0.0) {
          // It flies based on noise, creating a smooth, random path
          vec3 noiseInput1 = vec3(uTime * uNoiseSpeed, 0.0, 0.0);
          vec3 noiseInput2 = vec3(0.0, uTime * uNoiseSpeed, 0.0);
          vec3 noiseInput3 = vec3(0.0, 0.0, uTime * uNoiseSpeed);
          targetPos = vec3(
            snoise(noiseInput1) * uNoiseStrength,
            snoise(noiseInput2) * uNoiseStrength,
            snoise(noiseInput3) * uNoiseStrength
          );
        }
        // Follower Particles
        else {
          // Calculate the UV coordinates of the particle to follow (the one with id-1)
          float prevId = id - 1.0;
          float prevY = floor(prevId / SIZE);
          float prevX = mod(prevId, SIZE);
          vec2 prevUV = (vec2(prevX, prevY) + 0.5) / SIZE;
          
          // Get the position of the particle we are following
          targetPos = texture2D(uPositionTexture, prevUV).xyz;
        }

        vec3 direction = targetPos - currentPos;
        float distance = length(direction);
        vec3 velocity = vec3(0.0);

        // Move towards the target, but try to maintain the follow distance
        if (distance > uFollowDistance) {
          velocity = direction * uFollowStrength;
        }
        
        finalPos = currentPos + velocity;
      }

      gl_FragColor = vec4(finalPos, 1.0);
    }
  `,
}
