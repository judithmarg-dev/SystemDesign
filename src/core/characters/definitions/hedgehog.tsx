import { FaceFeatures } from '../FaceFeatures';
import type { CharacterColors, CharacterDefinition, SilhouetteContext } from '../types';

const colors: CharacterColors = {
  base: '#FBE6CC',
  shade: '#9A6A47',
  accent: '#F3D2AE',
  cheek: '#F7A59C',
  ink: '#5A3825',
  tint: '#F6DDBE',
};

/** Rounded spikes: a row along the top edge and two down each side. */
const spikes = ({ w, h, r, u }: SilhouetteContext) => {
  const radius = u * 0.75;
  const start = Math.max(r * 0.7, radius);
  const count = Math.max(3, Math.round((w - start * 2) / (u * 1.25)) + 1);
  const step = (w - start * 2) / (count - 1);
  const circles = Array.from({ length: count }, (_, i) => ({ x: start + step * i, y: u * 0.1 }));
  for (let i = 0; i < 2; i += 1) {
    const y = r * 0.9 + i * u * 1.3;
    if (y < h - r) circles.push({ x: u * 0.1, y }, { x: w - u * 0.1, y });
  }
  return { circles, radius };
};

export const hedgehog: CharacterDefinition = {
  name: 'hedgehog',
  label: 'Hedgehog',
  colors,
  nose: true,
  peekLine: 74,
  Head: ({ mood }) => (
    <g>
      {[
        [10, 56], [14, 40], [24, 27], [37, 19], [50, 16], [63, 19], [76, 27], [86, 40], [90, 56],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={9} fill={colors.shade} />
      ))}
      <ellipse cx={50} cy={57} rx={42} ry={36} fill={colors.shade} />
      <circle cx={24} cy={44} r={7} fill={colors.accent} />
      <circle cx={76} cy={44} r={7} fill={colors.accent} />
      <ellipse cx={50} cy={63} rx={34} ry={28} fill={colors.base} />
      <FaceFeatures cx={50} cy={60} spread={15} mood={mood} ink={colors.ink} cheek={colors.cheek} nose />
    </g>
  ),
  silhouette: (ctx, pen) => {
    const { circles, radius } = spikes(ctx);
    const reach = radius - ctx.u * 0.1;
    return {
      shapes: circles.map(({ x, y }) => pen.circle(x, y, radius)),
      overflow: { top: reach, right: reach, bottom: 0, left: reach },
      insetTop: 0,
    };
  },
  SilhouetteDetails: ({ colors: c, outsideClip, ...ctx }) => {
    const { circles, radius } = spikes(ctx);
    return (
      <g clipPath={outsideClip} fill={c.shade} opacity={0.72}>
        {circles.map(({ x, y }) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={radius} />
        ))}
      </g>
    );
  },
};
