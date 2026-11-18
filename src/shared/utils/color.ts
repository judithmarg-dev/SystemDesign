const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function parseHex(color: string): [number, number, number] | null {
  if (!HEX.test(color)) return null;
  let hex = color.slice(1);
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
  const value = parseInt(hex, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** Returns `color` with the given opacity (0–1). Hex is converted to rgba; anything else uses color-mix. */
export function alpha(color: string, opacity: number): string {
  const rgb = parseHex(color);
  if (rgb) return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
  return `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`;
}

/** Mixes `weight` (0–1) of `b` into `a`. */
export function mix(a: string, b: string, weight: number): string {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (ca && cb) {
    const channel = (i: number) => Math.round(ca[i]! + (cb[i]! - ca[i]!) * weight);
    return `#${[0, 1, 2].map((i) => channel(i).toString(16).padStart(2, '0')).join('')}`;
  }
  return `color-mix(in srgb, ${a}, ${b} ${Math.round(weight * 100)}%)`;
}

export const lighten = (color: string, amount: number) => mix(color, '#ffffff', amount);
export const darken = (color: string, amount: number) => mix(color, '#000000', amount);
