import type { SVGAttributes } from 'react';

export interface DecorationProps extends SVGAttributes<SVGSVGElement> {
  /** Width and height in px. */
  size?: number;
  /** Main fill color. */
  color?: string;
}

const base = (size: number) =>
  ({ viewBox: '0 0 48 48', width: size, height: size, 'aria-hidden': true, focusable: 'false' }) as const;

/** Autumn leaf ornament. */
export function Leaf({ size = 32, color = '#F08A4B', ...rest }: DecorationProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path
        d="M24,4 Q30,10 29,15 Q36,11 41,14 Q40,21 34,24 Q40,27 41,34 Q33,36 28,32 Q29,38 24,40 Q19,38 20,32 Q15,36 7,34 Q8,27 14,24 Q8,21 7,14 Q12,11 19,15 Q18,10 24,4 Z"
        fill={color}
      />
      <path d="M24,14 L24,45" stroke="rgba(90, 56, 37, 0.45)" strokeWidth={2} strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Five-petal flower ornament. */
export function Flower({ size = 32, color = '#FFFDF8', center = '#F4C04E', ...rest }: DecorationProps & { center?: string }) {
  return (
    <svg {...base(size)} {...rest}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx={24} cy={12.5} rx={8} ry={9.5} fill={color} transform={`rotate(${angle} 24 24)`} />
      ))}
      <circle cx={24} cy={24} r={6} fill={center} />
    </svg>
  );
}
