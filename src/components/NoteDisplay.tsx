import { useState, useEffect, useCallback } from 'react';
import { saveNoteLocally, printNote } from '../lib/supabase';

interface NoteDisplayProps {
  content: string;
  onLeaveOne: () => void;
  onGoBack: () => void;
}

export default function NoteDisplay({ content, onLeaveOne, onGoBack }: NoteDisplayProps) {
  const [phase, setPhase] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Sequenced reveal
    setTimeout(() => setPhase(1), 100);    // Paper starts opening
    setTimeout(() => setPhase(2), 2200);   // Text starts appearing
    setTimeout(() => setPhase(3), 3200);   // Attribution appears
    setTimeout(() => setPhase(4), 4000);   // Buttons appear
  }, []);

  const handleKeepNote = useCallback(() => {
    saveNoteLocally(content);
    setSaved(true);
    setPhase(5);
  }, [content]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'a-little-note.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content]);

  const handlePrint = useCallback(() => {
    printNote(content);
  }, [content]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(0.75rem, 2vh, 1.5rem)',
        maxWidth: '560px',
        width: '90%',
      }}
    >
      {/* Paper unrolling */}
      <div
        className={`paper ${phase < 2 ? 'opening-paper' : ''}`}
        style={{
          width: '100%',
          minHeight: 'clamp(160px, 26vh, 270px)',
          position: 'relative',
          transformOrigin: 'center center',
        }}
      >
        {/* Message content */}
        <div
          className="handwritten-text"
          style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
            lineHeight: 'clamp(1.85rem, 3.5vw, 2.3rem)',
            padding: 'clamp(1.25rem, 3vh, 2rem) clamp(1.5rem, 3vw, 2.5rem)',
            wordBreak: 'break-word',
            opacity: phase >= 2 ? 1 : 0,
            filter: phase >= 2 ? 'blur(0px)' : 'blur(6px)',
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(4px)',
            transition: 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {content}
        </div>

        {/* Subtle fold line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '8%',
            right: '8%',
            height: '1px',
            background: 'rgba(180,170,150,0.06)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Attribution */}
      <p
        className="font-body"
        style={{
          fontSize: 'clamp(0.8rem, 1.3vw, 0.92rem)',
          color: 'rgba(168, 155, 196, 0.45)',
          fontStyle: 'italic',
          textAlign: 'center',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        Someone, somewhere, left this for you.
      </p>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(0.4rem, 1vh, 0.6rem)',
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {!saved ? (
          <>
            <button
              className="scene-btn scene-btn-primary"
              onClick={handleKeepNote}
              aria-label="Save this note to your local collection"
              style={{ minWidth: '200px' }}
            >
              Keep This Note
            </button>

            <button
              className="scene-btn"
              onClick={onLeaveOne}
              aria-label="Write a note for someone else"
              style={{ minWidth: '200px' }}
            >
              Leave One for Someone
            </button>

            <button
              className="scene-btn"
              onClick={onGoBack}
              aria-label="Return to the willow tree"
              style={{ fontSize: '0.68rem', padding: '0.55rem 1.25rem' }}
            >
              Go Back to the Tree
            </button>
          </>
        ) : (
          <>
            <p
              className="title-sub"
              style={{
                fontSize: 'clamp(0.82rem, 1.4vw, 0.95rem)',
                marginBottom: '0.3rem',
                opacity: phase >= 5 ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            >
              Saved to your collection.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <button
                className="scene-btn"
                onClick={handleDownload}
                aria-label="Download the note as a text file"
              >
                Download
              </button>
              <button
                className="scene-btn"
                onClick={handlePrint}
                aria-label="Print the note"
              >
                Print
              </button>
            </div>

            <button
              className="scene-btn scene-btn-primary"
              onClick={onLeaveOne}
              aria-label="Write a note for someone else"
              style={{ minWidth: '200px' }}
            >
              Leave One for Someone
            </button>

            <button
              className="scene-btn"
              onClick={onGoBack}
              aria-label="Return to the willow tree"
              style={{ fontSize: '0.68rem', padding: '0.55rem 1.25rem' }}
            >
              Go Back to the Tree
            </button>
          </>
        )}
      </div>
    </div>
  );
}
