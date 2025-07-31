// CHECKPOINT: Original 4-quadrant system before 8-plane fix
// Saved on: Current date
// This version implements 4 quadrants with converging waves

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
        
        // EXPERIMENT V2: EINSTEIN GPU COLLISION AVOIDANCE ALGORITHM
        if (formationState == 4) {
            float testStartTime = 52.0;
            float timeInTest = time - testStartTime;
            
            if (timeInTest < 0.0) return splitPos; // Not started yet
            
            // SMOOTHER FORMATION: LEFT/RIGHT HALF-RECTANGLES THEN MERGE
            float spacing = 6.0;
            
            // QUADRANT SYSTEM VARIABLES (128×32 rectangle)
            bool isTopHalf = row >= 64.0;        // Row 127-64 → Top half, Row 63-0 → Bottom half
            bool isLeftGroup = col < 16.0;       // Col 0-15 → Left, Col 16-31 → Right
            
            // Rectangle is 128 wide × 32 tall
            float rectWidth = 128.0;
            float rectHeight = 32.0;
            
            // PHASE 1: Form half-rectangles at split positions
            vec3 halfRectTarget;
            // Half-rectangle targets: REPOSITIONED for better audience view
            float halfRectCenterY = 150.0; // Lowered further to match final position
            
            // Y: Same as final Y positions (lowered)
            float halfColWithinQuadrant = isLeftGroup ? col : (col - 16.0);
            float halfQuadrantYOffset = isTopHalf ? 8.0 : -8.0;
            float halfFinalY = halfRectCenterY + halfQuadrantYOffset * spacing + halfColWithinQuadrant * spacing;
            
            // X: At split positions with row-based columns (wider separation)
            float halfColumnIndex = isTopHalf ? (127.0 - row) : (63.0 - row);
            float halfFinalX = (isLeftGroup ? -400.0 : +400.0) + halfColumnIndex * spacing; // Wider: ±400 instead of ±300
            
            halfRectTarget = vec3(
                halfFinalX,   // X: At wider split positions (-400 or +400)
                halfFinalY,   // Y: Lowered positioning
                50.0          // Z: Even further back (50 instead of 100)
            );
            
            // QUADRANT SYSTEM: PERFECTLY CENTERED (change to -170.0 for left bias)
            float rectCenterX = 0.0; // Perfectly centered at origin
            float rectCenterY = 150.0;  // Lowered further from 200 to 150
            
            // Determine quadrant
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
            
            // SIMULTANEOUS 4-QUADRANT ACTIVATION: All quadrants move together
            float quadrantActivationDelay;
            
            if (row >= 96.0) {
                // Top-Top quadrant: Row 127-96 (32 rows)
                quadrantActivationDelay = (127.0 - row) * 0.5; // 0-15.5s
            } else if (row >= 64.0) {
                // Top-Bottom quadrant: Row 95-64 (32 rows)
                quadrantActivationDelay = (95.0 - row) * 0.5; // 0-15.5s
            } else if (row >= 32.0) {
                // Bottom-Top quadrant: Row 63-32 (32 rows) - REVERSED: row 32 starts first
                quadrantActivationDelay = (row - 32.0) * 0.5; // 0-15.5s
            } else {
                // Bottom-Bottom quadrant: Row 31-0 (32 rows) - REVERSED: row 0 starts first
                quadrantActivationDelay = row * 0.5; // 0-15.5s
            }
            
            float colMicroStagger = col * 0.05; // 0.05s stagger per column within row
            float droneStartTime = quadrantActivationDelay + colMicroStagger;
            
            // CONSTANT SPEED MOVEMENT SYSTEM (NORMAL SPEED)
            float CONSTANT_SPEED = 60.0; // Units per second - normal speed for production
            float axisPauseDuration = 2.0; // 2 second pause between axes
            
            // Calculate distances for each axis
            vec3 startPos = splitPos;
            vec3 endPos = finalTarget;
            
            float yDistance = abs(endPos.y - startPos.y);
            float xDistance = abs(endPos.x - startPos.x);
            float zDistance = abs(endPos.z - startPos.z);
            
            // Traffic lane offset calculation (needed for multiple phases)
            float trafficLaneOffset = (row - 64.0) * 2.0; // Each row gets 2-unit Y separation
            
            // Calculate time needed for each axis based on constant speed
            float yMoveDuration = yDistance / CONSTANT_SPEED;
            float xMoveDuration = xDistance / CONSTANT_SPEED;
            float zMoveDuration = zDistance / CONSTANT_SPEED;
            
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
