import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { GlassSurface, reducedMotion } from '@core';
import type { CharacterFrameProps, GlassSurfaceProps, SxProp } from '@core';
import { Portal, useEscapeKey, useFocusTrap, useScrollLock } from '@shared';

export interface ModalProps
  extends CharacterFrameProps,
    SxProp,
    Pick<GlassSurfaceProps, 'blur' | 'tint' | 'tone' | 'className' | 'style'> {
  open: boolean;
  /** Called when the user asks to dismiss: Escape, backdrop click or the close button. */
  onClose?: (reason: 'escape' | 'backdrop' | 'closeButton') => void;
  /** Heading; also labels the dialog for assistive technology. */
  title?: ReactNode;
  children?: ReactNode;
  /** Buttons shown at the bottom, aligned to the end. */
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
  /** Shows a close button in the corner. */
  closeButton?: boolean;
  /** Accessible label for the close button. */
  closeLabel?: string;
  disableBackdropClose?: boolean;
  disableEscapeClose?: boolean;
  /** Accessible name when there is no `title`. */
  'aria-label'?: string;
}

const MAX_WIDTH = { xs: 360, sm: 480, md: 640 } as const;

const fade = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
// Transform only: animating the panel's opacity would switch off its backdrop blur until the animation ends.
const pop = keyframes({
  from: { transform: 'translateY(24px) scale(0.92)' },
  to: { transform: 'none' },
});

const Layer = styled.div(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.modal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // Room for the character above the panel and for a tail beside it.
  padding: `${theme.spacing(11)} ${theme.spacing(3)} ${theme.spacing(4)}`,
  overflowY: 'auto',
}));

const Scrim = styled.div(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  background: theme.palette.scrim,
  animation: `${fade} ${theme.motion.duration.medium}ms ${theme.motion.easing.standard} both`,
  [reducedMotion]: { animation: 'none' },
}));

const Panel = styled(GlassSurface, { shouldForwardProp: (prop) => prop !== '$maxWidth' })<{ $maxWidth: keyof typeof MAX_WIDTH }>(
  ({ theme, $maxWidth }) => ({
    width: '100%',
    maxWidth: MAX_WIDTH[$maxWidth],
    margin: 'auto',
    padding: theme.spacing(3),
    outline: 'none',
    animation: `${pop} ${theme.motion.duration.long}ms ${theme.motion.easing.bounce} both`,
    [reducedMotion]: { animation: 'none' },
  }),
);

const Title = styled.h2(({ theme }) => ({
  margin: 0,
  paddingInlineEnd: theme.spacing(4),
  ...theme.typography.h5,
}));

const Content = styled.div(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  color: theme.palette.text.secondary,
  ...theme.typography.body1,
  '&:first-of-type': { marginTop: 0 },
}));

const Actions = styled.div(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(3),
}));

const Close = styled.button(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  insetInlineEnd: theme.spacing(1.5),
  display: 'grid',
  placeItems: 'center',
  width: 32,
  height: 32,
  padding: 0,
  border: 0,
  borderRadius: '50%',
  background: 'transparent',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  '&:hover': { background: theme.palette.action.hover },
  '&:focus-visible': { outline: `3px solid ${theme.palette.action.focus}`, outlineOffset: 2 },
}));

/**
 * A dialog that interrupts the page. By default the theme's character peeks over its top edge;
 * pass `characterVariant="silhouette"` to make the whole panel take the character's shape.
 */
export function Modal({ open, ...props }: ModalProps & { elevation?: GlassSurfaceProps['elevation'] }) {
  if (!open) return null;
  // The dialog lives in its own component so its effects (focus trap, scroll lock) run once the portal has mounted it.
  return (
    <Portal>
      <ModalDialog {...props} />
    </Portal>
  );
}

function ModalDialog({
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  closeButton = false,
  closeLabel = 'Close',
  disableBackdropClose = false,
  disableEscapeClose = false,
  character = true,
  elevation,
  ...rest
}: Omit<ModalProps, 'open'> & { elevation?: GlassSurfaceProps['elevation'] }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEscapeKey(() => onClose?.('escape'), !disableEscapeClose);
  useScrollLock(true);
  useFocusTrap(panelRef, true);

  return (
      <Layer
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !disableBackdropClose) onClose?.('backdrop');
        }}
      >
        <Scrim aria-hidden onMouseDown={() => !disableBackdropClose && onClose?.('backdrop')} />
        <Panel
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          $maxWidth={maxWidth}
          character={character}
          tint="strong"
          blur="lg"
          elevation={elevation ?? 5}
          radius="xl"
          {...rest}
        >
          {closeButton && (
            <Close type="button" aria-label={closeLabel} onClick={() => onClose?.('closeButton')}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden focusable="false">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </Close>
          )}
          {title && <Title id={titleId}>{title}</Title>}
          {children && <Content>{children}</Content>}
          {actions && <Actions>{actions}</Actions>}
        </Panel>
      </Layer>
  );
}
