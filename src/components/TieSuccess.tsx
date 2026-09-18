import { useState, useEffect } from 'react';

interface TieSuccessProps {
  onLeaveAnother: () => void;
  onGoBack: () => void;
}

export default function TieSuccess({ onLeaveAnother, onGoBack }: TieSuccessProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(1rem, 2.5vh, 1.5rem)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {/* Success message */}
      <div style={{ textAlign: 'center' }}>
        <p
          className="title-sub"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            marginBottom: 'clamp(0.3rem, 0.8vh, 0.5rem)',
          }}
        >
          Your note is safe here.
        </p>
        <p
          className="font-body"
          style={{
            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
            color: 'rgba(168, 155, 196, 0.6)',
            fontStyle: 'italic',
          }}
        >
          Someone else will find it.
        </p>
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: '40px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,190,170,0.3), transparent)',
        }}
      />

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.5rem, 1.2vh, 0.75rem)',
          alignItems: 'center',
        }}
      >
        <button
          className="scene-btn scene-btn-primary"
          onClick={onLeaveAnother}
          aria-label="Leave another note"
        >
          Leave Another Note
        </button>
        <button
          className="scene-btn"
          onClick={onGoBack}
          aria-label="Go back to the tree"
          style={{ fontSize: '0.7rem' }}
        >
          Go Back to the Tree
        </button>
      </div>
    </div>
  );
}
