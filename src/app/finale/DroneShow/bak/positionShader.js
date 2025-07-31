// Simplified drone position shader

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
    
    // HELPER FUNCTIONS FOR CLEAN CODE ORGANIZATION
    
    float calculateDroneRevealFactor(float uTime, float row, float col) {
        if (uTime < 5.0) {
            return 0.0; // Hidden phase
        } else if (uTime < 12.0) {
            // Column reveal phase - FASTER
            float distanceFromCenter = abs(col - 15.5);
            float normalizedDistance = distanceFromCenter / 15.5;
            float revealDelay = (1.0 - normalizedDistance);
            revealDelay = revealDelay * revealDelay;
            float columnRevealTime = 5.0 + revealDelay * 6.0; // Reduced from 9.0 to 6.0
            float columnRevealDuration = 0.8; // Reduced from 1.2 to 0.8
            
            if (uTime >= columnRevealTime) {
                float revealProgress = min(1.0, (uTime - columnRevealTime) / columnRevealDuration);
                return smoothstep(0.0, 1.0, revealProgress);
            } else {
                return 0.0;
            }
        } else {
            return 1.0; // Fully revealed after 12 seconds - all drones should be bright
        }
    }
    
    vec3 calculateFlightPosition(float uTime, float row, float col, float a_id, vec3 groundPos) {
        float random1 = random(a_id * 0.001);
        float random2 = random(a_id * 0.001 + 1000.0);
        float finalHeight = 200.0 + random2 * 100.0;
        
        float rowDelay = 0.1;
        float stage1StartTime = 12.0 + row * rowDelay; // Updated to match faster reveal
        float stage1Duration = 6.0;
        float stage1EndTime = stage1StartTime + stage1Duration;
        float stage2Duration = 8.0;
        float stage2EndTime = stage1EndTime + stage2Duration;
        
        if (uTime <= stage1StartTime) {
            return vec3(groundPos.x, 0.0, groundPos.z);
        } else if (uTime <= stage1EndTime) {
            float stage1Progress = (uTime - stage1StartTime) / stage1Duration;
            float intermediateHeight = 30.0 + random1 * 70.0;
            return vec3(groundPos.x, stage1Progress * intermediateHeight, groundPos.z);
        } else if (uTime <= stage2EndTime) {
            float stage2Progress = (uTime - stage1EndTime) / stage2Duration;
            float intermediateHeight = 30.0 + random1 * 70.0;
            float currentHeight = intermediateHeight + stage2Progress * (finalHeight - intermediateHeight);
            return vec3(groundPos.x, currentHeight, groundPos.z);
        } else {
            return vec3(groundPos.x, finalHeight, groundPos.z);
        }
    }
    
    vec3 calculateSplitPosition(float uTime, vec3 currentPos, float row, float col, float finalHeight, vec3 groundPos) {
        float splitStartTime = 42.0;
        float splitDuration = 18.0;
        
        if (uTime <= splitStartTime) {
            return currentPos;
        }
        
        float splitProgress = min(1.0, (uTime - splitStartTime) / splitDuration);
        bool isLeftGroup = col < 16.0;
        float separationDistance = 300.0;
        
        if (isLeftGroup) {
            float leftCenterX = -separationDistance;
            float newX = leftCenterX + (col - 7.5) * 6.0;
            float newZ = groundPos.z;
            float newY = finalHeight + sin(row / GRID_ROWS * 3.14159) * 30.0;
            vec3 targetLeftPos = vec3(newX, newY, newZ);
            return mix(currentPos, targetLeftPos, smoothstep(0.0, 1.0, splitProgress));
        } else {
            float rightCenterX = separationDistance;
            float newX = rightCenterX + (col - 23.5) * 6.0;
            float newZ = groundPos.z;
            float newY = finalHeight + sin(row / GRID_ROWS * 3.14159) * 30.0;
            vec3 targetRightPos = vec3(newX, newY, newZ);
            return mix(currentPos, targetRightPos, smoothstep(0.0, 1.0, splitProgress));
        }
    }
    
    vec3 calculateFinalSplitPosition(float uTime, vec3 currentPos, float row, float col, float finalHeight) {
        float finalSplitStartTime = 60.0;
        float finalSplitDuration = 15.0;
        
        if (uTime <= finalSplitStartTime) {
            return currentPos;
        }
        
        float finalProgress = min(1.0, (uTime - finalSplitStartTime) / finalSplitDuration);
        bool isLeftGroup = col < 16.0;
        float finalSeparation = 300.0;
        
        if (isLeftGroup) {
            float leftCenterX = -finalSeparation;
            float newX = leftCenterX + (col - 7.5) * 6.0;
            float newZ = (row - 63.5) * 4.0;
            float newY = finalHeight + sin(row / GRID_ROWS * 3.14159) * 30.0;
            vec3 targetLeftPos = vec3(newX, newY, newZ);
            return mix(currentPos, targetLeftPos, smoothstep(0.0, 1.0, finalProgress));
        } else {
            float rightCenterX = finalSeparation;
            float newX = rightCenterX + (col - 23.5) * 6.0;
            float newZ = (row - 63.5) * 4.0;
            float newY = finalHeight + sin(row / GRID_ROWS * 3.14159) * 30.0;
            vec3 targetRightPos = vec3(newX, newY, newZ);
            return mix(currentPos, targetRightPos, smoothstep(0.0, 1.0, finalProgress));
        }
    }
    
    vec3 calculateLayeredFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        // LAYERED FORMATION SYSTEM - "Printer" approach for collision-free formation
        
        if (uTime < 75.0) {
            return currentPos; // Stay in split formation
        }
        
        // Single formation example: Heart Shape with layered construction
        float formationStartTime = 75.0;
        float formationDuration = 30.0; // Longer duration for layered construction
        
        if (uTime < formationStartTime + formationDuration) {
            // REENGINEERED CIRCLE FORMATION: 64 drones total (32 left + 32 right)
            
            // Determine which subgroup this drone belongs to
            bool isLeftGroup = col < 16.0;
            
            vec3 formationCenter = vec3(0.0, 350.0, 0.0);
            
            // Form a simple circle (75s onwards)
            float circlePhaseStart = 75.0;
            
            // FIXED: Proper drone selection and angle assignment
            float droneAngle;
            bool participates = false;
            
            if (isLeftGroup) {
                // Left group: Select first 32 drones from left columns (col 0-15)
                // Only first 2 rows of left columns participate (2 rows × 16 cols = 32 drones)
                if (row < 2.0) {
                    participates = true;
                    float leftDroneIndex = row * 16.0 + col; // 0 to 31
                    droneAngle = 1.5708 + (leftDroneIndex / 32.0) * 3.14159; // π/2 to 3π/2 (left semicircle)
                }
            } else {
                // Right group: Select first 32 drones from right columns (col 16-31)
                // Only first 2 rows of right columns participate (2 rows × 16 cols = 32 drones)
                if (row < 2.0) {
                    participates = true;
                    float rightDroneIndex = row * 16.0 + (col - 16.0); // 0 to 31
                    droneAngle = -1.5708 + (rightDroneIndex / 32.0) * 3.14159; // -π/2 to π/2 (right semicircle)
                }
            }
            
            if (!participates) return currentPos; // Non-participating drones stay put
            
            float circleRadius = 100.0; // Larger radius for more impressive circle
            
            // Perfect circle position with proper left/right assignment
            vec3 circlePos = formationCenter + vec3(
                circleRadius * cos(droneAngle),
                circleRadius * sin(droneAngle), // Perfect circle (no flattening)
                0.0 // Same Z-depth for all drones - perfectly flat circle
            );
            
            // Move to circle formation
            if (uTime >= circlePhaseStart) {
                // Enhanced wave-based movement to circle
                float distanceToCircle = length(circlePos - currentPos);
                float waveFactor = clamp((distanceToCircle - 100.0) / 500.0, 0.0, 1.0);
                
                // Smoother wave timing with side-based delays
                float baseDelay = (1.0 - waveFactor) * 10.0; // 10 second max delay
                float sideDelay = isLeftGroup ? 0.0 : 2.0; // Right side starts 2s after left
                float waveDelay = baseDelay + sideDelay;
                
                float droneStartTime = circlePhaseStart + waveDelay;
                float droneMoveDuration = 6.0; // Smoother, faster movement
                
                if (uTime >= droneStartTime) {
                    float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
                    return mix(currentPos, circlePos, smoothstep(0.0, 1.0, progress));
                } else {
                    return currentPos;
                }
            }
            
            // Default: still moving to formation
            else {
                return currentPos;
            }
        }
        
        // After formation, maintain circle position (64 drones)
        bool isLeftGroup = col < 16.0;
        vec3 formationCenter = vec3(0.0, 350.0, 0.0);
        
        float droneAngle;
        bool participates = false;
        
        if (isLeftGroup) {
            if (row < 2.0) {
                participates = true;
                float leftDroneIndex = row * 16.0 + col;
                droneAngle = 1.5708 + (leftDroneIndex / 32.0) * 3.14159;
            }
        } else {
            if (row < 2.0) {
                participates = true;
                float rightDroneIndex = row * 16.0 + (col - 16.0);
                droneAngle = -1.5708 + (rightDroneIndex / 32.0) * 3.14159;
            }
        }
        
        if (participates) {
            float circleRadius = 100.0; // Match the formation radius
            
            return formationCenter + vec3(
                circleRadius * cos(droneAngle),
                circleRadius * sin(droneAngle), // Perfect static circle
                0.0 // Same Z-depth for all drones - perfectly flat circle
            );
        }
        
        return currentPos; // Non-participating drones stay in split formation
    }
    
    vec3 calculateRainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float rainbowStartTime = 105.0;
        
        if (uTime < rainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // Rainbow parameters
        vec3 rainbowCenter = vec3(0.0, 450.0, 0.0); // Higher than circle
        float rainbowRadius = 200.0; // Arc radius
        
        // Select specific drones for rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInRainbow = false;
        float rainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        
        // Use rows 2-3 for rainbow (since 0-1 are in circle)
        // Select 16 drones from each side = 32 total drones for rainbow
        if (row >= 2.0 && row < 4.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 2-3 (16 drones)
                if (row == 2.0) { // Only use row 2 for simplicity
                    participatesInRainbow = true;
                    rainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                }
            } else {
                // Right side: columns 16-31, rows 2-3 (16 drones) 
                if (row == 2.0) { // Only use row 2 for simplicity
                    participatesInRainbow = true;
                    rainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                }
            }
        }
        
        if (!participatesInRainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate rainbow arc position (single line, no depth)
        float totalDrones = 32.0; // 16 from each side
        float normalizedPosition = (rainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        vec3 rainbowPos = vec3(
            rainbowRadius * sin(arcAngle), // X position along arc
            rainbowCenter.y + rainbowRadius * cos(arcAngle), // Y position (arc height)
            rainbowCenter.z // Same Z depth for all (single line)
        );
        
        // Sequential timing: one drone at a time, starting from center
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = rainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Much longer movement duration for realistic speed
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, rainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    
    vec3 calculateInvertedRainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float invertedRainbowStartTime = 110.0; // Start 5 seconds after top rainbow
        
        if (uTime < invertedRainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // Inverted rainbow parameters (mirror of top rainbow)
        vec3 invertedRainbowCenter = vec3(0.0, 250.0, 0.0); // Lower than top rainbow (450 -> 250)
        float invertedRainbowRadius = 200.0; // Same arc radius as top
        
        // Select specific drones for inverted rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInInvertedRainbow = false;
        float invertedRainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        
        // Use rows 4-5 for inverted rainbow (since 0-1 circle, 2-3 top rainbow)
        // Select 16 drones from each side = 32 total drones for inverted rainbow
        if (row >= 4.0 && row < 6.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 4-5 (16 drones)
                if (row == 4.0) { // Only use row 4 for simplicity
                    participatesInInvertedRainbow = true;
                    invertedRainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                }
            } else {
                // Right side: columns 16-31, rows 4-5 (16 drones) 
                if (row == 4.0) { // Only use row 4 for simplicity
                    participatesInInvertedRainbow = true;
                    invertedRainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                }
            }
        }
        
        if (!participatesInInvertedRainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate inverted rainbow arc position (single line, no depth)
        float totalDrones = 32.0; // 16 from each side
        float normalizedPosition = (invertedRainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        // INVERTED: Flip the Y calculation to create downward arc
        vec3 invertedRainbowPos = vec3(
            invertedRainbowRadius * sin(arcAngle), // X position along arc (same as top)
            invertedRainbowCenter.y - invertedRainbowRadius * cos(arcAngle), // Y position (INVERTED arc)
            invertedRainbowCenter.z // Same Z depth for all (single line)
        );
        
        // Sequential timing: one drone at a time, starting from center (same as top rainbow)
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = invertedRainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Same duration as top rainbow
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, invertedRainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    
    vec3 calculateBiggerInvertedRainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float biggerInvertedRainbowStartTime = 115.0; // Start 5 seconds after second rainbow
        
        if (uTime < biggerInvertedRainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // Bigger inverted rainbow parameters
        vec3 biggerInvertedRainbowCenter = vec3(0.0, 150.0, 0.0); // Even lower (250 -> 150)
        float biggerInvertedRainbowRadius = 300.0; // Much bigger radius (200 -> 300)
        
        // Select specific drones for bigger inverted rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInBiggerInvertedRainbow = false;
        float biggerInvertedRainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        
        // Use rows 6-7 for bigger inverted rainbow (since 0-1 circle, 2-3 top, 4-5 inverted)
        // Select 16 drones from each side = 32 total drones for bigger inverted rainbow
        if (row >= 6.0 && row < 8.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 6-7 (16 drones)
                if (row == 6.0) { // Only use row 6 for simplicity
                    participatesInBiggerInvertedRainbow = true;
                    biggerInvertedRainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                }
            } else {
                // Right side: columns 16-31, rows 6-7 (16 drones) 
                if (row == 6.0) { // Only use row 6 for simplicity
                    participatesInBiggerInvertedRainbow = true;
                    biggerInvertedRainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                }
            }
        }
        
        if (!participatesInBiggerInvertedRainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate bigger inverted rainbow arc position (single line, no depth)
        float totalDrones = 32.0; // 16 from each side
        float normalizedPosition = (biggerInvertedRainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        // BIGGER INVERTED: Flip the Y calculation to create bigger downward arc
        vec3 biggerInvertedRainbowPos = vec3(
            biggerInvertedRainbowRadius * sin(arcAngle), // X position along bigger arc
            biggerInvertedRainbowCenter.y - biggerInvertedRainbowRadius * cos(arcAngle), // Y position (BIGGER INVERTED arc)
            biggerInvertedRainbowCenter.z // Same Z depth for all (single line)
        );
        
        // Sequential timing: one drone at a time, starting from center
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = biggerInvertedRainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Same duration as other rainbows
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, biggerInvertedRainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    
    vec3 calculateBiggerUpperRainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float biggerUpperRainbowStartTime = 120.0; // Start 5 seconds after bigger inverted rainbow
        
        if (uTime < biggerUpperRainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // BIGGER upper rainbow parameters (above the original top rainbow)
        vec3 biggerUpperRainbowCenter = vec3(0.0, 600.0, 0.0); // Much higher than original top rainbow (450 -> 600)
        float biggerUpperRainbowRadius = 350.0; // MUCH BIGGER radius (200 -> 350)
        
        // Select specific drones for bigger upper rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInBiggerUpperRainbow = false;
        float biggerUpperRainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        
        // Use rows 8-9 for bigger upper rainbow (since 0-1 circle, 2-3 top, 4-5 inverted, 6-7 bigger inverted)
        // Select 16 drones from each side = 32 total drones for bigger upper rainbow
        if (row >= 8.0 && row < 10.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 8-9 (16 drones)
                if (row == 8.0) { // Only use row 8 for simplicity
                    participatesInBiggerUpperRainbow = true;
                    biggerUpperRainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                }
            } else {
                // Right side: columns 16-31, rows 8-9 (16 drones) 
                if (row == 8.0) { // Only use row 8 for simplicity
                    participatesInBiggerUpperRainbow = true;
                    biggerUpperRainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                }
            }
        }
        
        if (!participatesInBiggerUpperRainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate BIGGER upper rainbow arc position (single line, no depth)
        float totalDrones = 32.0; // 16 from each side
        float normalizedPosition = (biggerUpperRainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        // BIGGER UPPER: Much larger upward arc than original top rainbow
        vec3 biggerUpperRainbowPos = vec3(
            biggerUpperRainbowRadius * sin(arcAngle), // X position along BIGGER arc
            biggerUpperRainbowCenter.y + biggerUpperRainbowRadius * cos(arcAngle), // Y position (BIGGER UPWARD arc)
            biggerUpperRainbowCenter.z // Same Z depth for all (single line)
        );
        
        // Sequential timing: one drone at a time, starting from center
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = biggerUpperRainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Same duration as other rainbows
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, biggerUpperRainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    
    vec3 calculateFrontBackRainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float frontBackRainbowStartTime = 125.0; // Start 5 seconds after bigger upper rainbow
        
        if (uTime < frontBackRainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // Front/Back rainbow parameters (using Z-axis for depth)
        vec3 frontBackRainbowCenter = vec3(0.0, 350.0, 0.0); // Same height as circle formation
        float frontBackRainbowRadius = 250.0; // Medium radius for front/back arcs
        
        // Select specific drones for front/back rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInFrontBackRainbow = false;
        float frontBackRainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        bool isFrontArc = false; // Determines if this drone goes to front or back arc
        
        // Use rows 10-11 for front/back rainbow (since 0-1 circle, 2-3 top, 4-5 inverted, 6-7 bigger inverted, 8-9 bigger upper)
        // Select 32 drones from each side = 64 total drones (32 front + 32 back)
        if (row >= 10.0 && row < 12.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 10-11 (32 drones)
                participatesInFrontBackRainbow = true;
                frontBackRainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                isFrontArc = (row == 10.0); // Row 10 = front arc, Row 11 = back arc
            } else {
                // Right side: columns 16-31, rows 10-11 (32 drones) 
                participatesInFrontBackRainbow = true;
                frontBackRainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                isFrontArc = (row == 10.0); // Row 10 = front arc, Row 11 = back arc
            }
        }
        
        if (!participatesInFrontBackRainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate front/back rainbow arc position (using Z-axis for depth)
        float totalDrones = 32.0; // 16 from each side per arc
        float normalizedPosition = (frontBackRainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        // FRONT/BACK: Use Z-axis for depth arcs instead of Y-axis
        vec3 frontBackRainbowPos;
        if (isFrontArc) {
            // FRONT ARC: Arc curves toward viewer (positive Z)
            frontBackRainbowPos = vec3(
                frontBackRainbowRadius * sin(arcAngle), // X position along arc
                frontBackRainbowCenter.y, // Same Y height as circle
                frontBackRainbowCenter.z + frontBackRainbowRadius * cos(arcAngle) // Z position (FRONT arc)
            );
        } else {
            // BACK ARC: Arc curves away from viewer (negative Z)
            frontBackRainbowPos = vec3(
                frontBackRainbowRadius * sin(arcAngle), // X position along arc
                frontBackRainbowCenter.y, // Same Y height as circle
                frontBackRainbowCenter.z - frontBackRainbowRadius * cos(arcAngle) // Z position (BACK arc)
            );
        }
        
        // Sequential timing: one drone at a time, starting from center
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = frontBackRainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Same duration as other rainbows
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, frontBackRainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    
    vec3 calculateBiggerFrontBackRainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float biggerFrontBackRainbowStartTime = 130.0; // Start 5 seconds after front/back rainbow
        
        if (uTime < biggerFrontBackRainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // BIGGER Front/Back rainbow parameters (using Z-axis for depth)
        vec3 biggerFrontBackRainbowCenter = vec3(0.0, 350.0, 0.0); // Same height as circle formation
        float biggerFrontBackRainbowRadius = 400.0; // MUCH BIGGER radius for dramatic depth (250 -> 400)
        
        // Select specific drones for BIGGER front/back rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInBiggerFrontBackRainbow = false;
        float biggerFrontBackRainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        bool isFrontArc = false; // Determines if this drone goes to front or back arc
        
        // Use rows 12-13 for BIGGER front/back rainbow (since 0-1 circle, 2-3 top, 4-5 inverted, 6-7 bigger inverted, 8-9 bigger upper, 10-11 front/back)
        // Select 32 drones from each side = 64 total drones (32 bigger front + 32 bigger back)
        if (row >= 12.0 && row < 14.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 12-13 (32 drones)
                participatesInBiggerFrontBackRainbow = true;
                biggerFrontBackRainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                isFrontArc = (row == 12.0); // Row 12 = bigger front arc, Row 13 = bigger back arc
            } else {
                // Right side: columns 16-31, rows 12-13 (32 drones) 
                participatesInBiggerFrontBackRainbow = true;
                biggerFrontBackRainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                isFrontArc = (row == 12.0); // Row 12 = bigger front arc, Row 13 = bigger back arc
            }
        }
        
        if (!participatesInBiggerFrontBackRainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate BIGGER front/back rainbow arc position (using Z-axis for depth)
        float totalDrones = 32.0; // 16 from each side per arc
        float normalizedPosition = (biggerFrontBackRainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        // BIGGER FRONT/BACK: Use Z-axis for MUCH DEEPER arcs
        vec3 biggerFrontBackRainbowPos;
        if (isFrontArc) {
            // BIGGER FRONT ARC: Arc curves much further toward viewer (positive Z)
            biggerFrontBackRainbowPos = vec3(
                biggerFrontBackRainbowRadius * sin(arcAngle), // X position along BIGGER arc
                biggerFrontBackRainbowCenter.y, // Same Y height as circle
                biggerFrontBackRainbowCenter.z + biggerFrontBackRainbowRadius * cos(arcAngle) // Z position (BIGGER FRONT arc)
            );
        } else {
            // BIGGER BACK ARC: Arc curves much further away from viewer (negative Z)
            biggerFrontBackRainbowPos = vec3(
                biggerFrontBackRainbowRadius * sin(arcAngle), // X position along BIGGER arc
                biggerFrontBackRainbowCenter.y, // Same Y height as circle
                biggerFrontBackRainbowCenter.z - biggerFrontBackRainbowRadius * cos(arcAngle) // Z position (BIGGER BACK arc)
            );
        }
        
        // Sequential timing: one drone at a time, starting from center
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = biggerFrontBackRainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Same duration as other rainbows
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, biggerFrontBackRainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    
    vec3 calculateMassiveFrontBackRainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float massiveFrontBackRainbowStartTime = 135.0; // Start 5 seconds after bigger front/back rainbow
        
        if (uTime < massiveFrontBackRainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // MASSIVE Front/Back rainbow parameters (using Z-axis for depth)
        vec3 massiveFrontBackRainbowCenter = vec3(0.0, 350.0, 0.0); // Same height as circle formation
        float massiveFrontBackRainbowRadius = 600.0; // MASSIVE radius for ultimate depth effect (400 -> 600)
        
        // Select specific drones for MASSIVE front/back rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInMassiveFrontBackRainbow = false;
        float massiveFrontBackRainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        bool isFrontArc = false; // Determines if this drone goes to front or back arc
        
        // Use rows 14-15 for MASSIVE front/back rainbow (since 0-1 circle, 2-3 top, 4-5 inverted, 6-7 bigger inverted, 8-9 bigger upper, 10-11 front/back, 12-13 bigger front/back)
        // Select 32 drones from each side = 64 total drones (32 massive front + 32 massive back)
        if (row >= 14.0 && row < 16.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 14-15 (32 drones)
                participatesInMassiveFrontBackRainbow = true;
                massiveFrontBackRainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                isFrontArc = (row == 14.0); // Row 14 = massive front arc, Row 15 = massive back arc
            } else {
                // Right side: columns 16-31, rows 14-15 (32 drones) 
                participatesInMassiveFrontBackRainbow = true;
                massiveFrontBackRainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                isFrontArc = (row == 14.0); // Row 14 = massive front arc, Row 15 = massive back arc
            }
        }
        
        if (!participatesInMassiveFrontBackRainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate MASSIVE front/back rainbow arc position (using Z-axis for depth)
        float totalDrones = 32.0; // 16 from each side per arc
        float normalizedPosition = (massiveFrontBackRainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        // MASSIVE FRONT/BACK: Use Z-axis for ULTIMATE DEPTH arcs
        vec3 massiveFrontBackRainbowPos;
        if (isFrontArc) {
            // MASSIVE FRONT ARC: Arc curves EXTREMELY far toward viewer (positive Z)
            massiveFrontBackRainbowPos = vec3(
                massiveFrontBackRainbowRadius * sin(arcAngle), // X position along MASSIVE arc
                massiveFrontBackRainbowCenter.y, // Same Y height as circle
                massiveFrontBackRainbowCenter.z + massiveFrontBackRainbowRadius * cos(arcAngle) // Z position (MASSIVE FRONT arc)
            );
        } else {
            // MASSIVE BACK ARC: Arc curves EXTREMELY far away from viewer (negative Z)
            massiveFrontBackRainbowPos = vec3(
                massiveFrontBackRainbowRadius * sin(arcAngle), // X position along MASSIVE arc
                massiveFrontBackRainbowCenter.y, // Same Y height as circle
                massiveFrontBackRainbowCenter.z - massiveFrontBackRainbowRadius * cos(arcAngle) // Z position (MASSIVE BACK arc)
            );
        }
        
        // Sequential timing: one drone at a time, starting from center
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = massiveFrontBackRainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Same duration as other rainbows
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, massiveFrontBackRainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    
    vec3 calculateDiagonal45RainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float diagonal45RainbowStartTime = 140.0; // Start 5 seconds after massive front/back rainbow
        
        if (uTime < diagonal45RainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // 45-degree diagonal rainbow parameters (using both Y and Z axes)
        vec3 diagonal45RainbowCenter = vec3(0.0, 350.0, 0.0); // Same height as circle formation
        float diagonal45RainbowRadius = 300.0; // Medium radius for diagonal arcs
        
        // Select specific drones for 45-degree diagonal rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInDiagonal45Rainbow = false;
        float diagonal45RainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        bool isUpwardDiagonal = false; // Determines if this drone goes to upward or downward diagonal
        
        // Use rows 16-17 for 45-degree diagonal rainbow (since 0-1 circle, 2-3 top, 4-5 inverted, 6-7 bigger inverted, 8-9 bigger upper, 10-11 front/back, 12-13 bigger front/back, 14-15 massive front/back)
        // Select 32 drones from each side = 64 total drones (32 upward diagonal + 32 downward diagonal)
        if (row >= 16.0 && row < 18.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 16-17 (32 drones)
                participatesInDiagonal45Rainbow = true;
                diagonal45RainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                isUpwardDiagonal = (row == 16.0); // Row 16 = upward diagonal, Row 17 = downward diagonal
            } else {
                // Right side: columns 16-31, rows 16-17 (32 drones) 
                participatesInDiagonal45Rainbow = true;
                diagonal45RainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                isUpwardDiagonal = (row == 16.0); // Row 16 = upward diagonal, Row 17 = downward diagonal
            }
        }
        
        if (!participatesInDiagonal45Rainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate 45-degree diagonal rainbow arc position (using both Y and Z axes)
        float totalDrones = 32.0; // 16 from each side per arc
        float normalizedPosition = (diagonal45RainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        // 45-DEGREE DIAGONAL: Use both Y and Z axes for diagonal arcs
        vec3 diagonal45RainbowPos;
        if (isUpwardDiagonal) {
            // UPWARD DIAGONAL ARC: Arc curves upward and forward (positive Y and Z)
            float yComponent = diagonal45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            float zComponent = diagonal45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            diagonal45RainbowPos = vec3(
                diagonal45RainbowRadius * sin(arcAngle), // X position along arc
                diagonal45RainbowCenter.y + yComponent, // Y position (UPWARD diagonal)
                diagonal45RainbowCenter.z + zComponent  // Z position (FORWARD diagonal)
            );
        } else {
            // DOWNWARD DIAGONAL ARC: Arc curves downward and backward (negative Y and Z)
            float yComponent = diagonal45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            float zComponent = diagonal45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            diagonal45RainbowPos = vec3(
                diagonal45RainbowRadius * sin(arcAngle), // X position along arc
                diagonal45RainbowCenter.y - yComponent, // Y position (DOWNWARD diagonal)
                diagonal45RainbowCenter.z - zComponent  // Z position (BACKWARD diagonal)
            );
        }
        
        // Sequential timing: one drone at a time, starting from center
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = diagonal45RainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Same duration as other rainbows
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, diagonal45RainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    
    vec3 calculateBiggerDiagonal45RainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float biggerDiagonal45RainbowStartTime = 145.0; // Start 5 seconds after diagonal 45 rainbow
        
        if (uTime < biggerDiagonal45RainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // BIGGER 45-degree diagonal rainbow parameters (using both Y and Z axes)
        vec3 biggerDiagonal45RainbowCenter = vec3(0.0, 350.0, 0.0); // Same height as circle formation
        float biggerDiagonal45RainbowRadius = 500.0; // BIGGER radius for dramatic diagonal arcs (300 -> 500)
        
        // Select specific drones for BIGGER 45-degree diagonal rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInBiggerDiagonal45Rainbow = false;
        float biggerDiagonal45RainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        bool isUpwardDiagonal = false; // Determines if this drone goes to upward or downward diagonal
        
        // Use rows 18-19 for BIGGER 45-degree diagonal rainbow (since 0-1 circle, 2-3 top, 4-5 inverted, 6-7 bigger inverted, 8-9 bigger upper, 10-11 front/back, 12-13 bigger front/back, 14-15 massive front/back, 16-17 diagonal 45)
        // Select 32 drones from each side = 64 total drones (32 bigger upward diagonal + 32 bigger downward diagonal)
        if (row >= 18.0 && row < 20.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 18-19 (32 drones)
                participatesInBiggerDiagonal45Rainbow = true;
                biggerDiagonal45RainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                isUpwardDiagonal = (row == 18.0); // Row 18 = bigger upward diagonal, Row 19 = bigger downward diagonal
            } else {
                // Right side: columns 16-31, rows 18-19 (32 drones) 
                participatesInBiggerDiagonal45Rainbow = true;
                biggerDiagonal45RainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                isUpwardDiagonal = (row == 18.0); // Row 18 = bigger upward diagonal, Row 19 = bigger downward diagonal
            }
        }
        
        if (!participatesInBiggerDiagonal45Rainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate BIGGER 45-degree diagonal rainbow arc position (using both Y and Z axes)
        float totalDrones = 32.0; // 16 from each side per arc
        float normalizedPosition = (biggerDiagonal45RainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        // BIGGER 45-DEGREE DIAGONAL: Use both Y and Z axes for BIGGER diagonal arcs
        vec3 biggerDiagonal45RainbowPos;
        if (isUpwardDiagonal) {
            // BIGGER UPWARD DIAGONAL ARC: Arc curves much further upward and forward (positive Y and Z)
            float yComponent = biggerDiagonal45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            float zComponent = biggerDiagonal45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            biggerDiagonal45RainbowPos = vec3(
                biggerDiagonal45RainbowRadius * sin(arcAngle), // X position along BIGGER arc
                biggerDiagonal45RainbowCenter.y + yComponent, // Y position (BIGGER UPWARD diagonal)
                biggerDiagonal45RainbowCenter.z + zComponent  // Z position (BIGGER FORWARD diagonal)
            );
        } else {
            // BIGGER DOWNWARD DIAGONAL ARC: Arc curves much further downward and backward (negative Y and Z)
            float yComponent = biggerDiagonal45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            float zComponent = biggerDiagonal45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            biggerDiagonal45RainbowPos = vec3(
                biggerDiagonal45RainbowRadius * sin(arcAngle), // X position along BIGGER arc
                biggerDiagonal45RainbowCenter.y - yComponent, // Y position (BIGGER DOWNWARD diagonal)
                biggerDiagonal45RainbowCenter.z - zComponent  // Z position (BIGGER BACKWARD diagonal)
            );
        }
        
        // Sequential timing: one drone at a time, starting from center
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = biggerDiagonal45RainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Same duration as other rainbows
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, biggerDiagonal45RainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    
    vec3 calculateDiagonalMinus45RainbowFormation(float uTime, vec3 currentPos, float a_id, float row, float col) {
        float diagonalMinus45RainbowStartTime = 150.0; // Start 5 seconds after bigger diagonal 45 rainbow
        
        if (uTime < diagonalMinus45RainbowStartTime) {
            return currentPos; // Stay in current formation
        }
        
        // -45-degree diagonal rainbow parameters (using both Y and Z axes in opposite direction)
        vec3 diagonalMinus45RainbowCenter = vec3(0.0, 350.0, 0.0); // Same height as circle formation
        float diagonalMinus45RainbowRadius = 400.0; // Medium-large radius for -45 degree arcs
        
        // Select specific drones for -45-degree diagonal rainbow - one from each side, sequential
        bool isLeftGroup = col < 16.0;
        bool participatesInDiagonalMinus45Rainbow = false;
        float diagonalMinus45RainbowIndex = -1.0; // Position in rainbow sequence (0 = center)
        bool isUpwardDiagonal = false; // Determines if this drone goes to upward or downward diagonal
        
        // Use rows 20-21 for -45-degree diagonal rainbow (since 0-1 circle, 2-3 top, 4-5 inverted, 6-7 bigger inverted, 8-9 bigger upper, 10-11 front/back, 12-13 bigger front/back, 14-15 massive front/back, 16-17 diagonal 45, 18-19 bigger diagonal 45)
        // Select 32 drones from each side = 64 total drones (32 upward -45 diagonal + 32 downward -45 diagonal)
        if (row >= 20.0 && row < 22.0) {
            if (isLeftGroup) {
                // Left side: columns 0-15, rows 20-21 (32 drones)
                participatesInDiagonalMinus45Rainbow = true;
                diagonalMinus45RainbowIndex = 15.0 - col; // 15, 14, 13... 0 (left to center)
                isUpwardDiagonal = (row == 20.0); // Row 20 = upward -45 diagonal, Row 21 = downward -45 diagonal
            } else {
                // Right side: columns 16-31, rows 20-21 (32 drones) 
                participatesInDiagonalMinus45Rainbow = true;
                diagonalMinus45RainbowIndex = 16.0 + (col - 16.0); // 16, 17, 18... 31 (center to right)
                isUpwardDiagonal = (row == 20.0); // Row 20 = upward -45 diagonal, Row 21 = downward -45 diagonal
            }
        }
        
        if (!participatesInDiagonalMinus45Rainbow) {
            return currentPos; // Non-participating drones stay put
        }
        
        // Calculate -45-degree diagonal rainbow arc position (using both Y and Z axes in OPPOSITE direction)
        float totalDrones = 32.0; // 16 from each side per arc
        float normalizedPosition = (diagonalMinus45RainbowIndex / (totalDrones - 1.0)) - 0.5; // -0.5 to +0.5
        float arcAngle = normalizedPosition * 3.14159; // -π/2 to +π/2 for semicircle
        
        // -45-DEGREE DIAGONAL: Use both Y and Z axes for OPPOSITE diagonal arcs
        vec3 diagonalMinus45RainbowPos;
        if (isUpwardDiagonal) {
            // UPWARD -45 DIAGONAL ARC: Arc curves upward and BACKWARD (positive Y, negative Z)
            float yComponent = diagonalMinus45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            float zComponent = diagonalMinus45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            diagonalMinus45RainbowPos = vec3(
                diagonalMinus45RainbowRadius * sin(arcAngle), // X position along arc
                diagonalMinus45RainbowCenter.y + yComponent, // Y position (UPWARD diagonal)
                diagonalMinus45RainbowCenter.z - zComponent  // Z position (BACKWARD diagonal) - OPPOSITE of +45
            );
        } else {
            // DOWNWARD -45 DIAGONAL ARC: Arc curves downward and FORWARD (negative Y, positive Z)
            float yComponent = diagonalMinus45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            float zComponent = diagonalMinus45RainbowRadius * cos(arcAngle) * 0.7071; // cos(45°) = 0.7071
            diagonalMinus45RainbowPos = vec3(
                diagonalMinus45RainbowRadius * sin(arcAngle), // X position along arc
                diagonalMinus45RainbowCenter.y - yComponent, // Y position (DOWNWARD diagonal)
                diagonalMinus45RainbowCenter.z + zComponent  // Z position (FORWARD diagonal) - OPPOSITE of +45
            );
        }
        
        // Sequential timing: one drone at a time, starting from center
        float distanceFromCenter = abs(normalizedPosition); // 0.0 at center, 0.5 at ends
        float moveDelay = distanceFromCenter * 30.0; // Up to 15 second delay for outer drones
        float droneStartTime = diagonalMinus45RainbowStartTime + moveDelay;
        float droneMoveDuration = 8.0; // Same duration as other rainbows
        
        if (uTime >= droneStartTime) {
            float progress = min(1.0, (uTime - droneStartTime) / droneMoveDuration);
            // Use smoothstep for acceleration/deceleration
            float smoothProgress = smoothstep(0.0, 1.0, progress);
            return mix(currentPos, diagonalMinus45RainbowPos, smoothProgress);
        } else {
            return currentPos; // Wait for turn
        }
    }
    



    void main() {
        float a_id = gl_FragCoord.x - 0.5 + (gl_FragCoord.y - 0.5) * uTextureSize;

        if (a_id >= DRONE_COUNT) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        
        // Calculate grid position
        float row = floor(a_id / GRID_COLS);
        float col = mod(a_id, GRID_COLS);
        
        // Ground positions
        float spacing = 8.0;
        vec3 groundPos = vec3(
            (col - GRID_COLS/2.0 + 0.5) * spacing,
            0.0,
            (row - GRID_ROWS/2.0 + 0.5) * spacing
        );
        
        // CLEAN MAIN FUNCTION - All complex logic moved to helper functions
        float droneRevealFactor = calculateDroneRevealFactor(uTime, row, col);
        vec3 currentPos = calculateFlightPosition(uTime, row, col, a_id, groundPos);
        currentPos = calculateSplitPosition(uTime, currentPos, row, col, 200.0 + random(a_id * 0.001 + 1000.0) * 100.0, groundPos);
        currentPos = calculateFinalSplitPosition(uTime, currentPos, row, col, 200.0 + random(a_id * 0.001 + 1000.0) * 100.0);
        currentPos = calculateLayeredFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateRainbowFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateInvertedRainbowFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateBiggerInvertedRainbowFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateBiggerUpperRainbowFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateFrontBackRainbowFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateBiggerFrontBackRainbowFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateMassiveFrontBackRainbowFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateDiagonal45RainbowFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateBiggerDiagonal45RainbowFormation(uTime, currentPos, a_id, row, col);
        currentPos = calculateDiagonalMinus45RainbowFormation(uTime, currentPos, a_id, row, col);


        
        gl_FragColor = vec4(currentPos * uScale, droneRevealFactor);
    }
`
