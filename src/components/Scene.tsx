import { useMemo, useState, useEffect } from 'react';
import WillowTree from './WillowTree';

interface SceneProps {
  showNoteDetach?: boolean;
  highlightNote?: boolean;
}

function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function Scene({ showNoteDetach, highlightNote }: SceneProps) {
  // Parallax state
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice) return;

    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x, y });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isTouchDevice]);

  // Stars - in far parallax layer
  const stars = useMemo(() => {
    const r = createRng(100);
    return Array.from({ length: 110 }, (_, i) => ({
      id: i,
      left: r() * 100,
      top: r() * 65,
      size: 0.7 + r() * 2.2,
      duration: 3 + r() * 6,
      delay: r() * 8,
      minOpacity: 0.1 + r() * 0.25,
      maxOpacity: 0.4 + r() * 0.55,
    }));
  }, []);

  // Clouds - very far parallax
  const clouds = useMemo(() => {
    const r = createRng(200);
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: 6 + r() * 26,
      width: 180 + r() * 250,
      height: 50 + r() * 70,
      speed: 50 + r() * 55,
      delay: r() * 25,
      opacity: 0.5 + r() * 0.3,
    }));
  }, []);

  // Distant tree silhouettes
  const distantTrees = useMemo(() => {
    const r = createRng(300);
    const trees: Array<{ id: number; left: number; height: number; width: number; opacity: number }> = [];
    // Distribute trees with more variety
    for (let i = 0; i < 8; i++) {
      trees.push({
        id: i,
        left: i * 13 + r() * 8,
        height: 12 + r() * 22,
        width: 15 + r() * 35,
        opacity: 0.12 + r() * 0.18,
      });
    }
    return trees;
  }, []);

  // Drifting willow leaves through air (independent of tree)
  const floatingLeaves = useMemo(() => {
    const r = createRng(700);
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: r() * 100,
      startY: r() * 100,
      size: 3 + r() * 4,
      opacity: 0.2 + r() * 0.3,
      duration: 18 + r() * 18,
      delay: r() * 25,
      driftX: -80 + r() * 160,
      driftX2: -120 + r() * 240,
    }));
  }, []);

  // Fireflies
  const fireflies = useMemo(() => {
    const r = createRng(400);
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: 8 + r() * 84,
      top: 22 + r() * 60,
      size: 2 + r() * 2.5,
      floatDuration: 6 + r() * 10,
      glowDuration: 2 + r() * 5,
      delay: r() * 12,
      x1: -25 + r() * 50,
      y1: -30 + r() * 60,
      x2: -20 + r() * 40,
      y2: -35 + r() * 70,
      x3: -25 + r() * 50,
      y3: -20 + r() * 40,
      depth: r(), // 0 = near, 1 = far
    }));
  }, []);

  // Hanging notes - scattered throughout canopy
  const hangingNotes = useMemo(() => {
    const r = createRng(500);
    const notes: Array<{
      id: number;
      left: number;
      top: number;
      size: number;
      swayDuration: number;
      swayDelay: number;
      swayStart: number;
      swayEnd: number;
      rotation: number;
      depth: number;
      hidden: boolean;
    }> = [];

    // Generate notes scattered throughout canopy
    // Canopy roughly: left 15-85%, top 15-55%
    for (let i = 0; i < 50; i++) {
      const depth = r();
      const isHidden = r() > 0.7; // 30% partially hidden behind leaves
      notes.push({
        id: i,
        left: 15 + r() * 70,
        top: 12 + r() * 45,
        size: depth > 0.7 ? 3 + r() * 2 : depth > 0.4 ? 5 + r() * 3 : 7 + r() * 4,
        swayDuration: 2.8 + r() * 4,
        swayDelay: r() * 5,
        swayStart: -2.5 + r() * 5,
        swayEnd: -1.5 + r() * 5,
        rotation: -10 + r() * 20,
        depth,
        hidden: isHidden,
      });
    }

    // Add some notes at extreme edges
    notes.push({
      id: 100, left: 12, top: 25, size: 5,
      swayDuration: 3.5, swayDelay: 1.2, swayStart: -2, swayEnd: 2, rotation: 8, depth: 0.5, hidden: false,
    });
    notes.push({
      id: 101, left: 88, top: 22, size: 6,
      swayDuration: 3, swayDelay: 0.5, swayStart: -1, swayEnd: 1.5, rotation: -6, depth: 0.4, hidden: false,
    });
    notes.push({
      id: 102, left: 18, top: 50, size: 7,
      swayDuration: 4, swayDelay: 2, swayStart: -3, swayEnd: 2, rotation: 12, depth: 0.3, hidden: false,
    });
    notes.push({
      id: 103, left: 82, top: 48, size: 6,
      swayDuration: 3.2, swayDelay: 1.8, swayStart: -1.5, swayEnd: 2.5, rotation: -8, depth: 0.3, hidden: false,
    });
    notes.push({
      id: 104, left: 50, top: 18, size: 4,
      swayDuration: 2.5, swayDelay: 0.8, swayStart: -1, swayEnd: 1, rotation: 5, depth: 0.8, hidden: true,
    });
    notes.push({
      id: 105, left: 35, top: 30, size: 3,
      swayDuration: 2.8, swayDelay: 2.5, swayStart: -0.5, swayEnd: 1, rotation: 3, depth: 0.9, hidden: true,
    });

    return notes;
  }, []);

  // Mist layers
  const mists = useMemo(() => {
    const r = createRng(600);
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      bottom: 8 + i * 6,
      speed: 30 + r() * 25,
      delay: r() * 18,
      opacity: 0.025 + r() * 0.025,
      height: 60 + r() * 50,
    }));
  }, []);

  return (
    <div className="scene-bg" aria-hidden="true">
      {/* ==== LAYER 1: Stars (far background) ==== */}
      <div
        className="parallax-layer parallax-far"
        style={{
          transform: `translate(${parallax.x * -3}px, ${parallax.y * -2}px)`,
        }}
      >
        {stars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--min-opacity': star.minOpacity,
              '--max-opacity': star.maxOpacity,
            } as React.CSSProperties}
            data-star-id={star.id}
          />
        ))}
      </div>

      {/* ==== Moon (far background) ==== */}
      <div
        className="parallax-layer parallax-far"
        style={{
          transform: `translate(${parallax.x * -4}px, ${parallax.y * -3}px)`,
        }}
      >
        <div
          className="moon-halo"
          style={{
            right: 'calc(clamp(8%, 15vw, 18%) - clamp(40px, 6vw, 80px))',
            top: 'calc(clamp(4%, 6vh, 10%) - clamp(40px, 6vw, 80px))',
            width: 'calc(clamp(55px, 9vw, 110px) + clamp(80px, 12vw, 160px))',
            height: 'calc(clamp(55px, 9vw, 110px) + clamp(80px, 12vw, 160px))',
          }}
        />
        <div
          className="moon"
          style={{
            right: 'clamp(8%, 15vw, 18%)',
            top: 'clamp(4%, 6vh, 10%)',
            width: 'clamp(55px, 9vw, 110px)',
            height: 'clamp(55px, 9vw, 110px)',
          }}
        />
      </div>

      {/* ==== LAYER 2: Clouds ==== */}
      <div
        className="parallax-layer parallax-mid-far"
        style={{
          transform: `translate(${parallax.x * -6}px, ${parallax.y * -4}px)`,
        }}
      >
        {clouds.map((cloud) => (
          <div
            key={`cloud-${cloud.id}`}
            className="cloud"
            style={{
              top: `${cloud.top}%`,
              left: '5%',
              width: `${cloud.width}px`,
              height: `${cloud.height}px`,
              opacity: cloud.opacity,
              '--cloud-speed': `${cloud.speed}s`,
              '--cloud-start-x': `-200px`,
              '--cloud-end-x': `200px`,
              animationDelay: `${cloud.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ==== LAYER 3: Distant tree silhouettes ==== */}
      <div
        className="parallax-layer parallax-mid-far"
        style={{
          transform: `translate(${parallax.x * -8}px, ${parallax.y * -5}px)`,
        }}
      >
        {distantTrees.map((tree) => (
          <div
            key={`dt-${tree.id}`}
            style={{
              position: 'absolute',
              bottom: '12%',
              left: `${tree.left}%`,
              width: `${tree.width}vw`,
              height: `${tree.height}vh`,
              background: 'linear-gradient(180deg, rgba(20, 35, 25, 0.4) 0%, rgba(8, 14, 8, 0.6) 70%, transparent 100%)',
              borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
              opacity: tree.opacity,
              filter: 'blur(2px)',
            }}
          />
        ))}
      </div>

      {/* ==== Moonlit canopy glow (behind tree) ==== */}
      <div
        style={{
          position: 'absolute',
          right: '15%',
          top: '8%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(220, 215, 195, 0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 2,
          filter: 'blur(30px)',
          transform: `translate(${parallax.x * -2}px, ${parallax.y * -1.5}px)`,
          transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* ==== LAYER 4: Main Willow Tree ==== */}
      <WillowTree parallaxX={parallax.x} parallaxY={parallax.y} />

      {/* ==== LAYER 5: Floating drifting leaves (foreground) ==== */}
      <div
        className="parallax-layer parallax-near"
        style={{
          transform: `translate(${parallax.x * -18}px, ${parallax.y * -12}px)`,
        }}
      >
        {floatingLeaves.map((leaf) => (
          <div
            key={`float-${leaf.id}`}
            className="drifting-leaf"
            style={{
              left: `${leaf.left}%`,
              top: `${leaf.startY}%`,
              '--leaf-size': `${leaf.size}px`,
              '--leaf-opacity': leaf.opacity,
              '--drift-duration': `${leaf.duration}s`,
              '--drift-delay': `${leaf.delay}s`,
              '--drift-x': `${leaf.driftX}px`,
              '--drift-x2': `${leaf.driftX2}px`,
              zIndex: 7,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ==== LAYER 6: Hanging notes (on top of tree) ==== */}
      <div
        className="parallax-layer parallax-mid-near"
        style={{
          transform: `translate(${parallax.x * -12}px, ${parallax.y * -8}px)`,
        }}
      >
        {hangingNotes.map((note) => {
          const depthClass = note.depth > 0.7 ? 'note-deep' : note.depth > 0.4 ? 'note-shadow' : 'note-bright';
          const detachClass = showNoteDetach && note.id === 15 ? 'note-detach' : '';
          const highlightClass = highlightNote && note.id === 15 ? 'note-highlight' : '';
          return (
            <div
              key={`note-${note.id}`}
              className={`hanging-note ${depthClass} ${detachClass} ${highlightClass}`}
              style={{
                left: `${note.left}%`,
                top: `${note.top}%`,
                '--note-size': `${note.size}px`,
                '--note-sway-duration': `${note.swayDuration}s`,
                '--note-sway-delay': `${note.swayDelay}s`,
                '--note-sway-start': `${note.swayStart}deg`,
                '--note-sway-end': `${note.swayEnd}deg`,
                transform: `rotate(${note.rotation}deg)`,
                opacity: note.hidden ? 0.4 : (note.depth > 0.7 ? 0.55 : 1),
                zIndex: note.depth > 0.5 ? 5 : 6,
                mixBlendMode: note.hidden ? 'multiply' : 'normal',
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* ==== LAYER 7: Fireflies ==== */}
      <div
        className="parallax-layer parallax-near"
        style={{
          transform: `translate(${parallax.x * -15}px, ${parallax.y * -10}px)`,
        }}
      >
        {fireflies.map((ff) => (
          <div
            key={`ff-${ff.id}`}
            className="firefly"
            style={{
              left: `${ff.left}%`,
              top: `${ff.top}%`,
              '--firefly-size': `${ff.size * (ff.depth * 0.5 + 0.5)}px`,
              '--float-duration': `${ff.floatDuration}s`,
              '--glow-duration': `${ff.glowDuration}s`,
              '--firefly-delay': `${ff.delay}s`,
              '--ff-x1': `${ff.x1}px`,
              '--ff-y1': `${ff.y1}px`,
              '--ff-x2': `${ff.x2}px`,
              '--ff-y2': `${ff.y2}px`,
              '--ff-x3': `${ff.x3}px`,
              '--ff-y3': `${ff.y3}px`,
              zIndex: ff.depth > 0.5 ? 5 : 7,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ==== LAYER 7: Ground mist ==== */}
      {mists.map((mist) => (
        <div
          key={`mist-${mist.id}`}
          className="mist"
          style={{
            bottom: `${mist.bottom}%`,
            left: '-50%',
            opacity: mist.opacity,
            height: `${mist.height}px`,
            '--mist-speed': `${mist.speed}s`,
            animationDelay: `${mist.delay}s`,
            zIndex: 5,
          } as React.CSSProperties}
        />
      ))}

      {/* ==== Ground ==== */}
      <div className="ground" />
    </div>
  );
}
