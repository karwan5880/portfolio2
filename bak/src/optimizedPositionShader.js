// Optimized drone position shader with state-based formations and unified formation system

export const optimizedDronePositionShader = /*glsl*/ `
    uniform float uTime;
    uniform float uScale;
    uniform float uTextureSize;

    #define DRONE_COUNT 4096.0
    #define GRID_ROWS 128.0
    #define GRID_COLS 32.0

    float random(float n) { 
        return fract(sin(n) * 43758.5453123); 
    }

    // Formation state management
    int getCurrentFormationState(float time) {
        if (time < 5.0) return 0;   // Hidden
        if (time < 15.0) return 1;  // Revealing
        if (time < 42.0) return 2;  // Flying
        if (time < 75.0) return 3;  // Split
        if (time < 105.0) return 4; // Circle
        if (time < 110.0) return 5; // Rainbow 1
        if (time < 115.0) return 6; // Rainbow 2
        if (time < 120.0) return 7; // Rainbow 3
        if (time < 125.0) return 8; // Rainbow 4
        if (time < 130.0) return 9; // Rainbow 5
        if (time < 135.0) return 10; // Rainbow 6
        return 11; // Additional formations
    }

    float calculateRevealFactor(float time, float row, float col) {
        if (time < 5.0) return 0.0;
        if (time >= 15.0) return 1.0;
        
        // Column reveal logic (5-15s)
        float distanceFromCenter = abs(col - 15.5);
        float normalizedDistance = distanceFromCenter / 15.5;
        float revealDelay = (1.0 - normalizedDistance) * (1.0 - normalizedDistance);
        float columnRevealTime = 5.0 + revealDelay * 9.0;
        float columnRevealDuration = 1.2;
        
        if (time >= columnRevealTime) {
            float revealProgress = min(1.0, (time - columnRevealTime) / columnRevealDuration);
            return smoothstep(0.0, 1.0, revealProgress);
        }
        return 0.0;
    }

    // Unified formation calculation with proper transitions
    vec3 calculateFormationPosition(int formationState, float time, float row, float col, float droneId, vec3 splitPos) {
        bool isLeftGroup = col < 16.0;
        
        // Circle formation (state 4) - WITH PROPER TRANSITION
        if (formationState >= 4 && row < 2.0) {
            float circlePhaseStart = 75.0;
            
            if (time < circlePhaseStart) {
                return splitPos; // Stay in split formation until circle starts
            }
            
            vec3 formationCenter = vec3(0.0, 350.0, 0.0);
            float circleRadius = 100.0;
            
            float droneAngle;
            if (isLeftGroup) {
                float leftDroneIndex = row * 16.0 + col;
                droneAngle = 1.5708 + (leftDroneIndex / 32.0) * 3.14159;
            } else {
                float rightDroneIndex = row * 16.0 + (col - 16.0);
                droneAngle = -1.5708 + (rightDroneIndex / 32.0) * 3.14159;
            }
            
            vec3 circlePos = formationCenter + vec3(
                circleRadius * cos(droneAngle),
                circleRadius * sin(droneAngle),
                0.0
            );
            
            // Enhanced wave-based movement to circle (COPIED FROM ORIGINAL)
            float distanceToCircle = length(circlePos - splitPos);
            float waveFactor = clamp((distanceToCircle - 100.0) / 500.0, 0.0, 1.0);
            
            // Smoother wave timing with side-based delays
            float baseDelay = (1.0 - waveFactor) * 10.0; // 10 second max delay
            float sideDelay = isLeftGroup ? 0.0 : 2.0; // Right side starts 2s after left
            float waveDelay = baseDelay + sideDelay;
            
            float droneStartTime = circlePhaseStart + waveDelay;
            float droneMoveDuration = 6.0; // Smoother, faster movement
            
            if (time >= droneStartTime) {
                float progress = min(1.0, (time - droneStartTime) / droneMoveDuration);
                return mix(splitPos, circlePos, smoothstep(0.0, 1.0, progress));
            } else {
                return splitPos; // Wait for turn
            }
        }
        
        // Rainbow formations (states 5-10)
        if (formationState >= 5) {
            // Determine which rainbow this drone participates in
            int rainbowIndex = -1;
            vec3 rainbowCenter;
            float rainbowRadius;
            bool isUpward = true;
            bool isDepthArc = false;
            
            if (formationState >= 5 && row == 2.0) {
                rainbowIndex = 0; // Top rainbow
                rainbowCenter = vec3(0.0, 450.0, 0.0);
                rainbowRadius = 200.0;
                isUpward = true;
            } else if (formationState >= 6 && row == 4.0) {
                rainbowIndex = 1; // Inverted rainbow
                rainbowCenter = vec3(0.0, 250.0, 0.0);
                rainbowRadius = 200.0;
                isUpward = false;
            } else if (formationState >= 7 && row == 6.0) {
                rainbowIndex = 2; // Bigger inverted rainbow
                rainbowCenter = vec3(0.0, 150.0, 0.0);
                rainbowRadius = 300.0;
                isUpward = false;
            } else if (formationState >= 8 && row == 8.0) {
                rainbowIndex = 3; // Bigger upper rainbow
                rainbowCenter = vec3(0.0, 600.0, 0.0);
                rainbowRadius = 350.0;
                isUpward = true;
            } else if (formationState >= 9 && (row == 10.0 || row == 11.0)) {
                rainbowIndex = 4; // Front/back rainbow
                rainbowCenter = vec3(0.0, 350.0, 0.0);
                rainbowRadius = 250.0;
                isDepthArc = true;
                isUpward = (row == 10.0); // Front arc for row 10, back arc for row 11
            } else if (formationState >= 10 && (row == 12.0 || row == 13.0)) {
                rainbowIndex = 5; // Bigger front/back rainbow
                rainbowCenter = vec3(0.0, 350.0, 0.0);
                rainbowRadius = 400.0;
                isDepthArc = true;
                isUpward = (row == 12.0); // Front arc for row 12, back arc for row 13
            }
            
            if (rainbowIndex >= 0) {
                // Calculate rainbow position
                float droneIndex = isLeftGroup ? (15.0 - col) : (16.0 + (col - 16.0));
                float totalDrones = 32.0;
                float normalizedPosition = (droneIndex / (totalDrones - 1.0)) - 0.5;
                float arcAngle = normalizedPosition * 3.14159;
                
                // Apply timing
                float startTimes[6] = float[6](105.0, 110.0, 115.0, 120.0, 125.0, 130.0);
                float startTime = startTimes[rainbowIndex];
                float distanceFromCenter = abs(normalizedPosition);
                float moveDelay = distanceFromCenter * 30.0;
                float droneStartTime = startTime + moveDelay;
                float droneMoveDuration = 8.0;
                
                if (time >= droneStartTime) {
                    float progress = min(1.0, (time - droneStartTime) / droneMoveDuration);
                    float smoothProgress = smoothstep(0.0, 1.0, progress);
                    
                    vec3 rainbowPos;
                    if (isDepthArc) {
                        // Front/back arc using Z-axis
                        if (isUpward) {
                            // Front arc
                            rainbowPos = vec3(
                                rainbowRadius * sin(arcAngle),
                                rainbowCenter.y,
                                rainbowCenter.z + rainbowRadius * cos(arcAngle)
                            );
                        } else {
                            // Back arc
                            rainbowPos = vec3(
                                rainbowRadius * sin(arcAngle),
                                rainbowCenter.y,
                                rainbowCenter.z - rainbowRadius * cos(arcAngle)
                            );
                        }
                    } else {
                        // Regular rainbow using Y-axis
                        if (isUpward) {
                            rainbowPos = vec3(
                                rainbowRadius * sin(arcAngle),
                                rainbowCenter.y + rainbowRadius * cos(arcAngle),
                                rainbowCenter.z
                            );
                        } else {
                            rainbowPos = vec3(
                                rainbowRadius * sin(arcAngle),
                                rainbowCenter.y - rainbowRadius * cos(arcAngle),
                                rainbowCenter.z
                            );
                        }
                    }
                    
                    return mix(splitPos, rainbowPos, smoothProgress);
                }
            }
        }
        
        return splitPos;
    }

    vec3 calculatePosition(float time, float row, float col, float droneId, vec3 groundPos) {
        int state = getCurrentFormationState(time);
        
        // Ground position for early states
        if (state <= 1) {
            return vec3(groundPos.x, 0.0, groundPos.z);
        }
        
        // Calculate flight height once
        float random1 = random(droneId * 0.001);
        float random2 = random(droneId * 0.001 + 1000.0);
        float finalHeight = 200.0 + random2 * 100.0;
        
        // Flying state (2)
        if (state == 2) {
            float rowDelay = 0.1;
            float stage1StartTime = 15.0 + row * rowDelay;
            float stage1Duration = 6.0;
            float stage1EndTime = stage1StartTime + stage1Duration;
            float stage2Duration = 8.0;
            float stage2EndTime = stage1EndTime + stage2Duration;
            
            if (time <= stage1StartTime) {
                return vec3(groundPos.x, 0.0, groundPos.z);
            } else if (time <= stage1EndTime) {
                float stage1Progress = (time - stage1StartTime) / stage1Duration;
                float intermediateHeight = 30.0 + random1 * 70.0;
                return vec3(groundPos.x, stage1Progress * intermediateHeight, groundPos.z);
            } else if (time <= stage2EndTime) {
                float stage2Progress = (time - stage1EndTime) / stage2Duration;
                float intermediateHeight = 30.0 + random1 * 70.0;
                float currentHeight = intermediateHeight + stage2Progress * (finalHeight - intermediateHeight);
                return vec3(groundPos.x, currentHeight, groundPos.z);
            } else {
                return vec3(groundPos.x, finalHeight, groundPos.z);
            }
        }
        
        // Split formation (state 3+)
        vec3 splitPos = groundPos;
        if (state >= 3) {
            // Split transition
            float splitStartTime = 42.0;
            float splitDuration = 18.0;
            
            bool isLeftGroup = col < 16.0;
            float separationDistance = 300.0;
            
            vec3 targetSplitPos;
            if (isLeftGroup) {
                float leftCenterX = -separationDistance;
                float newX = leftCenterX + (col - 7.5) * 6.0;
                targetSplitPos = vec3(newX, finalHeight + sin(row / GRID_ROWS * 3.14159) * 30.0, groundPos.z);
            } else {
                float rightCenterX = separationDistance;
                float newX = rightCenterX + (col - 23.5) * 6.0;
                targetSplitPos = vec3(newX, finalHeight + sin(row / GRID_ROWS * 3.14159) * 30.0, groundPos.z);
            }
            
            if (time <= splitStartTime) {
                splitPos = vec3(groundPos.x, finalHeight, groundPos.z);
            } else {
                float splitProgress = min(1.0, (time - splitStartTime) / splitDuration);
                vec3 currentPos = vec3(groundPos.x, finalHeight, groundPos.z);
                splitPos = mix(currentPos, targetSplitPos, smoothstep(0.0, 1.0, splitProgress));
            }
        }
        
        // Apply formations
        return calculateFormationPosition(state, time, row, col, droneId, splitPos);
    }

    void main() {
        float droneId = gl_FragCoord.x - 0.5 + (gl_FragCoord.y - 0.5) * uTextureSize;

        if (droneId >= DRONE_COUNT) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        
        float row = floor(droneId / GRID_COLS);
        float col = mod(droneId, GRID_COLS);
        
        float spacing = 8.0;
        vec3 groundPos = vec3(
            (col - GRID_COLS/2.0 + 0.5) * spacing,
            0.0,
            (row - GRID_ROWS/2.0 + 0.5) * spacing
        );
        
        float revealFactor = calculateRevealFactor(uTime, row, col);
        vec3 position = calculatePosition(uTime, row, col, droneId, groundPos);
        
        gl_FragColor = vec4(position * uScale, revealFactor);
    }
`
