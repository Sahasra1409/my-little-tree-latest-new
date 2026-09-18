import { useState, useEffect } from 'react';

interface LandingProps {
  onTieNote: () => void;
  onReceiveNote: () => void;
}

export default function Landing({ onTieNote, onReceiveNote }: LandingProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),   // Title appears
      setTimeout(() => setPhase(2), 800),   // Subtitle appears
      setTimeout(() => setPhase(3), 1400),  // Buttons appear
      setTimeout(() => setPhase(4), 2000),  // Footer appears
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(1.5rem, 4vh, 3rem)',
        textAlign: 'center',
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(25px)',
          transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <h1 className="title-main">
          A Little Note<br />
          <span style={{ fontSize: '0.85em', letterSpacing: '0.06em' }}>for You</span>
        </h1>
      </div>

      {/* Subtitle */}
      <p
        className="title-sub"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        Someone left something here.
      </p>

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.6rem, 1.5vh, 1rem)',
          alignItems: 'center',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <button
          className="scene-btn scene-btn-primary"
          onClick={onTieNote}
          aria-label="Tie a note to the willow tree"
          style={{
            minWidth: 'clamp(180px, 30vw, 220px)',
            fontSize: 'clamp(0.78rem, 1.4vw, 0.88rem)',
            padding: 'clamp(0.75rem, 1.5vh, 1rem) clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          Tie a Note
        </button>

        <button
          className="scene-btn"
          onClick={onReceiveNote}
          aria-label="Receive a random note from the willow tree"
          style={{
            minWidth: 'clamp(180px, 30vw, 220px)',
            fontSize: 'clamp(0.78rem, 1.4vw, 0.88rem)',
            padding: 'clamp(0.75rem, 1.5vh, 1rem) clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          Receive a Note
        </button>
      </div>

      {/* Separator */}
      <div
        style={{
          width: '35px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,190,170,0.25), transparent)',
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      />

      {/* Tagline */}
      <p
        className="font-body"
        style={{
          fontSize: 'clamp(0.6rem, 1.1vw, 0.72rem)',
          color: 'rgba(168, 155, 196, 0.3)',
          fontStyle: 'italic',
          letterSpacing: '0.12em',
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      >
        a quiet exchange between strangers
      </p>
    </div>
  );
}
