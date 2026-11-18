import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { GlassSurface, reducedMotion } from '@core';
import type { CharacterFrameProps, GlassSurfaceProps, SxProp } from '@core';
import { Portal, useEscapeKey } from '@shared';

export type SnackbarCloseReason = 'timeout' | 'escape';

export interface SnackbarAnchor {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface SnackbarProps
  extends CharacterFrameProps,
    SxProp,
    Pick<GlassSurfaceProps, 'tone' | 'className' | 'style'> {
  open: boolean;
  /** Called when the snackbar asks to be dismissed: after the timeout or on Escape. */
  onClose?: (reason: SnackbarCloseReason) => void;
  /** Milliseconds before `onClose('timeout')`. `null` keeps it open. The timer pauses on hover and focus. */
  autoHideDuration?: number | null;
  message?: ReactNode;
  /** Element placed after the message, e.g. a text Button. */
  action?: ReactNode;
  anchor?: Partial<SnackbarAnchor>;
  /** Replaces `message` and `action` with custom content. */
  children?: ReactNode;
}

const slideUp = keyframes({ from: { transform: 'translateY(160%)' }, to: { transform: 'none' } });
const slideDown = keyframes({ from: { transform: 'translateY(-220%)' }, to: { transform: 'none' } });

const Anchor = styled.div<{ $anchor: SnackbarAnchor; $peek: boolean }>(({ theme, $anchor, $peek }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.snackbar,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: { left: 'flex-start', center: 'center', right: 'flex-end' }[$anchor.horizontal],
  // The wrapper spans the viewport width; only the snackbar itself takes pointer events.
  pointerEvents: 'none',
  ...($anchor.vertical === 'top'
    ? // Extra room so a peeking character is not cut off by the viewport edge.
      { top: 0, padding: `${theme.spacing($peek ? 6.5 : 3)} ${theme.spacing(3)} 0` }
    : { bottom: 0, padding: `0 ${theme.spacing(3)} ${theme.spacing(3)}` }),
}));

// Transform only: fading the opacity would disable the backdrop blur while it runs.
const Bar = styled(GlassSurface, { shouldForwardProp: (prop) => prop !== '$from' })<{ $from: 'top' | 'bottom' }>(
  ({ theme, $from }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    minHeight: 48,
    minWidth: 240,
    maxWidth: 560,
    padding: theme.spacing(0.75, 1.25, 0.75, 2.5),
    pointerEvents: 'auto',
    ...theme.typography.body2,
    fontWeight: 600,
    animation: `${$from === 'top' ? slideDown : slideUp} ${theme.motion.duration.long}ms ${theme.motion.easing.bounce} both`,
    [reducedMotion]: { animation: 'none' },
  }),
);

const Message = styled.div(({ theme }) => ({ flex: 1, padding: theme.spacing(0.75, 0) }));
const Action = styled.div({ display: 'flex', alignItems: 'center', flexShrink: 0 });

/** A brief, non-blocking message at the edge of the screen. A small character peeks over it by default. */
export function Snackbar({
  open,
  onClose,
  autoHideDuration = 5000,
  message,
  action,
  anchor,
  children,
  character = true,
  characterVariant = 'peek',
  characterPlacement = 'start',
  characterSize = 'sm',
  ...rest
}: SnackbarProps) {
  const position: SnackbarAnchor = { vertical: 'bottom', horizontal: 'center', ...anchor };
  const [paused, setPaused] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEscapeKey(() => onClose?.('escape'), open);

  useEffect(() => {
    if (!open || paused || autoHideDuration == null) return;
    const timer = setTimeout(() => onCloseRef.current?.('timeout'), autoHideDuration);
    return () => clearTimeout(timer);
  }, [open, paused, autoHideDuration]);

  useEffect(() => {
    if (!open) setPaused(false);
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <Anchor $anchor={position} $peek={Boolean(character) && characterVariant === 'peek'}>
        <Bar
          role="status"
          $from={position.vertical}
          radius="pill"
          tint="strong"
          elevation={4}
          character={character}
          characterVariant={characterVariant}
          characterPlacement={characterPlacement}
          characterSize={characterSize}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          {...rest}
        >
          {children ?? (
            <>
              <Message>{message}</Message>
              {action && <Action>{action}</Action>}
            </>
          )}
        </Bar>
      </Anchor>
    </Portal>
  );
}
