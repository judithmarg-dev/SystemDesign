import type { CharacterMood } from './types';

export interface FaceFeaturesProps {
  /** Center between the eyes. */
  cx: number;
  cy: number;
  /** Horizontal distance from the center to each eye. */
  spread: number;
  mood: CharacterMood;
  ink: string;
  cheek: string;
  /** Draws a little nose above the mouth. */
  nose?: boolean;
}

/** Class put on the eyes so wrappers can animate a blink. */
export const EYE_CLASS = 'mochi-eye';

function Eye({ x, y, mood, ink }: { x: number; y: number; mood: CharacterMood; ink: string }) {
  const stroke = { fill: 'none', stroke: ink, strokeWidth: 2.2, strokeLinecap: 'round' as const };
  switch (mood) {
    case 'happy':
      return <path className={EYE_CLASS} d={`M${x - 3.6},${y + 1.4} Q${x},${y - 4} ${x + 3.6},${y + 1.4}`} {...stroke} />;
    case 'sleepy':
      return <path className={EYE_CLASS} d={`M${x - 3.6},${y - 0.6} Q${x},${y + 3} ${x + 3.6},${y - 0.6}`} {...stroke} />;
    case 'surprised':
      return (
        <g className={EYE_CLASS}>
          <circle cx={x} cy={y} r={3.8} fill={ink} />
          <circle cx={x + 1.2} cy={y - 1.3} r={1.2} fill="#fff" />
        </g>
      );
    default:
      return <ellipse className={EYE_CLASS} cx={x} cy={y} rx={2.7} ry={3.3} fill={ink} />;
  }
}

/** The shared kawaii face: two eyes, blushing cheeks and a tiny mouth. */
export function FaceFeatures({ cx, cy, spread, mood, ink, cheek, nose = false }: FaceFeaturesProps) {
  const mouthY = cy + (nose ? 7.5 : 5);
  return (
    <g>
      <ellipse cx={cx - spread - 8} cy={cy + 7} rx={5.6} ry={3.6} fill={cheek} opacity={0.8} />
      <ellipse cx={cx + spread + 8} cy={cy + 7} rx={5.6} ry={3.6} fill={cheek} opacity={0.8} />
      <Eye x={cx - spread} y={cy} mood={mood} ink={ink} />
      <Eye x={cx + spread} y={cy} mood={mood} ink={ink} />
      {nose && <ellipse cx={cx} cy={cy + 4.2} rx={3.4} ry={2.4} fill={ink} />}
      {mood === 'surprised' ? (
        <ellipse cx={cx} cy={mouthY + 2} rx={2} ry={2.6} fill={ink} />
      ) : (
        <path
          d={`M${cx - 4.2},${mouthY} Q${cx - 2.1},${mouthY + 3.4} ${cx},${mouthY} Q${cx + 2.1},${mouthY + 3.4} ${cx + 4.2},${mouthY}`}
          fill="none"
          stroke={ink}
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}
