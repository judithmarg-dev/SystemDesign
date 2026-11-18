export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype;

/** Recursively merges `source` into a copy of `target`. Arrays and functions are replaced, not merged. */
export function deepMerge<T>(target: T, source: DeepPartial<T> | undefined): T {
  if (!isPlainObject(target) || !isPlainObject(source)) return (source ?? target) as T;
  const result: Record<string, unknown> = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    result[key] = isPlainObject(value) && isPlainObject(result[key]) ? deepMerge(result[key], value) : value;
  }
  return result as T;
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
