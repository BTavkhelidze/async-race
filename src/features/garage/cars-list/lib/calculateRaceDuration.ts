export function calculateRaceDuration(
  distance: number,
  velocity: number,
): number {
  if (!Number.isFinite(distance) || !Number.isFinite(velocity) || velocity <= 0) {
    return 0;
  }

  return distance / velocity;
}
