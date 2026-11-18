import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { createContext, forwardRef, useContext, useId, useMemo } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { Character, applySx, focusRing, getCharacter, glass, reducedMotion, transition, useTheme } from '@core';
import type { CharacterName, ColorName, SxProp } from '@core';
import { useControlled } from '@shared';

export type TabValue = string | number;

interface TabsContextValue {
  value: TabValue | undefined;
  select: (value: TabValue) => void;
  baseId: string;
  color: ColorName;
  character: CharacterName | false;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<${component}> must be rendered inside <Tabs>.`);
  return context;
}

const idPart = (value: TabValue) => String(value).replace(/[^a-zA-Z0-9_-]+/g, '-');
const tabId = (baseId: string, value: TabValue) => `${baseId}-tab-${idPart(value)}`;
const panelId = (baseId: string, value: TabValue) => `${baseId}-panel-${idPart(value)}`;

/* ---------------------------------- Tabs ---------------------------------- */

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, SxProp {
  /** Selected tab (controlled). */
  value?: TabValue;
  /** Initially selected tab (uncontrolled). Set one of `value`/`defaultValue` so a tab is reachable by keyboard. */
  defaultValue?: TabValue;
  /** Called with the value of the tab the user selected. */
  onChange?: (value: TabValue) => void;
  color?: ColorName;
  /** A character peeking over the selected tab. `true` uses `theme.character.default`. */
  character?: CharacterName | boolean;
}

const TabsRoot = styled.div<SxProp>({ display: 'block' }, applySx);

/** Groups a `TabList` with its `TabPanel`s and holds the selection. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value: valueProp, defaultValue, onChange, color = 'primary', character = false, children, ...rest },
  ref,
) {
  const theme = useTheme();
  const baseId = useId();
  const [value, setValue] = useControlled<TabValue | undefined>(valueProp, defaultValue);
  const name = character === true ? theme.character.default : character;

  const context = useMemo<TabsContextValue>(
    () => ({
      value,
      baseId,
      color,
      character: name,
      select: (next) => {
        if (next === value) return;
        setValue(next);
        onChange?.(next);
      },
    }),
    [value, baseId, color, name, setValue, onChange],
  );

  return (
    <TabsContext.Provider value={context}>
      <TabsRoot ref={ref} {...rest}>
        {children}
      </TabsRoot>
    </TabsContext.Provider>
  );
});

/* --------------------------------- TabList -------------------------------- */

export interface TabListProps extends HTMLAttributes<HTMLDivElement>, SxProp {
  /** Stretch the tabs to fill the available width. */
  fullWidth?: boolean;
}

const ListRoot = styled.div<SxProp & { $fullWidth: boolean }>(
  ({ theme, $fullWidth }) => ({
    position: 'relative',
    display: $fullWidth ? 'flex' : 'inline-flex',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.radius.pill,
    ...glass(theme, { blur: 'md', tint: 'subtle', elevation: 1 }),
    '& > [role="tab"]': $fullWidth ? { flex: 1 } : undefined,
  }),
  applySx,
);

/** The glass pill holding the tabs. Arrow keys, Home and End move between them. */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { fullWidth = false, onKeyDown, children, ...rest },
  ref,
) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = index + (rtl ? -1 : 1);
        break;
      case 'ArrowLeft':
        next = index + (rtl ? 1 : -1);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const target = tabs[(next + tabs.length) % tabs.length]!;
    target.focus();
    // Selection follows focus.
    target.click();
  };

  return (
    <ListRoot ref={ref} role="tablist" $fullWidth={fullWidth} onKeyDown={handleKeyDown} {...rest}>
      {children}
    </ListRoot>
  );
});

/* ----------------------------------- Tab ---------------------------------- */

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'>, SxProp {
  /** Identifies the tab and the `TabPanel` it controls. */
  value: TabValue;
  /** Element shown before the label. */
  icon?: ReactNode;
}

const PEEK_SIZE = 32;

const TabRoot = styled.button<SxProp & { $selected: boolean; $color: ColorName }>(
  ({ theme, $selected, $color }) => {
    const c = theme.palette[$color];
    const accent = theme.mode === 'dark' ? c.light : c.dark;
    const fill = theme.glass.tint.strong;
    return {
      position: 'relative',
      isolation: 'isolate',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(0.75),
      minHeight: 36,
      padding: `0 ${theme.spacing(2)}`,
      border: 0,
      borderRadius: theme.shape.radius.pill,
      background: 'transparent',
      color: theme.palette.text.secondary,
      fontFamily: theme.typography.fontFamily,
      ...theme.typography.button,
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
      transition: transition(theme, ['transform', 'background-color', 'color', 'box-shadow'], { easing: 'bounce' }),
      [reducedMotion]: { transition: 'none' },
      '&:hover': { background: theme.palette.action.hover, color: theme.palette.text.primary },
      '&:active': { transform: 'scale(0.96)' },
      ...($selected && {
        color: accent,
        background: `linear-gradient(${c.soft}, ${c.soft}), linear-gradient(${fill}, ${fill})`,
        boxShadow: `inset 0 1px 0 ${theme.glass.highlight}, ${theme.shadows[1]}`,
        '&:hover': { color: accent },
      }),
      '&:focus-visible': focusRing(theme),
      '&:disabled': {
        cursor: 'not-allowed',
        color: theme.palette.action.disabled,
        background: 'transparent',
        transform: 'none',
      },
    };
  },
  applySx,
);

const TabIcon = styled.span({ display: 'inline-flex', flexShrink: 0, fontSize: '1.2em' });

const rise = keyframes({
  from: { transform: 'translateY(60%)' },
  to: { transform: 'translateY(0)' },
});

const Peek = styled.span<{ $line: number }>(({ theme, $line }) => ({
  position: 'absolute',
  // Behind the tab pill: only what rises above its top edge reads clearly.
  zIndex: -1,
  top: -(PEEK_SIZE * $line) / 100 + 2,
  left: '50%',
  width: PEEK_SIZE,
  height: PEEK_SIZE,
  marginLeft: -PEEK_SIZE / 2,
  pointerEvents: 'none',
  animation: `${rise} ${theme.motion.duration.medium}ms ${theme.motion.easing.bounce} both`,
  [reducedMotion]: { animation: 'none' },
}));

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { value, icon, onClick, children, ...rest },
  ref,
) {
  const tabs = useTabs('Tab');
  const selected = tabs.value === value;

  return (
    <TabRoot
      ref={ref}
      type="button"
      role="tab"
      id={tabId(tabs.baseId, value)}
      aria-selected={selected}
      aria-controls={panelId(tabs.baseId, value)}
      tabIndex={selected ? 0 : -1}
      $selected={selected}
      $color={tabs.color}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) tabs.select(value);
      }}
      {...rest}
    >
      {selected && tabs.character && (
        <Peek $line={getCharacter(tabs.character).peekLine} aria-hidden>
          <Character name={tabs.character} size={PEEK_SIZE} mood="happy" />
        </Peek>
      )}
      {icon && <TabIcon aria-hidden>{icon}</TabIcon>}
      {children}
    </TabRoot>
  );
});

/* -------------------------------- TabPanel -------------------------------- */

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement>, SxProp {
  /** Value of the `Tab` that shows this panel. */
  value: TabValue;
  /** Keep the content mounted (but hidden) while another tab is selected. */
  keepMounted?: boolean;
}

const PanelRoot = styled.div<SxProp>(
  ({ theme }) => ({
    paddingTop: theme.spacing(2),
    borderRadius: theme.shape.radius.sm,
    '&:focus-visible': focusRing(theme),
  }),
  applySx,
);

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { value, keepMounted = false, children, ...rest },
  ref,
) {
  const tabs = useTabs('TabPanel');
  const selected = tabs.value === value;
  if (!selected && !keepMounted) return null;

  return (
    <PanelRoot
      ref={ref}
      role="tabpanel"
      id={panelId(tabs.baseId, value)}
      aria-labelledby={tabId(tabs.baseId, value)}
      hidden={!selected}
      tabIndex={0}
      {...rest}
    >
      {children}
    </PanelRoot>
  );
});
