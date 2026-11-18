import { FaceFeatures } from '../FaceFeatures';
import { createPen } from '../geometry';
import type { PathCommand, Pen } from '../geometry';
import type { CharacterColors, CharacterDefinition, SilhouetteContext } from '../types';

const colors: CharacterColors = {
  base: '#E8594B',
  shade: '#8A5A3C',
  accent: '#8DBB6B',
  cheek: '#FFB7AC',
  ink: '#5A2A20',
  tint: '#EE7466',
};

const parts = ({ w, u }: SilhouetteContext) => {
  const cx = w / 2;
  const lobe = { rx: Math.min(w * 0.24, u * 4.2), ry: u * 0.6 };
  // Clockwise: left tip, over the top to the right tip, back along the underside.
  const leaf: PathCommand[] = [
    ['M', cx + u * 0.15, -u * 0.75],
    ['Q', cx + u * 0.9, -u * 2.1, cx + u * 2.4, -u * 1.45],
    ['Q', cx + u * 1.5, -u * 0.1, cx + u * 0.15, -u * 0.75],
    ['Z'],
  ];
  return {
    lobes: [w * 0.27, w * 0.73].map((x) => ({ x, y: u * 0.05, ...lobe })),
    stem: { x: cx - u * 0.2, y: -u * 1.4, w: u * 0.4, h: u * 1.7, r: u * 0.2 },
    leaf,
  };
};

const stemPath = (pen: Pen, stem: ReturnType<typeof parts>['stem']) => pen.rect(stem.x, stem.y, stem.w, stem.h, stem.r);

export const apple: CharacterDefinition = {
  name: 'apple',
  label: 'Apple',
  colors,
  nose: false,
  peekLine: 76,
  Head: ({ mood }) => (
    <g>
      <path d="M50,31 Q51,19 55,10" fill="none" stroke={colors.shade} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M55,17 Q66,3 80,11 Q70,26 55,17 Z" fill={colors.accent} />
      <path
        d="M50,31 Q31,18 16,34 Q2,54 15,78 Q27,97 50,90 Q73,97 85,78 Q98,54 84,34 Q69,18 50,31 Z"
        fill={colors.base}
      />
      <ellipse cx={27} cy={45} rx={4.5} ry={8} fill="#fff" opacity={0.35} transform="rotate(24 27 45)" />
      <FaceFeatures cx={50} cy={62} spread={15} mood={mood} ink={colors.ink} cheek={colors.cheek} />
    </g>
  ),
  silhouette: (ctx, pen) => {
    const { lobes, stem, leaf } = parts(ctx);
    return {
      shapes: [...lobes.map((l) => pen.ellipse(l.x, l.y, l.rx, l.ry)), stemPath(pen, stem), pen.path(leaf)],
      overflow: { top: ctx.u * 1.8, right: 0, bottom: 0, left: 0 },
      insetTop: 0,
    };
  },
  SilhouetteDetails: ({ colors: c, outsideClip, w, h, r, u }) => {
    const { stem, leaf } = parts({ w, h, r, u });
    const pen = createPen();
    return (
      <g>
        <g clipPath={outsideClip}>
          <path d={stemPath(pen, stem)} fill={c.shade} opacity={0.9} />
          <path d={pen.path(leaf)} fill={c.accent} opacity={0.92} />
        </g>
        <ellipse
          cx={r * 0.9}
          cy={r * 0.9}
          rx={u * 0.3}
          ry={u * 0.7}
          fill="#fff"
          opacity={0.4}
          transform={`rotate(32 ${r * 0.9} ${r * 0.9})`}
        />
      </g>
    );
  },
};
