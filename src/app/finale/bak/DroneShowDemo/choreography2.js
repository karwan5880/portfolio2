// DroneShowDemo/choreography.js

export const choreography = {
  DRAGON_BODY: 1,
  DRAGON_HEAD: 2,
  DRAGON_TAIL: 3,
  PEARL: 4,

  formations: {
    // START OF FIX: Add a new starting formation
    GRID: { name: 'Grid', index: 0 },
    // Re-number the existing formations
    TEXT_2024: { name: '2024', index: 1 },
    SPHERE: { name: 'Sphere', index: 2 },
    // END OF FIX
  },
}
