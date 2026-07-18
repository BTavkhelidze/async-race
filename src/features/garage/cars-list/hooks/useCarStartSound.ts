import { useCallback, useEffect, useRef } from 'react';
import carStartAudio from '../../../../shared/assets/audio/car-start.mp3';
import { delay } from '../../../../shared/lib/delay';
import { MIN_ENGINE_START_DURATION_MS } from '../model/engine.constants';

export function useCarStartSound() {
  const startAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(carStartAudio);
    audio.loop = false;
    startAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      startAudioRef.current = null;
    };
  }, []);

  const playStartSound = useCallback(() => {
    const audio = startAudioRef.current;

    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, []);

  const stopStartSound = useCallback(() => {
    const audio = startAudioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }, []);

  const waitForMinimumStartDuration = useCallback(() => {
    return delay(MIN_ENGINE_START_DURATION_MS);
  }, []);

  const playStartSoundForMinimumDuration = useCallback(async () => {
    playStartSound();
    await waitForMinimumStartDuration();
  }, [playStartSound, waitForMinimumStartDuration]);

  return {
    playStartSound,
    stopStartSound,
    waitForMinimumStartDuration,
    playStartSoundForMinimumDuration,
  };
}
