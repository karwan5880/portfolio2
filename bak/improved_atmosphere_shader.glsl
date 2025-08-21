// Enhanced Atmosphere Fragment Shader
uniform vec3 uSunPosition;
uniform vec3 uCameraPosition;
uniform float uDensity;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;

// Rayleigh scattering coefficients (wavelength dependent)
const vec3 rayleighCoeff = vec3(5.8e-6, 13.5e-6, 33.1e-6); // RGB wavelengths
const float mieCoeff = 21e-6;
const float rayleighScale = 8000.0; // Scale height
const float mieScale = 1200.0;

// Atmospheric color palette
const vec3 skyBlue = vec3(0.3, 0.6, 1.0);
const vec3 horizonBlue = vec3(0.4, 0.7, 1.0);
const vec3 sunsetOrange = vec3(1.0, 0.4, 0.1);
const vec3 sunsetRed = vec3(1.0, 0.2, 0.1);
const vec3 twilightPurple = vec3(0.4, 0.2, 0.8);
const vec3 nightBlue = vec3(0.05, 0.1, 0.3);

float atmosphericDensity(float altitude) {
    // Exponential falloff with altitude
    return exp(-altitude / rayleighScale);
}

vec3 calculateScattering(vec3 viewDir, vec3 sunDir, float altitude) {
    float cosTheta = dot(viewDir, sunDir);
    float sunAngle = acos(cosTheta);
    
    // Rayleigh scattering (blue sky)
    float rayleighPhase = 0.75 * (1.0 + cosTheta * cosTheta);
    vec3 rayleighScatter = rayleighCoeff * rayleighPhase;
    
    // Mie scattering (haze, forward scattering)
    float g = 0.76; // Asymmetry parameter
    float miePhase = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * cosTheta, 1.5);
    float mieScatter = mieCoeff * miePhase;
    
    // Combine scattering
    vec3 totalScatter = rayleighScatter + vec3(mieScatter);
    
    // Apply atmospheric density
    float density = atmosphericDensity(altitude);
    return totalScatter * density;
}

vec3 getAtmosphereColor(vec3 viewDir, vec3 sunDir, float altitude, float sunElevation) {
    // Base scattering calculation
    vec3 scatterColor = calculateScattering(viewDir, sunDir, altitude);
    
    // Sun elevation affects overall color tone
    float dayFactor = smoothstep(-0.2, 0.3, sunElevation);
    float sunsetFactor = smoothstep(-0.1, 0.1, sunElevation) * (1.0 - smoothstep(0.1, 0.3, sunElevation));
    float nightFactor = 1.0 - smoothstep(-0.3, -0.1, sunElevation);
    
    // Color mixing based on sun position
    vec3 dayColor = mix(horizonBlue, skyBlue, smoothstep(0.0, 0.5, altitude));
    vec3 sunsetColor = mix(sunsetRed, sunsetOrange, smoothstep(0.0, 0.3, altitude));
    vec3 twilightColor = mix(nightBlue, twilightPurple, smoothstep(0.0, 0.2, altitude));
    
    // Blend colors based on time of day
    vec3 finalColor = dayColor * dayFactor + 
                     sunsetColor * sunsetFactor + 
                     twilightColor * nightFactor;
    
    // Apply scattering influence
    finalColor = mix(finalColor, finalColor * scatterColor, 0.7);
    
    return finalColor;
}

void main() {
    vec3 viewDirection = normalize(uCameraPosition - vPosition);
    vec3 sunDirection = normalize(uSunPosition - vPosition);
    
    // Calculate fresnel effect
    float dotProduct = dot(viewDirection, vNormal);
    float fresnel = pow(1.0 - max(0.0, dotProduct), 2.5);
    
    // Calculate altitude (distance from surface)
    float altitude = length(vPosition) - 2.0; // Planet radius = 2.0
    altitude = clamp(altitude, 0.0, 1.0);
    
    // Sun elevation angle
    float sunElevation = dot(vNormal, sunDirection);
    
    // Get enhanced atmosphere color
    vec3 atmosphereColor = getAtmosphereColor(viewDirection, sunDirection, altitude, sunElevation);
    
    // Light intensity with atmospheric absorption
    float lightIntensity = max(0.0, sunElevation);
    float absorption = exp(-altitude * 2.0); // Atmospheric absorption
    
    // Rim lighting effect
    float rim = smoothstep(0.3, 1.0, lightIntensity) * fresnel * uDensity;
    
    // Final color with enhanced lighting
    vec3 finalColor = atmosphereColor * (lightIntensity * absorption + rim * 0.5);
    
    // Add subtle animation for atmospheric movement
    float noise = sin(uTime * 0.1 + vPosition.x * 10.0) * 0.02;
    finalColor += vec3(noise);
    
    gl_FragColor = vec4(finalColor, fresnel * lightIntensity + rim);
}