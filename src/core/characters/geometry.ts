/** A path command whose arguments are all x,y coordinate pairs (M, L, Q, C) or empty (Z). */
export type PathCommand = [command: 'M' | 'L' | 'Q' | 'C' | 'Z', ...coords: number[]];

/**
 * Builds SVG subpaths, optionally translated by an offset. Every shape winds clockwise,
 * so several of them in one path fill as a union under the non-zero rule.
 */
export interface Pen {
  rect: (x: number, y: number, w: number, h: number, r: number) => string;
  circle: (cx: number, cy: number, r: number) => string;
  ellipse: (cx: number, cy: number, rx: number, ry: number) => string;
  /** Half-ellipse cap from `x0` to `x1` rising `height` above `baseY`, with a rounded lip below. */
  dome: (x0: number, x1: number, baseY: number, height: number, lip: number) => string;
  /** Free-form subpath; the caller is responsible for winding it clockwise. */
  path: (commands: PathCommand[]) => string;
}

const round = (value: number) => +value.toFixed(2);

export function createPen(offsetX = 0, offsetY = 0): Pen {
  const X = (x: number) => round(x + offsetX);
  const Y = (y: number) => round(y + offsetY);

  const ellipse: Pen['ellipse'] = (cx, cy, rx, ry) =>
    `M${X(cx - rx)},${Y(cy)} A${round(rx)},${round(ry)} 0 1 1 ${X(cx + rx)},${Y(cy)} A${round(rx)},${round(ry)} 0 1 1 ${X(cx - rx)},${Y(cy)} Z`;

  return {
    ellipse,
    circle: (cx, cy, r) => ellipse(cx, cy, r, r),
    rect: (x, y, w, h, r) => {
      const c = round(Math.max(0, Math.min(r, w / 2, h / 2)));
      const arc = `A${c},${c} 0 0 1`;
      return [
        `M${X(x + c)},${Y(y)}`,
        `L${X(x + w - c)},${Y(y)} ${arc} ${X(x + w)},${Y(y + c)}`,
        `L${X(x + w)},${Y(y + h - c)} ${arc} ${X(x + w - c)},${Y(y + h)}`,
        `L${X(x + c)},${Y(y + h)} ${arc} ${X(x)},${Y(y + h - c)}`,
        `L${X(x)},${Y(y + c)} ${arc} ${X(x + c)},${Y(y)} Z`,
      ].join(' ');
    },
    dome: (x0, x1, baseY, height, lip) =>
      [
        `M${X(x0)},${Y(baseY)}`,
        `A${round((x1 - x0) / 2)},${round(height)} 0 0 1 ${X(x1)},${Y(baseY)}`,
        `Q${X(x1)},${Y(baseY + lip)} ${X(x1 - lip)},${Y(baseY + lip)}`,
        `L${X(x0 + lip)},${Y(baseY + lip)}`,
        `Q${X(x0)},${Y(baseY + lip)} ${X(x0)},${Y(baseY)} Z`,
      ].join(' '),
    path: (commands) =>
      commands
        .map(([command, ...coords]) => command + coords.map((v, i) => (i % 2 === 0 ? X(v) : Y(v))).join(','))
        .join(' '),
  };
}
