export function calculateTravelDistance(
  trackWidth: number,
  carWidth: number,
): number {
  return Math.max(trackWidth - carWidth, 0);
}
