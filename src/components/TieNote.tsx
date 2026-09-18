import { useState, useEffect, useRef } from 'react';

interface TieNoteProps {
  onRoll: (content: string) => void;
  onBack: () => void;
}

const MAX_CHARS = 500;

export default function TieNote({ onRoll, onBack }: TieNoteProps) {
  const [content, setContent] = useState('');
  const [phase, setPhase] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => {
        setPhase(3);
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const charCount = content.length;
  const isNearLimit = charCount > 400;
  const isAtLimit = charCount >= MAX_CHARS;
  const canSubmit = content.trim().length > 0 && content.trim().length <= MAX_CHARS;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onRoll(content.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onBack();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(0.75rem, 2vh, 1.5rem)',
        maxWidth: '520px',
        width: '90%',
      }}
    >
      {/* Prompt */}
      <p
        className="title-sub"
        style={{
          fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        What would you like to leave for someone?
      </p>

      {/* Paper */}
      <div
        className="paper"
        style={{
          width: '100%',
          minHeight: 'clamp(200px, 32vh, 300px)',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <textarea
          ref={textareaRef}
          className="paper-textarea"
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setContent(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write something kind..."
          rows={7}
          maxLength={MAX_CHARS}
          aria-label="Write your anonymous note. Maximum 500 characters."
          style={{
            minHeight: 'clamp(170px, 28vh, 260px)',
            opacity: phase >= 3 ? 1 : 0.5,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Character counter */}
        <div
          className={`char-counter ${isNearLimit ? 'near-limit' : ''} ${isAtLimit ? 'at-limit' : ''}`}
        >
          {charCount} / {MAX_CHARS}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(0.4rem, 1vh, 0.6rem)',
          width: '100%',
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <button
          className="scene-btn scene-btn-primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label="Roll up and tie your note to the tree"
          style={{
            minWidth: '200px',
            opacity: canSubmit ? 1 : 0.35,
          }}
        >
          Roll My Note
        </button>

        <button
          className="scene-btn"
          onClick={onBack}
          aria-label="Go back to the tree"
          style={{ fontSize: '0.68rem', padding: '0.6rem 1.5rem' }}
        >
          Back to the Tree
        </button>

        <p
          className="font-body"
          style={{
            fontSize: '0.6rem',
            color: 'rgba(168, 155, 196, 0.25)',
            fontStyle: 'italic',
            marginTop: '0.15rem',
          }}
        >
          {navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to submit
        </p>
      </div>
    </div>
  );
}
