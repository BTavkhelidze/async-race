export function calculateTravelDistance(
  trackWidth: number,
  carWidth: number,
  finishLineWidth: number,
  safeOffset: number,
): number {
  return Math.max(trackWidth - carWidth - finishLineWidth - safeOffset, 0);
}
