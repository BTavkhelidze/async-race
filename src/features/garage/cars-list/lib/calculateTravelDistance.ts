export function calculateTravelDistance(
  trackWidth: number,
  carWidth: number,
  finishLineOffset: number,
): number {
  return Math.max(trackWidth - finishLineOffset - carWidth, 0);
}
