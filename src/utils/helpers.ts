export function isInsideSweden(lat: number, lon: number): boolean {
  return lat >= 55.0 && lat <= 69.1 && lon >= 10.9 && lon <= 24.2
}
