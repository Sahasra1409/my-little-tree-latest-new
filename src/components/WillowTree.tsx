import { useMemo } from 'react';

// Seeded random
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface WillowTreeProps {
  parallaxX?: number;
  parallaxY?: number;
}

// Leaf cluster definition - small cluster of overlapping ellipses
interface LeafClusterDef {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  color: string;
  opacity: number;
  swayDuration: number;
  swayDelay: number;
  swayAmount: number;
  swayX: number;
}

export default function WillowTree({ parallaxX = 0, parallaxY = 0 }: WillowTreeProps) {
  // Generate dense leaf clusters covering the canopy area
  const leafClusters = useMemo(() => {
    const r = createRng(1000);
    const clusters: LeafClusterDef[] = [];

    // Canopy center area - tree spans roughly from y=80 to y=580
    // and x=100 to x=1300
    const canopyCenterY = 320;
    const canopyCenterX = 700;

    // Layer 1: Background dark foliage - large blurry shapes
    for (let i = 0; i < 50; i++) {
      const angle = r() * Math.PI * 2;
      const distance = r() * 380;
      const x = canopyCenterX + Math.cos(angle) * distance * 1.4;
      const y = canopyCenterY + Math.sin(angle) * distance * 0.55;

      if (x < 80 || x > 1320 || y < 80 || y > 600) continue;

      clusters.push({
        cx: x,
        cy: y,
        rx: 80 + r() * 120,
        ry: 70 + r() * 100,
        rotation: r() * 360,
        color: i % 3 === 0 ? '#0e2218' : i % 3 === 1 ? '#0a1a14' : '#0f2620',
        opacity: 0.85 + r() * 0.15,
        swayDuration: 7 + r() * 4,
        swayDelay: r() * 6,
        swayAmount: 0.5 + r() * 1,
        swayX: -3 + r() * 6,
      });
    }

    // Layer 2: Mid foliage - more defined shapes
    for (let i = 0; i < 80; i++) {
      const angle = r() * Math.PI * 2;
      const distance = 100 + r() * 300;
      const x = canopyCenterX + Math.cos(angle) * distance * 1.3;
      const y = canopyCenterY + Math.sin(angle) * distance * 0.55;

      if (x < 100 || x > 1300 || y < 90 || y > 590) continue;

      clusters.push({
        cx: x,
        cy: y,
        rx: 35 + r() * 70,
        ry: 30 + r() * 60,
        rotation: r() * 360,
        color: i % 4 === 0 ? '#143d2a' : i % 4 === 1 ? '#1c4a35' : i % 4 === 2 ? '#0e2218' : '#163e2b',
        opacity: 0.65 + r() * 0.3,
        swayDuration: 5 + r() * 4,
        swayDelay: r() * 5,
        swayAmount: 0.8 + r() * 1.2,
        swayX: -4 + r() * 8,
      });
    }

    // Layer 3: Front foliage - smaller detailed leaves
    for (let i = 0; i < 120; i++) {
      const angle = r() * Math.PI * 2;
      const distance = 50 + r() * 360;
      const x = canopyCenterX + Math.cos(angle) * distance * 1.35;
      const y = canopyCenterY + Math.sin(angle) * distance * 0.55;

      if (x < 90 || x > 1310 || y < 80 || y > 600) continue;

      const colors = ['#2a5a3e', '#1c4a35', '#143d2a', '#3d6b4e', '#0f2620'];
      clusters.push({
        cx: x,
        cy: y,
        rx: 18 + r() * 35,
        ry: 15 + r() * 28,
        rotation: r() * 360,
        color: colors[Math.floor(r() * colors.length)],
        opacity: 0.5 + r() * 0.4,
        swayDuration: 4 + r() * 4,
        swayDelay: r() * 4,
        swayAmount: 1.2 + r() * 1.5,
        swayX: -5 + r() * 10,
      });
    }

    // Layer 4: Moonlit highlights on top edges
    for (let i = 0; i < 40; i++) {
      const angle = r() * Math.PI * 2;
      const distance = 100 + r() * 320;
      const x = canopyCenterX + Math.cos(angle) * distance * 1.3;
      const y = canopyCenterY + Math.sin(angle) * distance * 0.55;

      if (x < 100 || x > 1300 || y < 60 || y > 550) continue;

      clusters.push({
        cx: x,
        cy: y,
        rx: 12 + r() * 25,
        ry: 10 + r() * 20,
        rotation: r() * 360,
        color: i % 2 === 0 ? '#3d6b4e' : '#5a8a68',
        opacity: 0.2 + r() * 0.2,
        swayDuration: 5 + r() * 3,
        swayDelay: r() * 5,
        swayAmount: 1 + r() * 1.5,
        swayX: -3 + r() * 6,
      });
    }

    return clusters;
  }, []);

  // Generate hanging willow tendrils (long leafy vines)
  const hangingTendrils = useMemo(() => {
    const r = createRng(2000);
    const tendrils: Array<{
      d: string;
      swayDuration: number;
      swayDelay: number;
      swayStart: number;
      swayEnd: number;
      strokeWidth: number;
      opacity: number;
      hasLeaves: boolean;
      leafPositions?: Array<{ x: number; y: number; size: number; rot: number }>;
    }> = [];

    // Define anchor points along branches where tendrils hang
    const anchors = [
      // Top crown
      { x: 680, y: 110 }, { x: 700, y: 100 }, { x: 720, y: 110 },
      { x: 660, y: 120 }, { x: 740, y: 120 },
      // Upper canopy left
      { x: 550, y: 145 }, { x: 480, y: 165 }, { x: 410, y: 195 },
      { x: 350, y: 215 }, { x: 300, y: 235 },
      // Upper canopy right
      { x: 850, y: 145 }, { x: 920, y: 165 }, { x: 990, y: 195 },
      { x: 1050, y: 215 }, { x: 1100, y: 235 },
      // Mid canopy left
      { x: 250, y: 295 }, { x: 200, y: 320 }, { x: 170, y: 345 },
      { x: 280, y: 350 }, { x: 240, y: 380 },
      // Mid canopy right
      { x: 1150, y: 295 }, { x: 1200, y: 320 }, { x: 1230, y: 345 },
      { x: 1120, y: 350 }, { x: 1160, y: 380 },
      // Lower canopy left
      { x: 230, y: 420 }, { x: 200, y: 450 }, { x: 250, y: 480 },
      { x: 290, y: 500 }, { x: 330, y: 520 },
      // Lower canopy right
      { x: 1170, y: 420 }, { x: 1200, y: 450 }, { x: 1150, y: 480 },
      { x: 1110, y: 500 }, { x: 1070, y: 520 },
      // Central hanging
      { x: 580, y: 200 }, { x: 620, y: 220 }, { x: 660, y: 240 },
      { x: 740, y: 240 }, { x: 780, y: 220 }, { x: 820, y: 200 },
      { x: 500, y: 280 }, { x: 900, y: 280 },
      { x: 460, y: 350 }, { x: 940, y: 350 },
      { x: 550, y: 380 }, { x: 850, y: 380 },
      { x: 600, y: 420 }, { x: 800, y: 420 },
    ];

    for (const anchor of anchors) {
      const length = 60 + r() * 180;
      const curl = (r() - 0.5) * 30;
      const endX = anchor.x + curl;
      const endY = anchor.y + length;

      // Create gentle curve
      const midX1 = anchor.x + curl * 0.3;
      const midY1 = anchor.y + length * 0.33;
      const midX2 = anchor.x + curl * 0.7;
      const midY2 = anchor.y + length * 0.66;

      const d = `M${anchor.x},${anchor.y} C${midX1},${midY1} ${midX2},${midY2} ${endX},${endY}`;
      const hasLeaves = r() > 0.3;

      let leafPositions: Array<{ x: number; y: number; size: number; rot: number }> | undefined;
      if (hasLeaves) {
        leafPositions = [];
        const leafCount = Math.floor(length / 18);
        for (let j = 0; j < leafCount; j++) {
          const t = (j + 1) / (leafCount + 1);
          const tY = anchor.y + length * t;
          const tX = anchor.x + curl * t;
          leafPositions.push({
            x: tX + (r() - 0.5) * 8,
            y: tY,
            size: 2 + r() * 3,
            rot: r() * 360,
          });
        }
      }

      tendrils.push({
        d,
        swayDuration: 3.5 + r() * 3,
        swayDelay: r() * 4,
        swayStart: -1.5 + r() * 3,
        swayEnd: 1 + r() * 3,
        strokeWidth: 0.6 + r() * 0.8,
        opacity: 0.5 + r() * 0.4,
        hasLeaves,
        leafPositions,
      });
    }

    return tendrils;
  }, []);

  // Branches that show through the foliage
  const visibleBranches = useMemo(() => {
    const r = createRng(3000);
    const branches: Array<{
      d: string;
      strokeWidth: number;
      stroke: string;
      swayDuration: number;
      swayDelay: number;
      swayStart: number;
      swayEnd: number;
    }> = [];

    // Main trunk and major limbs visible at edges
    const mainBranches = [
      // Top
      'M700,100 C698,140 695,180 693,220',
      'M695,110 C685,135 675,160 665,185',
      'M705,110 C715,135 725,160 735,185',
      // Upper major
      'M668,160 C620,170 560,185 500,210',
      'M732,160 C780,170 840,185 900,210',
      // Mid
      'M650,200 C580,225 510,255 430,295',
      'M750,200 C820,225 890,255 970,295',
      // Side branches
      'M300,260 C340,275 390,290 440,310',
      'M1100,260 C1060,275 1010,290 960,310',
      'M250,350 C290,365 340,385 390,410',
      'M1150,350 C1110,365 1060,385 1010,410',
    ];

    mainBranches.forEach((d, i) => {
      branches.push({
        d,
        strokeWidth: 4 + (i % 3) * 1.5,
        stroke: '#1a120a',
        swayDuration: 6 + (i % 4),
        swayDelay: (i * 0.3) % 3,
        swayStart: -0.5,
        swayEnd: 0.8 + (i % 2) * 0.5,
      });
    });

    // Add many smaller secondary branches
    for (let i = 0; i < 35; i++) {
      const startAngle = -Math.PI / 2 + (r() - 0.5) * 0.8;
      const startX = 400 + r() * 600;
      const startY = 150 + r() * 200;
      const length = 40 + r() * 120;
      const endX = startX + Math.cos(startAngle) * length;
      const endY = startY + Math.sin(startAngle) * length + 30;

      branches.push({
        d: `M${startX},${startY} C${startX + (endX - startX) * 0.3},${startY + (endY - startY) * 0.3} ${startX + (endX - startX) * 0.7},${startY + (endY - startY) * 0.7} ${endX},${endY}`,
        strokeWidth: 1.5 + r() * 2,
        stroke: r() > 0.5 ? '#251a0f' : '#1a120a',
        swayDuration: 5 + r() * 3,
        swayDelay: r() * 4,
        swayStart: -1 + r() * 2,
        swayEnd: 1 + r() * 1.5,
      });
    }

    return branches;
  }, []);

  // Drifting individual leaves
  const driftingLeaves = useMemo(() => {
    const r = createRng(4000);
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: r() * 100,
      top: -10 - r() * 20,
      size: 4 + r() * 6,
      opacity: 0.25 + r() * 0.3,
      duration: 15 + r() * 15,
      delay: r() * 20,
      driftX: -100 + r() * 200,
      driftX2: -150 + r() * 300,
      rotation: r() * 360,
    }));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: `translateX(-50%) translateX(${parallaxX * -8}px) translateY(${parallaxY * -5}px)`,
        width: '140%',
        maxWidth: '1800px',
        height: '95%',
        pointerEvents: 'none',
        transition: 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <svg
        className="willow-tree-svg"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          {/* Trunk gradient */}
          <linearGradient id="trunkGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a120a" />
            <stop offset="15%" stopColor="#251a0f" />
            <stop offset="35%" stopColor="#2a1f14" />
            <stop offset="50%" stopColor="#352618" />
            <stop offset="65%" stopColor="#2a1f14" />
            <stop offset="85%" stopColor="#251a0f" />
            <stop offset="100%" stopColor="#1a120a" />
          </linearGradient>

          {/* Bark vertical gradient */}
          <linearGradient id="barkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d2b1f" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0a0604" stopOpacity="0" />
          </linearGradient>

          {/* Radial leaf gradients */}
          <radialGradient id="leafGradientDeep" cx="0.4" cy="0.4">
            <stop offset="0%" stopColor="#1c4a35" />
            <stop offset="60%" stopColor="#0e2218" />
            <stop offset="100%" stopColor="#0a1a14" />
          </radialGradient>

          <radialGradient id="leafGradientMid" cx="0.5" cy="0.4">
            <stop offset="0%" stopColor="#2a5a3e" />
            <stop offset="60%" stopColor="#163e2b" />
            <stop offset="100%" stopColor="#0e2218" />
          </radialGradient>

          <radialGradient id="leafGradientLight" cx="0.5" cy="0.4">
            <stop offset="0%" stopColor="#3d6b4e" />
            <stop offset="60%" stopColor="#1c4a35" />
            <stop offset="100%" stopColor="#143d2a" />
          </radialGradient>

          {/* Moonlight edge filter */}
          <filter id="moonEdge" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>

          {/* Soft glow filter */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          <filter id="bigBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>

          {/* Single leaf shape for individual leaves */}
          <symbol id="leafShape" viewBox="-5 -7 10 14">
            <path
              d="M0,-7 C3,-5 4,-2 3,2 C2,5 0,7 0,7 C0,7 -2,5 -3,2 C-4,-2 -3,-5 0,-7 Z"
              fill="currentColor"
            />
            <line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(0,0,0,0.2)" strokeWidth="0.3" />
          </symbol>
        </defs>

        {/* ==== GROUND SHADOW ==== */}
        <ellipse cx="700" cy="880" rx="500" ry="30" fill="rgba(0,0,0,0.35)" filter="url(#bigBlur)" />

        {/* ==== ROOTS ==== */}
        <g>
          <path d="M635,900 C610,895 580,890 550,895 C525,898 505,902 488,908" stroke="#1a120a" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.85" />
          <path d="M645,900 C625,898 600,902 575,908" stroke="#1a120a" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M660,900 C650,902 630,905 612,912" stroke="#1a120a" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M765,900 C790,895 820,890 850,895 C875,898 895,902 912,908" stroke="#1a120a" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.85" />
          <path d="M755,900 C775,898 800,902 825,908" stroke="#1a120a" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M740,900 C750,902 770,905 788,912" stroke="#1a120a" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* ==== TRUNK ==== */}
        <path
          d="M635,900 
             C630,845 622,790 618,740 
             C614,690 610,640 614,590 
             C618,540 628,490 638,450 
             C648,410 658,370 668,340 
             C678,310 688,280 700,260 
             C712,280 722,310 732,340 
             C742,370 752,410 762,450 
             C772,490 782,540 786,590 
             C790,640 786,690 782,740 
             C778,790 770,845 765,900 Z"
          fill="url(#trunkGradient)"
        />

        {/* Bark texture - vertical cracks */}
        <path d="M655,870 C652,820 648,770 650,720 C652,670 656,620 662,570 C668,520 674,470 678,430" stroke="#0a0604" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M680,890 C678,830 676,770 678,710 C680,650 682,590 686,530 C690,470 695,420 700,380" stroke="#4a3828" strokeWidth="0.6" fill="none" opacity="0.25" />
        <path d="M720,880 C722,825 725,775 723,725 C721,675 718,625 714,575 C710,525 706,475 702,435" stroke="#0a0604" strokeWidth="1.2" fill="none" opacity="0.4" />
        <path d="M745,870 C748,820 752,770 750,720 C748,670 744,620 738,570 C732,520 726,470 722,430" stroke="#0a0604" strokeWidth="0.9" fill="none" opacity="0.35" />

        {/* Bark knots and hollows */}
        <ellipse cx="668" cy="680" rx="10" ry="6" fill="#0a0604" opacity="0.5" />
        <ellipse cx="668" cy="680" rx="6" ry="3" fill="#000" opacity="0.7" />
        <ellipse cx="735" cy="720" rx="7" ry="5" fill="#0a0604" opacity="0.4" />
        <ellipse cx="700" cy="600" rx="5" ry="3" fill="#0a0604" opacity="0.3" />

        {/* Moss highlights on trunk */}
        <ellipse cx="660" cy="500" rx="20" ry="8" fill="#1c4a35" opacity="0.3" filter="url(#moonEdge)" />
        <ellipse cx="740" cy="450" rx="15" ry="6" fill="#2a5a3e" opacity="0.25" filter="url(#moonEdge)" />
        <ellipse cx="690" cy="780" rx="18" ry="6" fill="#1c4a35" opacity="0.25" filter="url(#moonEdge)" />

        {/* ==== VISIBLE BRANCHES (in background of foliage) ==== */}
        <g style={{ filter: 'url(#moonEdge)' }}>
          {visibleBranches.map((branch, i) => (
            <path
              key={`branch-${i}`}
              className="branch-path"
              d={branch.d}
              stroke={branch.stroke}
              strokeWidth={branch.strokeWidth}
              style={{
                '--sway-duration': `${branch.swayDuration}s`,
                '--sway-delay': `${branch.swayDelay}s`,
                '--sway-start': `${branch.swayStart}deg`,
                '--sway-end': `${branch.swayEnd}deg`,
              } as React.CSSProperties}
            />
          ))}
        </g>

        {/* ==== LEAF CLUSTERS - Background Layer ==== */}
        <g style={{ filter: 'url(#bigBlur)' }}>
          {leafClusters.filter((_, i) => i < 50).map((cluster, i) => (
            <ellipse
              key={`leaf-bg-${i}`}
              className="leaf-cluster"
              cx={cluster.cx}
              cy={cluster.cy}
              rx={cluster.rx}
              ry={cluster.ry}
              fill={cluster.color}
              opacity={cluster.opacity * 0.7}
              transform={`rotate(${cluster.rotation} ${cluster.cx} ${cluster.cy})`}
              style={{
                '--origin-x': `${cluster.cx}px`,
                '--origin-y': `${cluster.cy}px`,
                '--sway-duration': `${cluster.swayDuration * 1.3}s`,
                '--sway-delay': `${cluster.swayDelay}s`,
                '--sway-amount': `${cluster.swayAmount * 0.5}deg`,
                '--sway-x': `${cluster.swayX * 0.5}px`,
              } as React.CSSProperties}
            />
          ))}
        </g>

        {/* ==== LEAF CLUSTERS - Mid Layer ==== */}
        <g>
          {leafClusters.filter((_, i) => i >= 50 && i < 130).map((cluster, i) => (
            <ellipse
              key={`leaf-mid-${i}`}
              className="leaf-cluster"
              cx={cluster.cx}
              cy={cluster.cy}
              rx={cluster.rx}
              ry={cluster.ry}
              fill={`url(#${cluster.color.includes('3d') || cluster.color.includes('5a') ? 'leafGradientMid' : 'leafGradientDeep'})`}
              opacity={cluster.opacity}
              transform={`rotate(${cluster.rotation} ${cluster.cx} ${cluster.cy})`}
              style={{
                '--origin-x': `${cluster.cx}px`,
                '--origin-y': `${cluster.cy}px`,
                '--sway-duration': `${cluster.swayDuration}s`,
                '--sway-delay': `${cluster.swayDelay}s`,
                '--sway-amount': `${cluster.swayAmount}deg`,
                '--sway-x': `${cluster.swayX}px`,
              } as React.CSSProperties}
            />
          ))}
        </g>

        {/* ==== LEAF CLUSTERS - Front Layer (with leaves) ==== */}
        <g>
          {leafClusters.filter((_, i) => i >= 130).map((cluster, i) => (
            <g
              key={`leaf-fg-${i}`}
              className="leaf-cluster"
              style={{
                '--origin-x': `${cluster.cx}px`,
                '--origin-y': `${cluster.cy}px`,
                '--sway-duration': `${cluster.swayDuration * 0.9}s`,
                '--sway-delay': `${cluster.swayDelay}s`,
                '--sway-amount': `${cluster.swayAmount * 1.2}deg`,
                '--sway-x': `${cluster.swayX * 1.3}px`,
                transformOrigin: `${cluster.cx}px ${cluster.cy}px`,
              } as React.CSSProperties}
            >
              <ellipse
                cx={cluster.cx}
                cy={cluster.cy}
                rx={cluster.rx}
                ry={cluster.ry}
                fill={cluster.color}
                opacity={cluster.opacity}
                transform={`rotate(${cluster.rotation} ${cluster.cx} ${cluster.cy})`}
              />
            </g>
          ))}
        </g>

        {/* ==== MOONLIT EDGE HIGHLIGHTS ==== */}
        <g>
          {leafClusters.filter((_, i) => i >= 170).map((cluster, i) => (
            <ellipse
              key={`moon-${i}`}
              cx={cluster.cx + 2}
              cy={cluster.cy - 3}
              rx={cluster.rx * 0.5}
              ry={cluster.ry * 0.4}
              fill="rgba(180, 200, 170, 0.06)"
              opacity={cluster.opacity * 0.6}
              filter="url(#softGlow)"
            />
          ))}
        </g>

        {/* ==== HANGING WILLOW TENDRILS (long vines with leaves) ==== */}
        <g>
          {hangingTendrils.map((tendril, i) => (
            <g
              key={`tendril-${i}`}
              className="hanging-tendril"
              style={{
                '--sway-duration': `${tendril.swayDuration}s`,
                '--sway-delay': `${tendril.swayDelay}s`,
                '--sway-start': `${tendril.swayStart}deg`,
                '--sway-end': `${tendril.swayEnd}deg`,
                transformOrigin: '0% 0%',
              } as React.CSSProperties}
            >
              <path
                d={tendril.d}
                stroke="#1a120a"
                strokeWidth={tendril.strokeWidth}
                opacity={tendril.opacity * 0.8}
                fill="none"
              />
              {tendril.hasLeaves && tendril.leafPositions?.map((leaf, j) => (
                <ellipse
                  key={`tl-${i}-${j}`}
                  cx={leaf.x}
                  cy={leaf.y}
                  rx={leaf.size}
                  ry={leaf.size * 1.6}
                  fill={j % 3 === 0 ? '#2a5a3e' : j % 3 === 1 ? '#1c4a35' : '#143d2a'}
                  opacity={0.7}
                  transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
                />
              ))}
            </g>
          ))}
        </g>

        {/* ==== INDIVIDUAL LEAF DETAILS ON TENDRILS ==== */}
        <g opacity="0.8">
          {/* Add tiny leaf shapes scattered */}
          {Array.from({ length: 80 }).map((_, i) => {
            const r = createRng(5000 + i);
            const cx = 200 + r() * 1000;
            const cy = 200 + r() * 350;
            return (
              <ellipse
                key={`detail-leaf-${i}`}
                cx={cx}
                cy={cy}
                rx="2.5"
                ry="4"
                fill={r() > 0.5 ? '#2a5a3e' : '#1c4a35'}
                opacity={0.5 + r() * 0.3}
                transform={`rotate(${r() * 360} ${cx} ${cy})`}
              />
            );
          })}
        </g>

        {/* ==== INDIVIDUAL SHARP LEAF SHAPES IN FOREGROUND ==== */}
        <g>
          {Array.from({ length: 60 }).map((_, i) => {
            const r = createRng(6000 + i);
            const cx = 180 + r() * 1040;
            const cy = 180 + r() * 380;
            const colors = ['#3d6b4e', '#2a5a3e', '#5a8a68', '#1c4a35'];
            return (
              <g
                key={`sharp-leaf-${i}`}
                className="leaf-cluster"
                style={{
                  '--origin-x': `${cx}px`,
                  '--origin-y': `${cy}px`,
                  '--sway-duration': `${4 + r() * 3}s`,
                  '--sway-delay': `${r() * 3}s`,
                  '--sway-amount': `${2 + r() * 2}deg`,
                  '--sway-x': `${-4 + r() * 8}px`,
                  transformOrigin: `${cx}px ${cy}px`,
                } as React.CSSProperties}
              >
                <path
                  d={`M${cx},${cy - 5} Q${cx + 2},${cy} ${cx},${cy + 5} Q${cx - 2},${cy} ${cx},${cy - 5} Z`}
                  fill={colors[Math.floor(r() * colors.length)]}
                  opacity={0.7}
                />
                <line
                  x1={cx}
                  y1={cy - 5}
                  x2={cx}
                  y2={cy + 5}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="0.3"
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* ==== DRIFTING LEAVES (outside SVG for animation freedom) ==== */}
      {driftingLeaves.map((leaf) => (
        <div
          key={`drift-${leaf.id}`}
          className="drifting-leaf"
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            '--leaf-size': `${leaf.size}px`,
            '--leaf-opacity': leaf.opacity,
            '--drift-duration': `${leaf.duration}s`,
            '--drift-delay': `${leaf.delay}s`,
            '--drift-x': `${leaf.driftX}px`,
            '--drift-x2': `${leaf.driftX2}px`,
            transform: `rotate(${leaf.rotation}deg)`,
            zIndex: 6,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
