import { useEffect, useRef, useCallback } from 'react';

interface AudioControllerProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function AudioController({ enabled, onToggle }: AudioControllerProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isInitializedRef = useRef(false);

  const initAudio = useCallback(() => {
    if (isInitializedRef.current && audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      isInitializedRef.current = true;

      // Create gentle wind noise
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

      for (let ch = 0; ch < 2; ch++) {
        const data = noiseBuffer.getChannelData(ch);
        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Brown noise (integrate white noise)
          last = (last + (0.02 * white)) / 1.02;
          data[i] = last * 3.5;
        }
      }

      const windSource = ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.value = 350;
      windFilter.Q.value = 0.5;

      const windGain = ctx.createGain();
      windGain.gain.value = 0.06;

      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(ctx.destination);
      windSource.start();

      // Subtle cricket sounds
      const createCricket = (freq: number, startDelay: number) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const cricketGain = ctx.createGain();
        cricketGain.gain.value = 0;

        // Tremolo for chirping effect
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 42 + Math.random() * 25;

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.002;

        lfo.connect(lfoGain);
        lfoGain.connect(cricketGain.gain);

        osc.connect(cricketGain);
        cricketGain.connect(ctx.destination);

        osc.start(ctx.currentTime + startDelay);
        lfo.start(ctx.currentTime + startDelay);

        // Pulse the cricket
        const pulse = () => {
          if (ctx.state !== 'running') {
            setTimeout(pulse, 1000);
            return;
          }
          const now = ctx.currentTime;
          const dur = 0.08 + Math.random() * 0.25;
          const gap = 1.5 + Math.random() * 5;

          cricketGain.gain.setValueAtTime(0.001, now);
          cricketGain.gain.linearRampToValueAtTime(0.004, now + 0.04);
          cricketGain.gain.linearRampToValueAtTime(0.004, now + dur);
          cricketGain.gain.linearRampToValueAtTime(0.001, now + dur + 0.03);

          setTimeout(pulse, (dur + gap) * 1000);
        };

        setTimeout(pulse, startDelay * 1000 + 500);
      };

      createCricket(4100, 0.3);
      createCricket(3700, 1.5);
      createCricket(4400, 3.5);

      // Very subtle low drone for depth
      const drone = ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.value = 80;

      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.012;

      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.value = 120;

      drone.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(ctx.destination);
      drone.start();

    } catch (err) {
      console.warn('Audio initialization failed:', err);
    }
  }, []);

  // Toggle audio state
  useEffect(() => {
    if (enabled) {
      initAudio();
    } else if (audioCtxRef.current?.state === 'running') {
      audioCtxRef.current.suspend();
    }
  }, [enabled, initAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      className="audio-toggle"
      onClick={onToggle}
      aria-label={enabled ? 'Mute ambient sounds' : 'Enable ambient sounds'}
      title={enabled ? 'Mute ambient sounds' : 'Enable ambient sounds'}
    >
      {enabled ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
