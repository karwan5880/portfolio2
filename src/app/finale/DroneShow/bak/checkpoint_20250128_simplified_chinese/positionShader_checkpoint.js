// Main drone position shader - controls all drone movements and formations

// Position shader configuration
const POSITION_CONFIG = {
  DRONE_COUNT: 4096,
  GRID_ROWS: 128,
  GRID_COLS: 32,

  // Formation timing
  HIDDEN_END: 5.0,
  REVEAL_END: 15.0,
  FLIGHT_END: 42.0,
  SPLIT_END: 52.0,

  // Movement parameters
  SPACING: 8.0,
  CONSTANT_SPEED: 200.0,

  // Split formation
  SPLIT_DURATION: 10.0,
  SEPARATION_DISTANCE: 300.0,
  LEFT_GROUP_X_RANGE: [-500.0, -100.0],
  RIGHT_GROUP_X_RANGE: [100.0, 500.0],
  SPLIT_Y_RANGE: [400.0, 700.0],
  SPLIT_Z_OFFSET: -600.0,

  // Rectangle formation
  RECT_CENTER_X: 0.0,
  RECT_CENTER_Y: 150.0,
  RECT_Z: 150.0,
  RECT_SPACING: 6.0,
}

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
        if (time < 52.0) return 3;  // Split
        return 4; // Rectangle formation
    }

    // Calculate reveal factor for column-based reveal animation
    float calculateRevealFactor(float time, float row, float col) {
        if (time < 5.0) return 0.0;
        if (time >= 15.0) return 1.0;
        
        // Center-out column reveal (columns 15-16 reveal first)
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

    // Calculate rectangle formation target position
    vec3 calculateRectangleTarget(float row, float col) {
        bool isTopQuadrant = row >= 64.0;
        bool isLeftQuadrant = col < 16.0;
        
        // X position: row-based column positioning
        float columnIndex = isTopQuadrant ? (127.0 - row) : (63.0 - row);
        float quadrantXOffset = isLeftQuadrant ? -384.0 : 0.0;
        float finalX = 0.0 + quadrantXOffset + columnIndex * 6.0;
        
        // Y position: column-based with quadrant offset
        float colWithinQuadrant = isLeftQuadrant ? col : (col - 16.0);
        float quadrantYOffset = isTopQuadrant ? 8.0 : -8.0;
        float finalY = 150.0 + quadrantYOffset * 6.0 + colWithinQuadrant * 6.0;
        
        return vec3(finalX, finalY, 150.0);
    }
    
    // Calculate movement timing for rectangle formation
    vec3 calculateMovementTiming(float droneId, vec3 startPos, vec3 endPos, float timeInTest) {
        float randomSeed = droneId * 0.001;
        
        // Calculate distances and timing
        float yDistance = abs(endPos.y - startPos.y);
        float xDistance = abs(endPos.x - startPos.x);
        float zDistance = abs(endPos.z - startPos.z);
        
        // Random variations
        float randomDelay = random(randomSeed) * 2.0;
        float randomSpeedMultiplier = 0.7 + random(randomSeed + 1000.0) * 0.6;
        float randomizedSpeed = 200.0 * randomSpeedMultiplier;
        
        // Variable speeds for each axis
        float ySpeed = randomizedSpeed * 0.5;
        float xSpeed = randomizedSpeed * 1.0;
        float zSpeed = randomizedSpeed * 2.0;
        
        // Movement durations
        float yMoveDuration = yDistance / ySpeed;
        float xMoveDuration = xDistance / xSpeed;
        float zMoveDuration = zDistance / zSpeed;
        
        float axisPause = 0.1 + random(randomSeed + 2000.0) * 0.1;
        
        // Phase timing
        float yPhaseStart = randomDelay;
        float yPhaseEnd = yPhaseStart + yMoveDuration;
        float xPhaseStart = yPhaseEnd + axisPause;
        float xPhaseEnd = xPhaseStart + xMoveDuration;
        float zPhaseStart = xPhaseEnd + axisPause;
        float zPhaseEnd = zPhaseStart + zMoveDuration;
        
        // Calculate current position based on phase
        if (timeInTest < yPhaseStart) {
            return startPos;
        } else if (timeInTest < yPhaseEnd) {
            float yProgress = clamp((timeInTest - yPhaseStart) / yMoveDuration, 0.0, 1.0);
            return vec3(startPos.x, mix(startPos.y, endPos.y, smoothstep(0.0, 1.0, yProgress)), startPos.z);
        } else if (timeInTest < xPhaseStart) {
            return vec3(startPos.x, endPos.y, startPos.z);
        } else if (timeInTest < xPhaseEnd) {
            float xProgress = clamp((timeInTest - xPhaseStart) / xMoveDuration, 0.0, 1.0);
            return vec3(mix(startPos.x, endPos.x, smoothstep(0.0, 1.0, xProgress)), endPos.y, startPos.z);
        } else if (timeInTest < zPhaseStart) {
            return vec3(endPos.x, endPos.y, startPos.z);
        } else if (timeInTest < zPhaseEnd) {
            float zProgress = clamp((timeInTest - zPhaseStart) / zMoveDuration, 0.0, 1.0);
            return vec3(endPos.x, endPos.y, mix(startPos.z, endPos.z, smoothstep(0.0, 1.0, zProgress)));
        } else {
            return endPos;
        }
    }
    
    // Rectangle formation calculation
    vec3 calculateFormationPosition(int formationState, float time, float row, float col, float droneId, vec3 splitPos) {
        if (formationState == 4) {
            float timeInTest = time - 52.0;
            if (timeInTest < 0.0) return splitPos;
            
            vec3 finalTarget = calculateRectangleTarget(row, col);
            return calculateMovementTiming(droneId, splitPos, finalTarget, timeInTest);
        }
        
        return splitPos;
    }

    // Calculate flight phase position
    vec3 calculateFlightPosition(float time, float row, float droneId, vec3 groundPos) {
        float random1 = random(droneId * 0.001);
        float random2 = random(droneId * 0.001 + 1000.0);
        float finalHeight = 200.0 + random2 * 100.0;
        
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
    
    // Calculate split formation position
    vec3 calculateSplitPosition(float time, float col, float droneId, vec3 groundPos) {
        float random2 = random(droneId * 0.001 + 1000.0);
        float finalHeight = 200.0 + random2 * 100.0;
        
        float splitStartTime = 42.0;
        float splitDuration = 10.0;
        bool isLeftGroup = col < 16.0;
        
        vec3 targetSplitPos;
        if (isLeftGroup) {
            float newX = -500.0 + col * (400.0 / 15.0);
            float randomY = 400.0 + random(droneId * 0.001 + 5000.0) * 300.0;
            targetSplitPos = vec3(newX, randomY, groundPos.z - 600.0);
        } else {
            float newX = 100.0 + (col - 16.0) * (400.0 / 15.0);
            float randomY = 400.0 + random(droneId * 0.001 + 5000.0) * 300.0;
            targetSplitPos = vec3(newX, randomY, groundPos.z - 600.0);
        }
        
        if (time <= splitStartTime) {
            return vec3(groundPos.x, finalHeight, groundPos.z);
        } else {
            float splitProgress = min(1.0, (time - splitStartTime) / splitDuration);
            vec3 currentPos = vec3(groundPos.x, finalHeight, groundPos.z);
            return mix(currentPos, targetSplitPos, smoothstep(0.0, 1.0, splitProgress));
        }
    }
    
    // Main position calculation
    vec3 calculatePosition(float time, float row, float col, float droneId, vec3 groundPos) {
        int state = getCurrentFormationState(time);
        
        if (state <= 1) {
            return vec3(groundPos.x, 0.0, groundPos.z);
        } else if (state == 2) {
            return calculateFlightPosition(time, row, droneId, groundPos);
        } else if (state >= 3) {
            vec3 splitPos = calculateSplitPosition(time, col, droneId, groundPos);
            return calculateFormationPosition(state, time, row, col, droneId, splitPos);
        }
        
        return groundPos;
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
