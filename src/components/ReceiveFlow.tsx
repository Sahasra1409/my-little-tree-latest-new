import { useState, useEffect, useRef } from 'react';
import { receiveNote } from '../lib/supabase';

interface ReceiveFlowLoadingProps {
  onReceiveSuccess: (content: string) => void;
  onReceiveEmpty: () => void;
  onReceiveError: (msg: string) => void;
  stage?: undefined;
  onUntie?: undefined;
  onOpen?: undefined;
}

interface ReceiveFlowStageProps {
  stage: 'falling' | 'untie' | 'open';
  onUntie?: () => void;
  onOpen?: () => void;
  onReceiveSuccess?: undefined;
  onReceiveEmpty?: undefined;
  onReceiveError?: undefined;
}

type ReceiveFlowProps = ReceiveFlowLoadingProps | ReceiveFlowStageProps;

export default function ReceiveFlow(props: ReceiveFlowProps) {
  const { stage } = props;

  if (!stage) {
    return (
      <ReceiveLoading
        onReceiveSuccess={props.onReceiveSuccess!}
        onReceiveEmpty={props.onReceiveEmpty!}
        onReceiveError={props.onReceiveError!}
      />
    );
  }

  switch (stage) {
    case 'falling':
      return <FallingNote />;
    case 'untie':
      return <UntieNote onUntie={props.onUntie!} />;
    case 'open':
      return <OpenNote onOpen={props.onOpen!} />;
    default:
      return null;
  }
}

/* ===== Loading Stage ===== */
function ReceiveLoading({ onReceiveSuccess, onReceiveEmpty, onReceiveError }: {
  onReceiveSuccess: (content: string) => void;
  onReceiveEmpty: () => void;
  onReceiveError: (msg: string) => void;
}) {
  const [phase, setPhase] = useState(0);
  const hasCalled = useRef(false);

  useEffect(() => {
    setTimeout(() => setPhase(1), 100);
    setTimeout(() => setPhase(2), 600);

    if (hasCalled.current) return;
    hasCalled.current = true;

    const timer = setTimeout(async () => {
      const result = await receiveNote();

      if (result.error) {
        onReceiveError("The tree couldn't find a note right now.");
      } else if (!result.note) {
        onReceiveEmpty();
      } else {
        onReceiveSuccess(result.note.content);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [onReceiveSuccess, onReceiveEmpty, onReceiveError]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      {/* Gentle glowing dot */}
      <div
        className="pulse-dot"
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'var(--warm-gold)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      <p
        className="title-sub"
        style={{
          fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
          opacity: phase >= 2 ? 0.7 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        The tree is listening...
      </p>
    </div>
  );
}

/* ===== Falling Note Stage ===== */
function FallingNote() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setTimeout(() => setPhase(1), 100);
    setTimeout(() => setPhase(2), 2800); // After fall completes
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        minHeight: '60vh',
      }}
    >
      {/* The falling note */}
      <div
        className="falling-note"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: phase >= 1 ? 1 : 0,
        }}
      >
        {/* Thread hanging from top */}
        <div
          style={{
            width: '1px',
            height: '18px',
            background: 'linear-gradient(to bottom, transparent, var(--thread-color))',
            opacity: 0.5,
            marginBottom: '-2px',
          }}
        />

        {/* Rolled note */}
        <div
          style={{
            width: '22px',
            height: '35px',
            background: 'linear-gradient(145deg, #f7f0db 0%, var(--paper-cream) 35%, var(--paper-cream-dark) 65%, var(--paper-edge) 100%)',
            borderRadius: '2px',
            boxShadow: '2px 3px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            position: 'relative',
          }}
        >
          {/* Thread wraps */}
          <div
            style={{
              position: 'absolute',
              top: '28%',
              left: '-3px',
              right: '-3px',
              height: '1.5px',
              background: 'var(--thread-color)',
              borderRadius: '1px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '58%',
              left: '-3px',
              right: '-3px',
              height: '1.5px',
              background: 'var(--thread-color)',
              borderRadius: '1px',
            }}
          />
          {/* Small knot */}
          <div
            style={{
              position: 'absolute',
              top: '42%',
              right: '-4px',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'var(--thread-dark)',
            }}
          />
        </div>
      </div>

      {/* Hint text - appears after landing */}
      <p
        className="title-sub"
        style={{
          fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)',
          opacity: phase >= 2 ? 0.6 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        A note found its way to you...
      </p>
    </div>
  );
}

/* ===== Untie Stage ===== */
function UntieNote({ onUntie }: { onUntie: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setTimeout(() => setPhase(1), 200);
    setTimeout(() => setPhase(2), 600);
    setTimeout(() => setPhase(3), 1000);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(1rem, 2.5vh, 1.8rem)',
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <h2
          className="title-main"
          style={{
            fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)',
            marginBottom: 'clamp(0.3rem, 0.8vh, 0.5rem)',
          }}
        >
          A Little Note for You
        </h2>
        <p className="title-sub">Someone left this here.</p>
      </div>

      {/* Note visual */}
      <div
        style={{
          position: 'relative',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
          transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Thread from above */}
        <div
          style={{
            width: '1px',
            height: '16px',
            background: 'linear-gradient(to bottom, transparent, var(--thread-color))',
            margin: '0 auto',
            opacity: 0.5,
          }}
        />

        {/* Note */}
        <div
          style={{
            width: 'clamp(28px, 4.5vw, 40px)',
            height: 'clamp(44px, 7vw, 62px)',
            background: 'linear-gradient(145deg, #f7f0db 0%, var(--paper-cream) 35%, var(--paper-cream-dark) 65%, var(--paper-edge) 100%)',
            borderRadius: '2px',
            boxShadow: '2px 4px 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            position: 'relative',
          }}
        >
          {/* Thread wraps */}
          <div style={{ position: 'absolute', top: '25%', left: '-3px', right: '-3px', height: '2px', background: 'var(--thread-color)', borderRadius: '1px' }} />
          <div style={{ position: 'absolute', top: '55%', left: '-3px', right: '-3px', height: '2px', background: 'var(--thread-color)', borderRadius: '1px' }} />
          {/* Knot */}
          <div style={{ position: 'absolute', top: '38%', right: '-6px', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--thread-dark)' }} />
        </div>
      </div>

      {/* Untie button */}
      <button
        className="scene-btn scene-btn-primary"
        onClick={onUntie}
        aria-label="Untie the thread from the note"
        style={{
          minWidth: '160px',
          marginTop: 'clamp(0.3rem, 0.5vh, 0.5rem)',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        Untie
      </button>
    </div>
  );
}

/* ===== Open Stage ===== */
function OpenNote({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setTimeout(() => setPhase(1), 200);   // Show untied note
    setTimeout(() => setPhase(2), 1200);  // Show open button
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(1rem, 2.5vh, 1.8rem)',
      }}
    >
      {/* Untied note - no thread */}
      <div
        style={{
          position: 'relative',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* Falling thread remnant */}
        <div
          className="untying-thread"
          style={{
            position: 'absolute',
            top: '5px',
            right: '-20px',
            width: '25px',
            height: '2px',
            background: 'var(--thread-color)',
            transformOrigin: 'left center',
            opacity: 0.5,
          }}
        />

        {/* Note without thread */}
        <div
          style={{
            width: 'clamp(28px, 4.5vw, 40px)',
            height: 'clamp(44px, 7vw, 62px)',
            background: 'linear-gradient(145deg, #f7f0db 0%, var(--paper-cream) 35%, var(--paper-cream-dark) 65%, var(--paper-edge) 100%)',
            borderRadius: '2px',
            boxShadow: '2px 4px 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            transition: 'transform 0.5s ease',
            transform: phase >= 1 ? 'scale(1)' : 'scale(0.9)',
          }}
        />
      </div>

      {/* Open button */}
      <button
        className="scene-btn scene-btn-primary"
        onClick={onOpen}
        aria-label="Open and read the note"
        style={{
          minWidth: '160px',
          marginTop: 'clamp(0.3rem, 0.5vh, 0.5rem)',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        Open
      </button>
    </div>
  );
}
