import { useState, useEffect, useRef } from 'react';
import { leaveNote } from '../lib/supabase';

interface RollAnimationProps {
  content: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

type RollStage = 'visible' | 'folding' | 'rolling' | 'threading' | 'floating' | 'saving' | 'done';

export default function RollAnimation({ content, onSuccess, onError }: RollAnimationProps) {
  const [stage, setStage] = useState<RollStage>('visible');
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const timers: NodeJS.Timeout[] = [];

    // Sequence
    timers.push(setTimeout(() => setStage('folding'), 400));
    timers.push(setTimeout(() => setStage('rolling'), 1200));
    timers.push(setTimeout(() => setStage('threading'), 1900));
    timers.push(setTimeout(() => setStage('floating'), 2700));
    timers.push(setTimeout(() => setStage('saving'), 3400));

    // Save to database
    timers.push(setTimeout(async () => {
      const result = await leaveNote(content);
      if (result.success) {
        setStage('done');
        timers.push(setTimeout(() => onSuccess(), 1200));
      } else {
        onError("The wind got in the way. Your note wasn't tied yet.");
      }
    }, 3600));

    return () => timers.forEach(clearTimeout);
  }, [content, onSuccess, onError]);

  const getPaperTransform = (): string => {
    switch (stage) {
      case 'visible': return 'scaleY(1) scaleX(1)';
      case 'folding': return 'scaleY(0.4) scaleX(1)';
      case 'rolling': return 'scaleY(0.06) scaleX(0.45)';
      case 'threading': return 'scaleY(0.05) scaleX(0.25)';
      case 'floating': return 'scaleY(0.04) scaleX(0.15) translateY(-350px)';
      case 'saving': return 'scaleY(0.03) scaleX(0.1) translateY(-450px)';
      case 'done': return 'scaleY(0.02) scaleX(0.06) translateY(-500px)';
      default: return 'scaleY(1) scaleX(1)';
    }
  };

  const getPaperOpacity = (): number => {
    switch (stage) {
      case 'visible':
      case 'folding':
      case 'rolling':
      case 'threading': return 1;
      case 'floating': return 0.6;
      case 'saving': return 0.3;
      case 'done': return 0;
      default: return 1;
    }
  };

  const showThread = stage === 'threading' || stage === 'floating' || stage === 'saving';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(1.5rem, 3vh, 2.5rem)',
        minHeight: '50vh',
      }}
    >
      {/* Paper being rolled */}
      <div
        className="paper"
        style={{
          width: 'clamp(280px, 48vw, 420px)',
          minHeight: stage === 'visible' || stage === 'folding' ? '200px' : '20px',
          position: 'relative',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: getPaperTransform(),
          opacity: getPaperOpacity(),
          transformOrigin: 'center center',
          borderRadius: stage === 'rolling' || stage === 'threading' ? '15px' : '2px',
        }}
      >
        {/* Written content that fades away */}
        <div
          className="handwritten-text"
          style={{
            opacity: stage === 'visible' ? 1 : stage === 'folding' ? 0.15 : 0,
            transition: 'opacity 0.5s ease',
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            padding: '1.5rem 2rem',
            wordBreak: 'break-word',
            lineHeight: '1.9rem',
          }}
        >
          {content}
        </div>

        {/* Thread wrapping */}
        {showThread && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            {/* Horizontal thread */}
            <div
              style={{
                position: 'absolute',
                width: '130%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 5%, var(--thread-color) 20%, var(--thread-color) 80%, transparent 95%)',
                transform: 'rotate(12deg)',
                opacity: 0,
                animation: 'threadAppear 0.4s ease-out 0.1s forwards',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '130%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 5%, var(--thread-color) 20%, var(--thread-color) 80%, transparent 95%)',
                transform: 'rotate(-12deg)',
                opacity: 0,
                animation: 'threadAppear 0.4s ease-out 0.3s forwards',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '130%',
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent 8%, var(--thread-dark) 25%, var(--thread-dark) 75%, transparent 92%)',
                transform: 'rotate(38deg)',
                opacity: 0,
                animation: 'threadAppear 0.4s ease-out 0.5s forwards',
              }}
            />
            {/* Knot */}
            <div
              style={{
                position: 'absolute',
                right: '15%',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--thread-dark)',
                opacity: 0,
                animation: 'threadAppear 0.3s ease-out 0.7s forwards',
              }}
            />
          </div>
        )}
      </div>

      {/* Status text */}
      <p
        className="title-sub"
        style={{
          fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)',
          opacity: stage === 'saving' ? 0.8 : stage === 'done' ? 0.7 : 0.5,
          transition: 'opacity 0.5s ease',
        }}
      >
        {stage === 'saving' && 'Tying your note to the tree...'}
        {stage === 'done' && 'Your note is tied.'}
        {!['saving', 'done'].includes(stage) && 'Rolling your note...'}
      </p>
    </div>
  );
}
