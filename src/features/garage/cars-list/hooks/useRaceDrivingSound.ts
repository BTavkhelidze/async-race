import { useCallback, useEffect, useRef } from 'react';
import dragRacingAudio from '../../../../shared/assets/audio/drag-racing.mp3';
import carStopAudio from '../../../../shared/assets/audio/car-stop.mp3';

export function useRaceDrivingSound() {
  const drivingAudioRef = useRef<HTMLAudioElement | null>(null);
  const stopAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const drivingAudio = new Audio(dragRacingAudio);
    const stopAudio = new Audio(carStopAudio);
    drivingAudio.loop = true;
    stopAudio.loop = false;
    drivingAudioRef.current = drivingAudio;
    stopAudioRef.current = stopAudio;

    return () => {
      drivingAudio.pause();
      drivingAudio.currentTime = 0;
      drivingAudio.src = '';
      stopAudio.pause();
      stopAudio.currentTime = 0;
      stopAudio.src = '';
      drivingAudioRef.current = null;
      stopAudioRef.current = null;
    };
  }, []);

  const playDrivingSound = useCallback(() => {
    const audio = drivingAudioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, []);

  const stopDrivingSound = useCallback(() => {
    const audio = drivingAudioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }, []);

  const playStopSound = useCallback(() => {
    const drivingAudio = drivingAudioRef.current;
    const stopAudio = stopAudioRef.current;

    if (drivingAudio) {
      drivingAudio.pause();
      drivingAudio.currentTime = 0;
    }

    if (!stopAudio) return;

    stopAudio.pause();
    stopAudio.currentTime = 0;
    void stopAudio.play().catch(() => undefined);
  }, []);

  const stopAllRaceSounds = useCallback(() => {
    const drivingAudio = drivingAudioRef.current;
    const stopAudio = stopAudioRef.current;

    if (drivingAudio) {
      drivingAudio.pause();
      drivingAudio.currentTime = 0;
    }

    if (stopAudio) {
      stopAudio.pause();
      stopAudio.currentTime = 0;
    }
  }, []);

  return {
    playDrivingSound,
    stopDrivingSound,
    playStopSound,
    stopAllRaceSounds,
  };
}
