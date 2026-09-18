import { useState, useEffect } from 'react';

interface EmptyTreeProps {
  onTieNote: () => void;
  onGoBack: () => void;
}

export default function EmptyTree({ onTieNote, onGoBack }: EmptyTreeProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setTimeout(() => setPhase(1), 200);
    setTimeout(() => setPhase(2), 700);
    setTimeout(() => setPhase(3), 1200);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(0.75rem, 2vh, 1.25rem)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <p
          className="title-sub"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            marginBottom: 'clamp(0.3rem, 0.8vh, 0.5rem)',
          }}
        >
          The tree is quiet tonight.
        </p>
        <p
          className="font-body"
          style={{
            fontSize: 'clamp(0.82rem, 1.4vw, 0.95rem)',
            color: 'rgba(168, 155, 196, 0.5)',
            fontStyle: 'italic',
          }}
        >
          Maybe leave a little note for someone first.
        </p>
      </div>

      <div
        style={{
          width: '35px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,190,170,0.25), transparent)',
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.4rem, 1vh, 0.6rem)',
          alignItems: 'center',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <button
          className="scene-btn scene-btn-primary"
          onClick={onTieNote}
          aria-label="Leave a note on the tree"
          style={{ minWidth: '180px' }}
        >
          Tie a Note
        </button>
        <button
          className="scene-btn"
          onClick={onGoBack}
          aria-label="Go back to the tree"
          style={{ fontSize: '0.68rem', padding: '0.55rem 1.25rem' }}
        >
          Go Back to the Tree
        </button>
      </div>
    </div>
  );
}
