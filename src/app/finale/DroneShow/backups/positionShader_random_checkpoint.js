// CHECKPOINT: Distance-based timing with random variations
// Saved on: Current date
// This version implements:
// - 128×32 rectangle formation (4 quadrants)
// - Distance-based timing (farthest drones start first)
// - Random timing variations for all 4096 drones
// - Random speed variations (0.7x to 1.3x)
// - Random pause variations (2.0-3.5s)
// - Fixed flickering issue (stable random seed)

// Main drone position shader - controls all drone movements and formations

export const dronePositionShader = /*glsl*/ `
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
        if (time < 52.0) return 3;  // Split (reduced duration)
        return 4; // Sequential test - NO TIME LIMIT, RUNS FOREVER
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
        
        // 8-PLANE RECTANGLE FORMATION: Einstein GPU Collision Avoidance Algorithm
        if (formationState == 4) {
            float testStartTime = 52.0;
            float timeInTest = time - testStartTime;
            
            if (timeInTest < 0.0) return splitPos; // Not started yet
            
            // 8-PLANE FORMATION: 2×4 grid of rectangular planes
            float spacing = 6.0;
            
            // RESTORE WORKING 128×32 RECTANGLE LOGIC FROM CHECKPOINT
            float rectCenterX = 0.0; // Perfectly centered at origin
            float rectCenterY = 150.0;  // Lowered further from 200 to 150
            
            // Determine quadrant (ORIGINAL WORKING LOGIC)
            bool isTopQuadrant = row >= 64.0;
            bool isLeftQuadrant = col < 16.0;
            
            // X: Each row gets its own column position (PROPERLY CENTERED)
            float columnIndex = isTopQuadrant ? (127.0 - row) : (63.0 - row); // 0-63 within quadrant
            // Center the formation: total width is 128 rows * 6 spacing = 768 units
            // So offset each quadrant by half the total width
            float quadrantXOffset = isLeftQuadrant ? -384.0 : 0.0; // Left starts at -384, right at 0
            float finalX = rectCenterX + quadrantXOffset + columnIndex * spacing;
            
            // Y: Final Y positions based on original column and quadrant (lowered)
            float colWithinQuadrant = isLeftQuadrant ? col : (col - 16.0); // 0-15 within quadrant
            float quadrantYOffset = isTopQuadrant ? 8.0 : -8.0; // Top/bottom quadrant offset
            float finalY = rectCenterY + quadrantYOffset * spacing + colWithinQuadrant * spacing;
            
            vec3 finalTarget = vec3(
                finalX,     // X: Row-based column positioning (slightly left)
                finalY,     // Y: Lowered final positions
                150.0       // Z: Moved even further back (150 instead of 200)
            );
            
            // EINSTEIN ALGORITHM V8: TWO-PHASE SMOOTH FORMATION
            
            // EINSTEIN ALGORITHM V10: SEQUENTIAL AXIS MOVEMENT (COLLISION-PROOF)
            
            // CONSTANT SPEED MOVEMENT SYSTEM (NORMAL SPEED)
            float CONSTANT_SPEED = 60.0; // Units per second - normal speed for production
            
            // FUN RANDOM SEED: Generate unique randomness for each drone (FIXED - no time component)
            float randomSeed = droneId * 0.001; // Unique seed per drone, stable across frames
            
            float basePauseDuration = 2.0; // Base 2 second pause between axes
            float randomPauseVariation = random(randomSeed + 2000.0) * 1.5; // 0-1.5s additional pause
            float axisPauseDuration = basePauseDuration + randomPauseVariation; // 2.0-3.5s random pauses
            
            // Calculate distances for each axis
            vec3 startPos = splitPos;
            vec3 endPos = finalTarget;
            
            float yDistance = abs(endPos.y - startPos.y);
            float xDistance = abs(endPos.x - startPos.x);
            float zDistance = abs(endPos.z - startPos.z);
            
            // DISTANCE-BASED TIMING: Farthest drones start first for synchronized completion
            
            // Calculate total distance this drone needs to travel
            float totalDistance = yDistance + xDistance + zDistance;
            
            // Calculate total movement time including pauses
            float totalMovementTime = (totalDistance / CONSTANT_SPEED) + (2.0 * 2.0); // 2 pauses of 2s each
            
            // Find maximum possible distance for normalization
            // Estimate: max distance from split position to rectangle corners
            float maxEstimatedDistance = 1000.0 + 400.0 + 600.0; // Rough estimate for normalization
            float maxEstimatedMovementTime = (maxEstimatedDistance / CONSTANT_SPEED) + 4.0;
            
            // Distance-based delay: farthest drones start first (0 delay), closest start last
            float distanceRatio = totalDistance / maxEstimatedDistance;
            float maxDelay = 20.0; // Maximum delay for closest drones
            float distanceBasedDelay = maxDelay * (1.0 - distanceRatio); // Invert: far=0, close=maxDelay
            
            // Add small wave pattern for visual effect (optional)
            float waveDelay = 0.0;
            if (row >= 96.0) {
                waveDelay = (127.0 - row) * 0.1; // 0-3.1s subtle wave
            } else if (row >= 64.0) {
                waveDelay = (95.0 - row) * 0.1; // 0-3.1s subtle wave
            } else if (row >= 32.0) {
                waveDelay = (row - 32.0) * 0.1; // 0-3.1s subtle wave (reversed)
            } else {
                waveDelay = row * 0.1; // 0-3.1s subtle wave (reversed)
            }
            
            float colMicroStagger = col * 0.02; // Reduced from 0.05s to 0.02s
            
            // FUN RANDOM TIMING: Add uncertainty for all 4096 drones!
            float randomDelay = random(randomSeed) * 8.0; // 0-8 seconds random delay
            float randomSpeedMultiplier = 0.7 + random(randomSeed + 1000.0) * 0.6; // 0.7x to 1.3x speed variation
            
            // Apply random variations
            float baseStartTime = distanceBasedDelay + waveDelay + colMicroStagger;
            float droneStartTime = baseStartTime + randomDelay;
            
            // Modify movement speed with randomness
            float randomizedSpeed = CONSTANT_SPEED * randomSpeedMultiplier;
            
            // Traffic lane offset calculation (needed for multiple phases)
            float trafficLaneOffset = (row - 64.0) * 2.0; // Each row gets 2-unit Y separation
            
            // Calculate time needed for each axis based on randomized speed
            float yMoveDuration = yDistance / randomizedSpeed;
            float xMoveDuration = xDistance / randomizedSpeed;
            float zMoveDuration = zDistance / randomizedSpeed;
            
            // GENIUS COLUMN-LAYERED MOVEMENT SYSTEM
            
            // Calculate column-based Y offset for collision-free X movement
            float columnYOffset = col * 5.0; // Each column 5 units lower (col0=0, col1=5, col15=75)
            
            // PHASE 1: Y-AXIS MOVEMENT to column-specific height
            float yPhaseStart = droneStartTime;
            float yPhaseEnd = yPhaseStart + yMoveDuration;
            float yTimeElapsed = timeInTest - yPhaseStart;
            float yProgress = clamp(yTimeElapsed / yMoveDuration, 0.0, 1.0);
            
            // PHASE 2: X-AXIS MOVEMENT (Horizontal positioning at column height)
            float xPhaseStart = yPhaseEnd + axisPauseDuration;
            float xPhaseEnd = xPhaseStart + xMoveDuration;
            float xTimeElapsed = timeInTest - xPhaseStart;
            float xProgress = clamp(xTimeElapsed / xMoveDuration, 0.0, 1.0);
            
            // PHASE 3: Z-AXIS MOVEMENT (Depth positioning)
            float zPhaseStart = xPhaseEnd + axisPauseDuration;
            float zPhaseEnd = zPhaseStart + zMoveDuration;
            float zTimeElapsed = timeInTest - zPhaseStart;
            float zProgress = clamp(zTimeElapsed / zMoveDuration, 0.0, 1.0);
            
            // CALCULATE POSITIONS WITH CONSTANT SPEED AND WAITING
            
            // Y-axis movement: Move DIRECTLY to final Y position (no column layering)
            vec3 yTargetPos = vec3(startPos.x, endPos.y, startPos.z);
            vec3 afterYMove;
            if (timeInTest < yPhaseStart) {
                // Not started Y movement yet
                afterYMove = startPos;
            } else if (timeInTest < yPhaseEnd) {
                // Y movement in progress - directly to final Y
                afterYMove = vec3(startPos.x, mix(startPos.y, endPos.y, smoothstep(0.0, 1.0, yProgress)), startPos.z);
            } else {
                // Y movement complete - at final Y position
                afterYMove = yTargetPos;
            }
            
            // X-axis movement: Horizontal movement at final Y height
            vec3 xTargetPos = vec3(endPos.x, endPos.y, startPos.z);
            vec3 afterXMove;
            if (timeInTest < xPhaseStart) {
                // X phase not started yet
                afterXMove = afterYMove;
            } else if (timeInTest < xPhaseEnd) {
                // X movement in progress - at final Y height
                float currentX = mix(yTargetPos.x, endPos.x, smoothstep(0.0, 1.0, xProgress));
                afterXMove = vec3(currentX, endPos.y, startPos.z);
                
            } else {
                // X movement complete - at final position
                afterXMove = xTargetPos;
            }
            
            // Z-axis movement: Y and X are final, Z changes
            vec3 finalPos;
            if (timeInTest < zPhaseStart) {
                // Z phase not started yet
                finalPos = afterXMove;
            } else if (timeInTest < zPhaseEnd) {
                // Z movement in progress - constant speed
                finalPos = vec3(endPos.x, endPos.y, mix(startPos.z, endPos.z, smoothstep(0.0, 1.0, zProgress)));
            } else {
                // All movement complete
                finalPos = endPos;
            }
            
            return finalPos;
            
            // Sequential axis movement system handles all positioning above
            // No additional interpolation needed
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
        
        // Split formation (state 3+) - SHORTER DURATION
        vec3 splitPos = groundPos;
        if (state >= 3) {
            // Split transition - REDUCED DURATION
            float splitStartTime = 42.0;
            float splitDuration = 10.0; // 10 seconds total
            
            bool isLeftGroup = col < 16.0;
            float separationDistance = 300.0;
            
            vec3 targetSplitPos;
            
            if (isLeftGroup) {
                float leftCenterX = -separationDistance;
                // CENTERED: Left group spans -345 to -255 (center at -300)
                float newX = leftCenterX - 45.0 + col * 6.0; // Centered: -345 to -255
                targetSplitPos = vec3(newX, finalHeight + sin(row / GRID_ROWS * 3.14159) * 30.0 + 200.0, groundPos.z - 600.0);
            } else {
                float rightCenterX = separationDistance;
                // CENTERED: Right group spans +255 to +345 (center at +300)  
                float newX = rightCenterX - 45.0 + (col - 16.0) * 6.0; // Centered: +255 to +345
                targetSplitPos = vec3(newX, finalHeight + sin(row / GRID_ROWS * 3.14159) * 30.0 + 200.0, groundPos.z - 600.0);
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
