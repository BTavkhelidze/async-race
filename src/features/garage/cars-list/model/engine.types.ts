export type EngineStatus = 'started' | 'drive';

export type EngineStartedResponse = {
  velocity: number;
  distance: number;
};

export type DriveResponse = {
  success: boolean;
};
