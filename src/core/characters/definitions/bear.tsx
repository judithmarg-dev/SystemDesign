import { FaceFeatures } from '../FaceFeatures';
import type { CharacterColors, CharacterDefinition, SilhouetteContext } from '../types';

const colors: CharacterColors = {
  base: '#F6C795',
  shade: '#E3A46C',
  accent: '#FCE6CB',
  cheek: '#F7A59C',
  ink: '#5A3825',
  tint: '#F6C795',
};

const ears = ({ w, r, u }: SilhouetteContext) => {
  const x = Math.max(r * 0.8, u * 1.1);
  return { left: x, right: w - x, y: -u * 0.3, radius: u * 1.2 };
};

export const bear: CharacterDefinition = {
  name: 'bear',
  label: 'Bear',
  colors,
  nose: true,
  peekLine: 71,
  Head: ({ mood }) => (
    <g>
      <circle cx={23} cy={27} r={15} fill={colors.base} />
      <circle cx={77} cy={27} r={15} fill={colors.base} />
      <circle cx={23} cy={27} r={8} fill={colors.accent} />
      <circle cx={77} cy={27} r={8} fill={colors.accent} />
      <ellipse cx={50} cy={58} rx={44} ry={36} fill={colors.base} />
      <ellipse cx={50} cy={65} rx={13} ry={9.5} fill={colors.accent} />
      <FaceFeatures cx={50} cy={57} spread={18} mood={mood} ink={colors.ink} cheek={colors.cheek} nose />
    </g>
  ),
  silhouette: (ctx, pen) => {
    const e = ears(ctx);
    return {
      shapes: [pen.circle(e.left, e.y, e.radius), pen.circle(e.right, e.y, e.radius)],
      overflow: { top: e.radius - e.y, right: 0, bottom: 0, left: 0 },
      insetTop: 0,
    };
  },
  SilhouetteDetails: ({ colors: c, outsideClip, ...ctx }) => {
    const e = ears(ctx);
    return (
      <g clipPath={outsideClip}>
        <circle cx={e.left} cy={e.y} r={e.radius * 0.55} fill={c.accent} opacity={0.9} />
        <circle cx={e.right} cy={e.y} r={e.radius * 0.55} fill={c.accent} opacity={0.9} />
      </g>
    );
  },
};
