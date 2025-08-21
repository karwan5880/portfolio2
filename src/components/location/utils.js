import * as THREE from 'three'

/**
 * Converts latitude and longitude to 3D coordinates on a sphere.
 * @param {number} lat - Latitude in degrees.
 * @param {number} lon - Longitude in degrees.
 * @param {number} radius - The radius of the sphere.
 * @returns {THREE.Vector3} - The 3D position vector.
 */
export function latLonToVector3(lat, lon, radius) {
  // Convert degrees to radians
  const phi = (90 - lat) * (Math.PI / 180)
  // const theta = (lon + 90) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  // Calculate the 3D position
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}
