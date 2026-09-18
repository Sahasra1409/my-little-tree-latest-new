import { useState, useEffect } from 'react';

interface ErrorStateProps {
  message: string | null;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setTimeout(() => setPhase(1), 200);
    setTimeout(() => setPhase(2), 800);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(0.75rem, 2vh, 1.25rem)',
        maxWidth: '420px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <p
          className="title-sub"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            marginBottom: 'clamp(0.3rem, 0.8vh, 0.5rem)',
            color: 'rgba(212, 165, 116, 0.65)',
          }}
        >
          {message || 'Something went wrong.'}
        </p>
        <p
          className="font-body"
          style={{
            fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)',
            color: 'rgba(168, 155, 196, 0.35)',
            fontStyle: 'italic',
          }}
        >
          The wind may have carried it away.
        </p>
      </div>

      <div
        style={{
          width: '35px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,190,170,0.2), transparent)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      <button
        className="scene-btn"
        onClick={onRetry}
        aria-label="Go back and try again"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
