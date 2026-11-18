import { FaceFeatures } from '../FaceFeatures';
import { createPen } from '../geometry';
import type { CharacterColors, CharacterDefinition, SilhouetteContext } from '../types';

const colors: CharacterColors = {
  base: '#F0B77A',
  shade: '#9A6238',
  accent: '#7B4A28',
  cheek: '#F59E94',
  ink: '#5A3825',
  tint: '#F0B77A',
};

const parts = ({ w, u }: SilhouetteContext) => {
  const cap = { x0: -u * 0.45, x1: w + u * 0.45, baseY: u * 0.45, height: u * 2.1, lip: u * 0.45 };
  const top = cap.baseY - cap.height;
  return { cap, stem: { x: w / 2 - u * 0.22, y: top - u * 0.8, w: u * 0.44, h: u * 1.1, r: u * 0.22 } };
};

export const acorn: CharacterDefinition = {
  name: 'acorn',
  label: 'Acorn',
  colors,
  nose: false,
  peekLine: 79,
  Head: ({ mood }) => (
    <g>
      <rect x={46.5} y={3} width={7} height={15} rx={3.5} fill={colors.accent} />
      <path d="M17,46 L83,46 Q88,80 50,95 Q12,80 17,46 Z" fill={colors.base} />
      <path d="M9,42 Q9,13 50,13 Q91,13 91,42 Q91,51 82,51 L18,51 Q9,51 9,42 Z" fill={colors.shade} />
      <g stroke={colors.accent} strokeWidth={2.4} strokeLinecap="round">
        <path d="M45,23 L43,39 M56,23 L54,39 M38,28 L61,28 M37,35 L60,35" fill="none" />
      </g>
      <FaceFeatures cx={50} cy={66} spread={12} mood={mood} ink={colors.ink} cheek={colors.cheek} />
    </g>
  ),
  silhouette: (ctx, pen) => {
    const { cap, stem } = parts(ctx);
    return {
      shapes: [pen.dome(cap.x0, cap.x1, cap.baseY, cap.height, cap.lip), pen.rect(stem.x, stem.y, stem.w, stem.h, stem.r)],
      overflow: { top: -stem.y, right: -cap.x0, bottom: 0, left: -cap.x0 },
      insetTop: cap.baseY + cap.lip,
    };
  },
  SilhouetteDetails: ({ colors: c, w, h, r, u }) => {
    const { cap, stem } = parts({ w, h, r, u });
    const pen = createPen();
    const cy = cap.baseY - cap.height * 0.5;
    const s = u * 0.5;
    return (
      <g>
        <path d={pen.rect(stem.x, stem.y, stem.w, stem.h, stem.r)} fill={c.accent} opacity={0.9} />
        <path d={pen.dome(cap.x0, cap.x1, cap.baseY, cap.height, cap.lip)} fill={c.shade} opacity={0.8} />
        <path
          d={`M${w / 2 - s * 0.5},${cy - s} L${w / 2 - s * 0.7},${cy + s} M${w / 2 + s * 0.7},${cy - s} L${w / 2 + s * 0.5},${cy + s} M${w / 2 - s * 1.3},${cy - s * 0.4} L${w / 2 + s * 1.3},${cy - s * 0.4} M${w / 2 - s * 1.4},${cy + s * 0.45} L${w / 2 + s * 1.2},${cy + s * 0.45}`}
          fill="none"
          stroke={c.accent}
          strokeWidth={Math.max(2, u * 0.13)}
          strokeLinecap="round"
        />
      </g>
    );
  },
};
