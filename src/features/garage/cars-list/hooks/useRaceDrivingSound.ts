import { useCallback, useEffect, useRef } from 'react';
import dragRacingAudio from '../../../../shared/assets/audio/drag-racing.mp3';

export function useRaceDrivingSound() {
  const drivingAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(dragRacingAudio);
    audio.loop = true;
    drivingAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      drivingAudioRef.current = null;
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

  return {
    playDrivingSound,
    stopDrivingSound,
  };
}
