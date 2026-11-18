import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { applySx, glass, reducedMotion } from '@core';
import type { SxProp } from '@core';
import { Portal, useControlled, useEscapeKey, useIsomorphicLayoutEffect } from '@shared';

export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

export interface TooltipProps extends SxProp {
  /** Text shown in the tooltip. Nothing is shown when empty. */
  title: ReactNode;
  /** A single element that can receive focus, e.g. a `Button` or `IconButton`. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  /** Preferred side. It flips to the opposite side when there is no room. */
  placement?: TooltipPlacement;
  /** Milliseconds before showing on hover. Focus shows it immediately. */
  enterDelay?: number;
  /** Milliseconds before hiding after the pointer leaves. */
  leaveDelay?: number;
  /** Controlled visibility. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const GAP = 8;
const MARGIN = 8;

const pop = keyframes({ from: { transform: 'scale(0.85)' }, to: { transform: 'none' } });

const Bubble = styled.div<SxProp>(
  ({ theme }) => ({
    position: 'fixed',
    zIndex: theme.zIndex.tooltip,
    maxWidth: 260,
    padding: `${theme.spacing(0.75)} ${theme.spacing(1.25)}`,
    borderRadius: theme.shape.radius.sm,
    ...glass(theme, { blur: 'md', tint: 'strong', elevation: 2 }),
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.75rem',
    fontWeight: 700,
    lineHeight: 1.4,
    overflowWrap: 'break-word',
    animation: `${pop} ${theme.motion.duration.short}ms ${theme.motion.easing.bounce} both`,
    [reducedMotion]: { animation: 'none' },
  }),
  applySx,
);

const Anchor = styled.span({ display: 'inline-flex', maxWidth: '100%' });

type Side = 'top' | 'bottom' | 'left' | 'right';

/** Resolves start/end to left/right for the given direction. */
const physical = (placement: TooltipPlacement, rtl: boolean): Side =>
  placement === 'start' ? (rtl ? 'right' : 'left') : placement === 'end' ? (rtl ? 'left' : 'right') : placement;

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * A short label shown on hover and keyboard focus, linked to its trigger with `aria-describedby`.
 * Escape hides it; the pointer can move onto it without it closing.
 */
export function Tooltip({
  title,
  children,
  placement = 'top',
  enterDelay = 300,
  leaveDelay = 100,
  open: openProp,
  onOpenChange,
  className,
  sx,
}: TooltipProps) {
  const id = useId();
  const [open, setOpenState] = useControlled(openProp, false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [bubble, setBubble] = useState<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasTitle = title !== null && title !== undefined && title !== '';
  const visible = open && hasTitle;

  const setOpen = (next: boolean) => {
    clearTimeout(timer.current);
    setOpenState(next);
    onOpenChange?.(next);
  };
  const schedule = (next: boolean, delay: number) => {
    clearTimeout(timer.current);
    if (delay <= 0) setOpen(next);
    else timer.current = setTimeout(() => setOpen(next), delay);
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  useEscapeKey(() => setOpen(false), visible);

  useIsomorphicLayoutEffect(() => {
    const anchorEl = anchorRef.current;
    if (!visible || !bubble || !anchorEl) {
      setPosition(null);
      return;
    }
    const update = () => {
      const a = anchorEl.getBoundingClientRect();
      const { offsetWidth: w, offsetHeight: h } = bubble;
      const rtl = getComputedStyle(anchorEl).direction === 'rtl';
      const fits: Record<Side, boolean> = {
        top: a.top - GAP - h >= MARGIN,
        bottom: a.bottom + GAP + h <= window.innerHeight - MARGIN,
        left: a.left - GAP - w >= MARGIN,
        right: a.right + GAP + w <= window.innerWidth - MARGIN,
      };
      let side = physical(placement, rtl);
      if (!fits[side] && fits[OPPOSITE[side]]) side = OPPOSITE[side];

      let top: number;
      let left: number;
      if (side === 'top' || side === 'bottom') {
        top = side === 'top' ? a.top - GAP - h : a.bottom + GAP;
        left = a.left + a.width / 2 - w / 2;
      } else {
        top = a.top + a.height / 2 - h / 2;
        left = side === 'left' ? a.left - GAP - w : a.right + GAP;
      }
      left = Math.max(MARGIN, Math.min(left, window.innerWidth - w - MARGIN));
      top = Math.max(MARGIN, Math.min(top, window.innerHeight - h - MARGIN));
      setPosition((prev) => (prev && prev.top === top && prev.left === left ? prev : { top, left }));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [visible, bubble, placement]);

  const describedBy = [children.props['aria-describedby'], visible ? id : null].filter(Boolean).join(' ') || undefined;
  const trigger = isValidElement(children) ? cloneElement(children, { 'aria-describedby': describedBy }) : children;

  return (
    <>
      <Anchor
        ref={anchorRef}
        onPointerEnter={() => schedule(true, enterDelay)}
        onPointerLeave={() => schedule(false, leaveDelay)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {trigger}
      </Anchor>
      {visible && (
        <Portal>
          <Bubble
            ref={setBubble}
            id={id}
            role="tooltip"
            className={className}
            sx={sx}
            style={position ?? { top: 0, left: 0, visibility: 'hidden' }}
            onPointerEnter={() => clearTimeout(timer.current)}
            onPointerLeave={() => schedule(false, leaveDelay)}
          >
            {title}
          </Bubble>
        </Portal>
      )}
    </>
  );
}
