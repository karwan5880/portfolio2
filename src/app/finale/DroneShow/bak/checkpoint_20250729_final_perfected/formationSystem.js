// Simplified formation configuration system for easy management

export const formationConfigs = [
  // ALL RECTANGLE FORMATIONS REMOVED - COMPLETELY GONE!
]

// Helper function to easily add new formations
export function createFormation(name, startTime, duration, center, radius, type, participantRows) {
  return {
    name,
    startTime,
    duration,
    center,
    radius,
    type,
    participantRows,
  }
}

// Example of how to add a new formation:
// const heartFormation = createFormation('Heart', 140.0, 10.0, [0, 400, 0], 150, 'heart', [14, 15]);
// formationConfigs.push(heartFormation);
