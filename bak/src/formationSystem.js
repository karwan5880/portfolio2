// Simplified formation configuration system for easy management

export const formationConfigs = [
  {
    name: 'Circle',
    startTime: 75.0,
    duration: 30.0,
    center: [0, 350, 0],
    radius: 100,
    type: 'circle',
    participantRows: [0, 1],
  },
  {
    name: 'Top Rainbow',
    startTime: 105.0,
    duration: 8.0,
    center: [0, 450, 0],
    radius: 200,
    type: 'rainbow_up',
    participantRows: [2],
  },
  {
    name: 'Inverted Rainbow',
    startTime: 110.0,
    duration: 8.0,
    center: [0, 250, 0],
    radius: 200,
    type: 'rainbow_down',
    participantRows: [4],
  },
  {
    name: 'Bigger Inverted Rainbow',
    startTime: 115.0,
    duration: 8.0,
    center: [0, 150, 0],
    radius: 300,
    type: 'rainbow_down',
    participantRows: [6],
  },
  {
    name: 'Bigger Upper Rainbow',
    startTime: 120.0,
    duration: 8.0,
    center: [0, 600, 0],
    radius: 350,
    type: 'rainbow_up',
    participantRows: [8],
  },
  {
    name: 'Front/Back Rainbow',
    startTime: 125.0,
    duration: 8.0,
    center: [0, 350, 0],
    radius: 250,
    type: 'depth_arc',
    participantRows: [10, 11], // Row 10 = front, Row 11 = back
  },
  {
    name: 'Bigger Front/Back Rainbow',
    startTime: 130.0,
    duration: 8.0,
    center: [0, 350, 0],
    radius: 400,
    type: 'depth_arc',
    participantRows: [12, 13], // Row 12 = front, Row 13 = back
  },
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
