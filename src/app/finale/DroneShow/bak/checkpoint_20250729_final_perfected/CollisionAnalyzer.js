// Collision Analysis System for Drone Show Testing
// This system analyzes drone positions frame-by-frame to detect collisions

export class CollisionAnalyzer {
  constructor() {
    this.collisionHistory = []
    this.frameCount = 0
    this.collisionRadius = 20.0 // Same as shader
    this.warningRadius = 30.0
  }

  // Analyze a frame of drone positions
  analyzeFrame(dronePositions, timestamp) {
    this.frameCount++
    const collisions = []
    const warnings = []

    // Check all drone pairs for collisions
    for (let i = 0; i < dronePositions.length; i++) {
      for (let j = i + 1; j < dronePositions.length; j++) {
        const pos1 = dronePositions[i]
        const pos2 = dronePositions[j]

        const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) + Math.pow(pos1.z - pos2.z, 2))

        if (distance < this.collisionRadius) {
          collisions.push({
            drone1: i,
            drone2: j,
            distance: distance,
            position1: pos1,
            position2: pos2,
            timestamp: timestamp,
          })
        } else if (distance < this.warningRadius) {
          warnings.push({
            drone1: i,
            drone2: j,
            distance: distance,
            timestamp: timestamp,
          })
        }
      }
    }

    // Store frame analysis
    const frameAnalysis = {
      frame: this.frameCount,
      timestamp: timestamp,
      totalDrones: dronePositions.length,
      collisions: collisions,
      warnings: warnings,
      collisionCount: collisions.length,
      warningCount: warnings.length,
    }

    this.collisionHistory.push(frameAnalysis)

    // Log critical collisions
    if (collisions.length > 0) {
      console.error(`🚨 COLLISION DETECTED at ${timestamp.toFixed(2)}s:`, {
        collisionCount: collisions.length,
        collisions: collisions,
      })
    }

    return frameAnalysis
  }

  // Get collision statistics
  getStatistics() {
    const totalFrames = this.collisionHistory.length
    const framesWithCollisions = this.collisionHistory.filter((f) => f.collisionCount > 0).length
    const framesWithWarnings = this.collisionHistory.filter((f) => f.warningCount > 0).length

    const totalCollisions = this.collisionHistory.reduce((sum, f) => sum + f.collisionCount, 0)
    const totalWarnings = this.collisionHistory.reduce((sum, f) => sum + f.warningCount, 0)

    return {
      totalFrames,
      framesWithCollisions,
      framesWithWarnings,
      collisionRate: ((framesWithCollisions / totalFrames) * 100).toFixed(2) + '%',
      warningRate: ((framesWithWarnings / totalFrames) * 100).toFixed(2) + '%',
      totalCollisions,
      totalWarnings,
      averageCollisionsPerFrame: (totalCollisions / totalFrames).toFixed(2),
      averageWarningsPerFrame: (totalWarnings / totalFrames).toFixed(2),
    }
  }

  // Get worst collision moments
  getWorstMoments(count = 5) {
    return this.collisionHistory
      .filter((f) => f.collisionCount > 0)
      .sort((a, b) => b.collisionCount - a.collisionCount)
      .slice(0, count)
  }

  // Export collision data for analysis
  exportData() {
    return {
      statistics: this.getStatistics(),
      worstMoments: this.getWorstMoments(),
      fullHistory: this.collisionHistory,
    }
  }

  // Reset analyzer
  reset() {
    this.collisionHistory = []
    this.frameCount = 0
  }
}

// Usage example:
// const analyzer = new CollisionAnalyzer();
//
// // In your render loop:
// const positions = getDronePositions(); // Get current drone positions
// const analysis = analyzer.analyzeFrame(positions, currentTime);
//
// // Get statistics:
// console.log(analyzer.getStatistics());
