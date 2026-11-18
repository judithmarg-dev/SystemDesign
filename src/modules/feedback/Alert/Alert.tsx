import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Character, GlassSurface } from '@core';
import type { CharacterMood, CharacterName, ColorName, GlassSurfaceProps } from '@core';
import { CloseButton } from '../internal/CloseButton';

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

export interface AlertProps
  extends Omit<GlassSurfaceProps, 'title' | 'character' | 'characterVariant' | 'characterPlacement' | 'characterSize' | 'tone'> {
  severity?: AlertSeverity;
  /** Bold first line. */
  title?: ReactNode;
  /** Character shown as the icon. `true` uses `theme.character.default`; `false` hides the icon. */
  character?: CharacterName | boolean;
  /** Replaces the character icon. */
  icon?: ReactNode;
  /** Element placed at the end, e.g. a text Button. */
  action?: ReactNode;
  /** Shows a close button and is called when it is pressed. */
  onClose?: () => void;
  /** Accessible label for the close button. */
  closeLabel?: string;
}

const TONE: Record<AlertSeverity, ColorName> = { success: 'success', info: 'info', warning: 'warning', error: 'error' };

/** The character's expression tells the severity apart without relying on color alone. */
const MOOD: Record<AlertSeverity, CharacterMood> = {
  success: 'happy',
  info: 'neutral',
  warning: 'sleepy',
  error: 'surprised',
};

const Root = styled(GlassSurface)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
}));

const Icon = styled.span({ display: 'inline-flex', flexShrink: 0 });

const Body = styled.div(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  alignSelf: 'center',
  ...theme.typography.body2,
}));

const Title = styled.div(({ theme }) => ({ ...theme.typography.subtitle1, fontWeight: 700 }));

const Action = styled.div({ display: 'flex', alignItems: 'center', alignSelf: 'center', flexShrink: 0 });

/** An inline message about the state of something. The character's mood follows the severity. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { severity = 'info', title, character = true, icon, action, onClose, closeLabel = 'Close', mood, children, ...rest },
  ref,
) {
  const assertive = severity === 'error' || severity === 'warning';
  return (
    <Root ref={ref} role={assertive ? 'alert' : 'status'} tone={TONE[severity]} radius="md" elevation={1} {...rest}>
      {icon !== undefined ? (
        icon && <Icon aria-hidden>{icon}</Icon>
      ) : (
        character && (
          <Icon>
            <Character name={character === true ? undefined : character} size={36} mood={mood ?? MOOD[severity]} />
          </Icon>
        )
      )}
      <Body>
        {title && <Title>{title}</Title>}
        {children}
      </Body>
      {action && <Action>{action}</Action>}
      {onClose && <CloseButton label={closeLabel} onClick={onClose} />}
    </Root>
  );
});
