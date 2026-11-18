import { FaceFeatures } from '../FaceFeatures';
import { createPen } from '../geometry';
import type { CharacterColors, CharacterDefinition, SilhouetteContext } from '../types';

const colors: CharacterColors = {
  base: '#FFF6EA',
  shade: '#E2574C',
  accent: '#FFFFFF',
  cheek: '#F7A59C',
  ink: '#5A3825',
  tint: '#FFF1E0',
};

const cap = ({ w, u }: SilhouetteContext) => ({
  x0: -u * 0.9,
  x1: w + u * 0.9,
  baseY: u * 0.5,
  height: u * 2.7,
  lip: u * 0.5,
});

export const mushroom: CharacterDefinition = {
  name: 'mushroom',
  label: 'Mushroom',
  colors,
  nose: false,
  peekLine: 85,
  Head: ({ mood }) => (
    <g>
      <rect x={24} y={46} width={52} height={48} rx={22} fill={colors.base} />
      <path d="M4,48 Q4,8 50,8 Q96,8 96,48 Q96,58 86,58 L14,58 Q4,58 4,48 Z" fill={colors.shade} />
      <circle cx={30} cy={28} r={7.5} fill={colors.accent} />
      <circle cx={57} cy={21} r={6} fill={colors.accent} />
      <circle cx={77} cy={37} r={7} fill={colors.accent} />
      <circle cx={16} cy={46} r={4.5} fill={colors.accent} />
      <circle cx={50} cy={44} r={4} fill={colors.accent} />
      <FaceFeatures cx={50} cy={72} spread={11} mood={mood} ink={colors.ink} cheek={colors.cheek} />
    </g>
  ),
  silhouette: (ctx, pen) => {
    const c = cap(ctx);
    return {
      shapes: [pen.dome(c.x0, c.x1, c.baseY, c.height, c.lip)],
      overflow: { top: c.height - c.baseY, right: -c.x0, bottom: 0, left: -c.x0 },
      insetTop: c.baseY + c.lip,
    };
  },
  SilhouetteDetails: ({ colors: palette, w, h, r, u }) => {
    const c = cap({ w, h, r, u });
    const top = c.baseY - c.height;
    // Spots sit at fractions of the cap so they follow any panel width.
    const spots: Array<[x: number, y: number, size: number]> = [
      [0.16, 0.62, 0.42],
      [0.34, 0.36, 0.55],
      [0.56, 0.5, 0.4],
      [0.74, 0.3, 0.5],
      [0.88, 0.66, 0.36],
    ];
    return (
      <g>
        <path d={createPen().dome(c.x0, c.x1, c.baseY, c.height, c.lip)} fill={palette.shade} opacity={0.82} />
        {spots.map(([fx, fy, size]) => (
          <circle key={fx} cx={w * fx} cy={top + c.height * fy} r={u * size} fill={palette.accent} opacity={0.92} />
        ))}
      </g>
    );
  },
};
