import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Controlled/uncontrolled state, like MUI's `useControlled`. */
export function useControlled<T>(controlled: T | undefined, defaultValue: T): [T, (value: T) => void] {
  const isControlled = useRef(controlled !== undefined).current;
  const [state, setState] = useState(defaultValue);
  const setValue = useCallback(
    (value: T) => {
      if (!isControlled) setState(value);
    },
    [isControlled],
  );
  return [isControlled ? (controlled as T) : state, setValue];
}

export interface ElementSize {
  width: number;
  height: number;
}

/** Tracks the border-box size of an element. Returns `null` until it has been measured. */
export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>, enabled = true): ElementSize | null {
  const [size, setSize] = useState<ElementSize | null>(null);
  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;
    const measure = () => {
      const { offsetWidth: width, offsetHeight: height } = node;
      setSize((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, enabled]);
  return enabled ? size : null;
}

/** Calls `handler` when Escape is pressed while `active`. */
export function useEscapeKey(handler: (event: KeyboardEvent) => void, active = true) {
  const saved = useRef(handler);
  saved.current = handler;
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') saved.current(event);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active]);
}

/** Calls `handler` on pointer down outside every given element while `active`. */
export function useClickOutside(
  refs: Array<RefObject<HTMLElement | null>>,
  handler: (event: PointerEvent) => void,
  active = true,
) {
  const saved = useRef({ refs, handler });
  saved.current = { refs, handler };
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (saved.current.refs.every((ref) => !ref.current?.contains(target))) saved.current.handler(event);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [active]);
}

/** Prevents the document from scrolling while `active`. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [active]);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Keeps keyboard focus inside `ref` while `active`, and restores it to the previous element afterwards. */
export function useFocusTrap<T extends HTMLElement>(ref: RefObject<T | null>, active: boolean) {
  useEffect(() => {
    const node = ref.current;
    if (!active || !node) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!node.contains(document.activeElement)) (focusables()[0] ?? node).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [ref, active]);
}
