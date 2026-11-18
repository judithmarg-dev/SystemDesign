import { FaceFeatures } from '../FaceFeatures';
import type { CharacterColors, CharacterDefinition, SilhouetteContext } from '../types';

const colors: CharacterColors = {
  base: '#DDA066',
  shade: '#B97A45',
  accent: '#FFF3E2',
  cheek: '#F59E94',
  ink: '#5A3825',
  tint: '#DDA066',
};

const features = ({ w, h, r, u }: SilhouetteContext) => {
  const earX = Math.max(r * 0.8, u * 0.9);
  // The tail hugs the lower right side and curls upward.
  const tailY = Math.max(h - u * 2.4, h * 0.55);
  return {
    ear: { left: earX, right: w - earX, y: -u * 0.1, rx: u * 0.8, ry: u * 1.45 },
    tail: { x: w + u * 0.8, y: tailY, radius: u * 1.6 },
    curl: { x: w + u * 1.75, y: tailY - u * 1.9, radius: u * 1.1 },
  };
};

export const squirrel: CharacterDefinition = {
  name: 'squirrel',
  label: 'Squirrel',
  colors,
  nose: true,
  peekLine: 71,
  Head: ({ mood }) => (
    <g>
      <path d="M12,40 Q10,8 26,9 Q40,12 42,32 Z" fill={colors.base} />
      <path d="M88,40 Q90,8 74,9 Q60,12 58,32 Z" fill={colors.base} />
      <path d="M18,34 Q17,16 26,16 Q34,18 35,30 Z" fill={colors.cheek} opacity={0.7} />
      <path d="M82,34 Q83,16 74,16 Q66,18 65,30 Z" fill={colors.cheek} opacity={0.7} />
      <ellipse cx={50} cy={59} rx={43} ry={34} fill={colors.base} />
      <path d="M44,26 Q50,40 56,26 Q50,23 44,26 Z" fill={colors.shade} opacity={0.7} />
      <ellipse cx={50} cy={72} rx={27} ry={18} fill={colors.accent} />
      <FaceFeatures cx={50} cy={57} spread={18} mood={mood} ink={colors.ink} cheek={colors.cheek} nose />
    </g>
  ),
  silhouette: (ctx, pen) => {
    const { ear, tail, curl } = features(ctx);
    return {
      shapes: [
        pen.ellipse(ear.left, ear.y, ear.rx, ear.ry),
        pen.ellipse(ear.right, ear.y, ear.rx, ear.ry),
        pen.circle(tail.x, tail.y, tail.radius),
        pen.circle(curl.x, curl.y, curl.radius),
      ],
      overflow: { top: ear.ry - ear.y, right: curl.x + curl.radius - ctx.w, bottom: 0, left: 0 },
      insetTop: 0,
    };
  },
  SilhouetteDetails: ({ colors: c, outsideClip, ...ctx }) => {
    const { ear, tail, curl } = features(ctx);
    return (
      <g clipPath={outsideClip}>
        <ellipse cx={ear.left} cy={ear.y} rx={ear.rx * 0.5} ry={ear.ry * 0.62} fill={c.cheek} opacity={0.75} />
        <ellipse cx={ear.right} cy={ear.y} rx={ear.rx * 0.5} ry={ear.ry * 0.62} fill={c.cheek} opacity={0.75} />
        <path
          d={`M${tail.x - tail.radius * 0.1},${tail.y + tail.radius * 0.5} Q${tail.x + tail.radius * 0.75},${tail.y} ${curl.x},${curl.y}`}
          fill="none"
          stroke={c.accent}
          strokeWidth={ctx.u * 0.55}
          strokeLinecap="round"
          opacity={0.8}
        />
      </g>
    );
  },
};
