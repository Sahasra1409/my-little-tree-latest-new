import { useState, useEffect, useCallback } from 'react';
import Scene from './components/Scene';
import Landing from './components/Landing';
import TieNote from './components/TieNote';
import RollAnimation from './components/RollAnimation';
import TieSuccess from './components/TieSuccess';
import ReceiveFlow from './components/ReceiveFlow';
import NoteDisplay from './components/NoteDisplay';
import EmptyTree from './components/EmptyTree';
import ErrorState from './components/ErrorState';
import AudioController from './components/AudioController';
import CreatorCredit from './components/CreatorCredit';
import { seedIfEmpty } from './lib/supabase';

export type AppScene =
  | 'landing'
  | 'tie-writing'
  | 'tie-rolling'
  | 'tie-success'
  | 'receive-loading'
  | 'receive-falling'
  | 'receive-untie'
  | 'receive-open'
  | 'receive-reading'
  | 'receive-empty'
  | 'error';

export default function App() {
  const [scene, setScene] = useState<AppScene>('landing');
  const [noteContent, setNoteContent] = useState('');
  const [receivedNote, setReceivedNote] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);

  // Seed notes on first load
  useEffect(() => {
    seedIfEmpty();
  }, []);

  // Smooth fade transition between scenes
  const transitionTo = useCallback((newScene: AppScene, delay: number = 600) => {
    setContentOpacity(0);
    setTimeout(() => {
      setScene(newScene);
      requestAnimationFrame(() => {
        setContentOpacity(1);
      });
    }, delay);
  }, []);

  const goHome = useCallback(() => {
    setNoteContent('');
    setReceivedNote(null);
    setErrorMessage(null);
    transitionTo('landing');
  }, [transitionTo]);

  const startTieNote = useCallback(() => {
    setNoteContent('');
    transitionTo('tie-writing');
  }, [transitionTo]);

  const startRolling = useCallback((content: string) => {
    setNoteContent(content);
    transitionTo('tie-rolling');
  }, [transitionTo]);

  const onRollSuccess = useCallback(() => {
    transitionTo('tie-success');
  }, [transitionTo]);

  const onRollError = useCallback((msg: string) => {
    setErrorMessage(msg);
    transitionTo('error');
  }, [transitionTo]);

  const startReceiving = useCallback(() => {
    setReceivedNote(null);
    transitionTo('receive-loading');
  }, [transitionTo]);

  const onReceiveSuccess = useCallback((note: string) => {
    setReceivedNote(note);
    // Transition to falling animation
    transitionTo('receive-falling', 300);
    // After falling animation completes, show untie
    setTimeout(() => {
      setScene('receive-untie');
      requestAnimationFrame(() => setContentOpacity(1));
    }, 4200);
  }, [transitionTo]);

  const onReceiveEmpty = useCallback(() => {
    transitionTo('receive-empty');
  }, [transitionTo]);

  const onReceiveError = useCallback((msg: string) => {
    setErrorMessage(msg);
    transitionTo('error');
  }, [transitionTo]);

  const onUntie = useCallback(() => {
    transitionTo('receive-open', 900);
  }, [transitionTo]);

  const onOpen = useCallback(() => {
    transitionTo('receive-reading', 500);
  }, [transitionTo]);

  const renderContent = () => {
    switch (scene) {
      case 'landing':
        return (
          <Landing
            onTieNote={startTieNote}
            onReceiveNote={startReceiving}
          />
        );

      case 'tie-writing':
        return (
          <TieNote
            onRoll={startRolling}
            onBack={goHome}
          />
        );

      case 'tie-rolling':
        return (
          <RollAnimation
            content={noteContent}
            onSuccess={onRollSuccess}
            onError={onRollError}
          />
        );

      case 'tie-success':
        return (
          <TieSuccess
            onLeaveAnother={startTieNote}
            onGoBack={goHome}
          />
        );

      case 'receive-loading':
        return (
          <ReceiveFlow
            onReceiveSuccess={onReceiveSuccess}
            onReceiveEmpty={onReceiveEmpty}
            onReceiveError={onReceiveError}
          />
        );

      case 'receive-falling':
        return <ReceiveFlow stage="falling" />;

      case 'receive-untie':
        return <ReceiveFlow stage="untie" onUntie={onUntie} />;

      case 'receive-open':
        return <ReceiveFlow stage="open" onOpen={onOpen} />;

      case 'receive-reading':
        return (
          <NoteDisplay
            content={receivedNote || ''}
            onLeaveOne={startTieNote}
            onGoBack={goHome}
          />
        );

      case 'receive-empty':
        return (
          <EmptyTree
            onTieNote={startTieNote}
            onGoBack={goHome}
          />
        );

      case 'error':
        return (
          <ErrorState
            message={errorMessage}
            onRetry={goHome}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Background Scene - always visible */}
      <Scene
        showNoteDetach={scene === 'receive-falling'}
        highlightNote={scene === 'receive-loading' || scene === 'receive-falling'}
      />

      {/* Content Layer */}
      <div
        className="content-overlay"
        style={{
          opacity: contentOpacity,
          transition: `opacity ${contentOpacity === 0 ? 0.45 : 0.55}s ease-in-out`,
        }}
      >
        {renderContent()}
      </div>

      <CreatorCredit />

      {/* Audio Controller */}
      <AudioController
        enabled={audioEnabled}
        onToggle={() => setAudioEnabled(!audioEnabled)}
      />
    </div>
  );
}
