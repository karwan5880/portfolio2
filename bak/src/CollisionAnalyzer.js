// Collision Detection and Analysis System for Drone Formations

export class CollisionAnalyzer {
  constructor(droneCount = 1024, safetyRadius = 15.0) {
    this.droneCount = droneCount
    this.safetyRadius = safetyRadius
    this.gridSize = Math.sqrt(droneCount) // 32x32 for 1024 drones
  }

  // Get dome position (current formation in your main show)
  getDomePosition(droneId) {
    const row = Math.floor(droneId / this.gridSize)
    const col = droneId % this.gridSize
    const spacing = 15.0

    const x = (col - this.gridSize / 2.0 + 0.5) * spacing
    const z = (row - this.gridSize / 2.0 + 0.5) * spacing

    // Dome calculation
    const centerOffset = Math.sqrt(x * x + z * z)
    const domeRadius = 700.0
    const domeHeight = 200.0
    const baseAltitude = 500.0

    let domeY = baseAltitude
    if (centerOffset < domeRadius) {
      const normalizedDistance = centerOffset / domeRadius
      const heightFactor = Math.sqrt(1.0 - normalizedDistance * normalizedDistance)
      domeY = baseAltitude + heightFactor * domeHeight
    }

    return { x, y: domeY, z }
  }

  // Heart formation position
  getHeartPosition(droneId, time = 0) {
    const t = (droneId / this.droneCount) * 2.0 * Math.PI

    const x = 16.0 * Math.pow(Math.sin(t), 3.0)
    const y = 13.0 * Math.cos(t) - 5.0 * Math.cos(2.0 * t) - 2.0 * Math.cos(3.0 * t) - Math.cos(4.0 * t)
    const z = Math.sin(t * 0.5) * 20.0

    const scale = 5.0
    const rotationSpeed = 0.5
    const angle = time * rotationSpeed
    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)

    return {
      x: x * scale * cosA - z * sinA,
      y: y * scale + 200.0,
      z: x * scale * sinA + z * cosA,
    }
  }

  // Spiral Galaxy formation position
  getSpiralGalaxyPosition(droneId, time = 0) {
    const armCount = 3.0
    const armIndex = droneId % armCount
    const droneInArm = Math.floor(droneId / armCount)

    const maxRadius = 300.0
    const radius = (droneInArm / (this.droneCount / armCount)) * maxRadius

    const baseAngle = (armIndex / armCount) * 2.0 * Math.PI
    const spiralTightness = 3.0
    let angle = baseAngle + (radius / maxRadius) * spiralTightness * 2.0 * Math.PI

    const rotationSpeed = 0.2
    angle += time * rotationSpeed

    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle)
    const y = Math.sin(radius * 0.02 + time) * 20.0 + 200.0

    return { x, y, z }
  }

  // DNA Helix formation position
  getDNAHelixPosition(droneId, time = 0) {
    const helixHeight = 400.0
    const helixRadius = 80.0
    const helixTurns = 4.0

    const strand = droneId % 2
    const droneInStrand = Math.floor(droneId / 2)

    const t = droneInStrand / (this.droneCount / 2.0)
    const y = (t - 0.5) * helixHeight + 200.0

    let angle = t * helixTurns * 2.0 * Math.PI + time * 0.5
    if (strand === 1) angle += Math.PI

    const x = helixRadius * Math.cos(angle)
    const z = helixRadius * Math.sin(angle)

    return { x, y, z }
  }

  // Fireworks formation position
  getFireworksPosition(droneId, time = 0) {
    const burstCount = 5
    const burstIndex = droneId % burstCount
    const droneInBurst = Math.floor(droneId / burstCount)

    const centers = [
      { x: 0, y: 300, z: 0 },
      { x: 150, y: 250, z: 100 },
      { x: -150, y: 250, z: 100 },
      { x: 0, y: 400, z: -150 },
      { x: 0, y: 200, z: 150 },
    ]

    const center = centers[burstIndex]
    const burstDelay = burstIndex * 2.0
    const burstTime = time - burstDelay

    if (burstTime < 0) return center

    const explosionDuration = 4.0
    const maxRadius = 120.0

    // Simple random direction (deterministic based on droneId)
    const phi = ((droneId * 0.618033988749) % 1.0) * Math.PI
    const theta = ((droneId * 0.381966011251) % 1.0) * 2.0 * Math.PI

    const direction = {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.cos(phi),
      z: Math.sin(phi) * Math.sin(theta),
    }

    const progress = Math.min(1.0, burstTime / explosionDuration)
    const easedProgress = progress * progress * (3.0 - 2.0 * progress)
    const distance = easedProgress * maxRadius * (0.5 + ((droneId * 0.123456) % 1.0) * 0.5)

    const gravity = -50.0 * progress * progress

    return {
      x: center.x + direction.x * distance,
      y: center.y + direction.y * distance + gravity,
      z: center.z + direction.z * distance,
    }
  }

  // Wave Patterns formation position
  getWavePosition(droneId, time = 0) {
    const gridSize = Math.sqrt(this.droneCount)
    const row = Math.floor(droneId / gridSize)
    const col = droneId % gridSize

    const spacing = 20.0
    const x = (col - gridSize / 2.0) * spacing
    const z = (row - gridSize / 2.0) * spacing

    const waveSpeed = 2.0
    const waveFreq = 0.02
    const waveAmplitude = 80.0

    const wave1 = Math.sin(x * waveFreq + time * waveSpeed) * waveAmplitude
    const wave2 = Math.sin(z * waveFreq + time * waveSpeed * 1.3) * waveAmplitude * 0.7
    const distFromCenter = Math.sqrt(x * x + z * z)
    const circularWave = Math.sin(distFromCenter * waveFreq * 0.5 - time * waveSpeed * 2.0) * waveAmplitude * 0.5
    const interference = Math.sin(x * waveFreq * 2.0 + time * waveSpeed) * Math.sin(z * waveFreq * 2.0 + time * waveSpeed * 0.8) * waveAmplitude * 0.3

    const y = 200.0 + wave1 + wave2 + circularWave + interference
    const phase = (x + z) * 0.01
    const finalY = y + Math.sin(time * 3.0 + phase) * 20.0

    return { x, y: finalY, z }
  }

  // Calculate distance between two 3D points
  calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    const dz = pos1.z - pos2.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  // Interpolate between two positions
  interpolatePosition(startPos, endPos, t) {
    // Smooth interpolation using smoothstep
    const smoothT = t * t * (3.0 - 2.0 * t)

    return {
      x: startPos.x + (endPos.x - startPos.x) * smoothT,
      y: startPos.y + (endPos.y - startPos.y) * smoothT,
      z: startPos.z + (endPos.z - startPos.z) * smoothT,
    }
  }

  // Analyze collision for a specific formation transition
  analyzeFormationTransition(formationName, transitionDuration = 10.0, timeStep = 0.1) {
    console.log(`🔍 Analyzing collision for ${formationName} formation...`)

    const getTargetPosition = (droneId, time) => {
      switch (formationName) {
        case 'Heart':
          return this.getHeartPosition(droneId, time)
        case 'SpiralGalaxy':
          return this.getSpiralGalaxyPosition(droneId, time)
        case 'DNAHelix':
          return this.getDNAHelixPosition(droneId, time)
        case 'Fireworks':
          return this.getFireworksPosition(droneId, time)
        case 'WavePatterns':
          return this.getWavePosition(droneId, time)
        default:
          return { x: 0, y: 200, z: 0 }
      }
    }

    const conflicts = []
    const timeSteps = Math.floor(transitionDuration / timeStep)
    let totalChecks = 0
    let minDistance = Infinity
    let maxConflictsAtTime = 0

    for (let step = 0; step <= timeSteps; step++) {
      const t = step / timeSteps
      const currentTime = step * timeStep
      const positions = []

      // Calculate all drone positions at this time step
      for (let droneId = 0; droneId < this.droneCount; droneId++) {
        const startPos = this.getDomePosition(droneId)
        const endPos = getTargetPosition(droneId, currentTime)
        positions[droneId] = this.interpolatePosition(startPos, endPos, t)
      }

      // Check all pairs for conflicts
      let conflictsAtThisTime = 0
      for (let i = 0; i < this.droneCount; i++) {
        for (let j = i + 1; j < this.droneCount; j++) {
          totalChecks++
          const distance = this.calculateDistance(positions[i], positions[j])

          if (distance < minDistance) {
            minDistance = distance
          }

          if (distance < this.safetyRadius) {
            conflicts.push({
              droneA: i,
              droneB: j,
              time: currentTime,
              distance: distance.toFixed(2),
              positionA: positions[i],
              positionB: positions[j],
            })
            conflictsAtThisTime++
          }
        }
      }

      if (conflictsAtThisTime > maxConflictsAtTime) {
        maxConflictsAtTime = conflictsAtThisTime
      }
    }

    // Analysis results
    const result = {
      formationName,
      totalConflicts: conflicts.length,
      uniquePairs: new Set(conflicts.map((c) => `${c.droneA}-${c.droneB}`)).size,
      totalChecks,
      minDistance: minDistance.toFixed(2),
      maxConflictsAtTime,
      safetyRadius: this.safetyRadius,
      transitionDuration,
      conflicts: conflicts.slice(0, 10), // Show first 10 conflicts
    }

    return result
  }

  // Analyze all formations
  analyzeAllFormations() {
    const formations = ['Heart', 'SpiralGalaxy', 'DNAHelix', 'Fireworks', 'WavePatterns']
    const results = []

    console.log(`🚁 Starting collision analysis for ${this.droneCount} drones...`)
    console.log(`📏 Safety radius: ${this.safetyRadius} units`)
    console.log(`⏱️  Analyzing transitions from dome formation to target formations...\n`)

    for (const formation of formations) {
      const startTime = performance.now()
      const result = this.analyzeFormationTransition(formation)
      const endTime = performance.now()

      result.analysisTime = `${(endTime - startTime).toFixed(1)}ms`
      results.push(result)

      // Log results
      const status = result.totalConflicts === 0 ? '✅ SAFE' : '⚠️  CONFLICTS DETECTED'
      console.log(`${status} - ${formation}:`)
      console.log(`  • Total conflicts: ${result.totalConflicts}`)
      console.log(`  • Unique drone pairs: ${result.uniquePairs}`)
      console.log(`  • Minimum distance: ${result.minDistance} units`)
      console.log(`  • Max simultaneous conflicts: ${result.maxConflictsAtTime}`)
      console.log(`  • Analysis time: ${result.analysisTime}`)

      if (result.totalConflicts > 0) {
        console.log(`  • Sample conflicts:`)
        result.conflicts.slice(0, 3).forEach((conflict, i) => {
          console.log(`    ${i + 1}. Drones ${conflict.droneA} & ${conflict.droneB} at t=${conflict.time}s (${conflict.distance} units apart)`)
        })
      }
      console.log('')
    }

    return results
  }
}

// Usage example:
// const analyzer = new CollisionAnalyzer(1024, 15.0)
// const results = analyzer.analyzeAllFormations()
