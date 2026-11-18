import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { GlassSurface, applySx, focusRing, reducedMotion, transition } from '@core';
import type { CharacterFrameProps, GlassSurfaceProps, SxProp } from '@core';
import { Portal, mergeRefs, useClickOutside, useEscapeKey, useIsomorphicLayoutEffect } from '@shared';

export type MenuCloseReason = 'escape' | 'outside' | 'select' | 'tab';
export type MenuPlacement = 'bottom-start' | 'bottom-end';

export interface MenuProps
  extends CharacterFrameProps,
    SxProp,
    Pick<GlassSurfaceProps, 'blur' | 'tint' | 'tone' | 'className' | 'style' | 'id' | 'aria-label' | 'aria-labelledby'> {
  open: boolean;
  /** Called when the menu asks to be dismissed. */
  onClose?: (reason: MenuCloseReason) => void;
  /** Element the menu is attached to; focus returns to it when the menu closes. */
  anchorEl: HTMLElement | null;
  /** Which edge of the anchor the menu lines up with. It flips above the anchor when there is no room below. */
  placement?: MenuPlacement;
  /** Close after an item is chosen. */
  closeOnSelect?: boolean;
  /** Minimum width in px. The menu is never narrower than its anchor. */
  minWidth?: number;
  /** `MenuItem`s. */
  children?: ReactNode;
}

const MenuContext = createContext<{ select: () => void } | null>(null);

const VIEWPORT_MARGIN = 8;
const ITEMS = '[role="menuitem"]:not(:disabled)';

// Transform only: fading the panel in would switch off its backdrop blur while the animation runs.
const pop = keyframes({
  from: { transform: 'scale(0.9)' },
  to: { transform: 'none' },
});

const Panel = styled(GlassSurface, { shouldForwardProp: (prop) => prop !== '$above' })<{ $above: boolean }>(
  ({ theme, $above }) => ({
    position: 'fixed',
    zIndex: theme.zIndex.modal,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: theme.spacing(0.75),
    outline: 'none',
    transformOrigin: $above ? 'bottom center' : 'top center',
    animation: `${pop} ${theme.motion.duration.medium}ms ${theme.motion.easing.bounce} both`,
    [reducedMotion]: { animation: 'none' },
  }),
);

/** Room the character needs between the anchor and the panel, so it does not cover the anchor. */
const characterGap = ({ character, characterVariant = 'peek', characterSize = 'sm' }: CharacterFrameProps) => {
  if (!character) return 0;
  const scale = { sm: 1, md: 1.45, lg: 2 }[characterSize];
  return (characterVariant === 'peek' ? 44 : 34) * scale;
};

/**
 * A dropdown list of actions attached to an anchor element.
 * Arrow keys, Home and End move between items; Escape, Tab and outside clicks close it.
 */
export function Menu({
  open,
  onClose,
  anchorEl,
  placement = 'bottom-start',
  closeOnSelect = true,
  minWidth = 180,
  character = false,
  characterSize = 'sm',
  characterVariant,
  children,
  style,
  ...rest
}: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef(anchorEl);
  anchorRef.current = anchorEl;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  // The panel mounts one render after `open` (it is portaled), so track the node itself.
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; above: boolean; width: number } | null>(null);

  const frame = { character, characterSize, characterVariant };
  const gap = 6 + characterGap(frame);

  useIsomorphicLayoutEffect(() => {
    if (!open || !node || !anchorEl) {
      setPosition(null);
      return;
    }
    const update = () => {
      const anchor = anchorEl.getBoundingClientRect();
      const width = Math.max(minWidth, anchor.width);
      const { offsetHeight: height } = node;
      const rtl = getComputedStyle(anchorEl).direction === 'rtl';
      const alignEnd = (placement === 'bottom-end') !== rtl;

      const fitsBelow = anchor.bottom + gap + height <= window.innerHeight - VIEWPORT_MARGIN;
      const fitsAbove = anchor.top - 6 - height >= VIEWPORT_MARGIN;
      const above = !fitsBelow && fitsAbove;
      const top = above ? anchor.top - 6 - height : anchor.bottom + gap;
      const wanted = alignEnd ? anchor.right - width : anchor.left;
      const left = Math.max(VIEWPORT_MARGIN, Math.min(wanted, window.innerWidth - width - VIEWPORT_MARGIN));
      setPosition((prev) =>
        prev && prev.top === top && prev.left === left && prev.above === above && prev.width === width
          ? prev
          : { top, left, above, width },
      );
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, node, anchorEl, placement, minWidth, gap]);

  // Focus the first item once the menu is in place, and give focus back to the anchor afterwards.
  const positioned = position !== null;
  useEffect(() => {
    if (!positioned || !node) return;
    (node.querySelector<HTMLElement>(ITEMS) ?? node).focus();
    return () => {
      const active = document.activeElement;
      if (!active || active === document.body || node.contains(active)) anchorRef.current?.focus();
    };
  }, [positioned, node]);

  useEscapeKey(() => closeRef.current?.('escape'), open);
  useClickOutside([menuRef, anchorRef], () => closeRef.current?.('outside'), open);

  const context = useMemo(
    () => ({
      select: () => {
        if (closeOnSelect) closeRef.current?.('select');
      },
    }),
    [closeOnSelect],
  );

  if (!open) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      onClose?.('tab');
      return;
    }
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ITEMS));
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = index + 1;
        break;
      case 'ArrowUp':
        next = index <= 0 ? items.length - 1 : index - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = items.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    items[next % items.length]!.focus();
  };

  const placed: CSSProperties = position
    ? { top: position.top, left: position.left, minWidth: position.width }
    : { top: 0, left: 0, minWidth, visibility: 'hidden' };

  return (
    <Portal>
      <MenuContext.Provider value={context}>
        <Panel
          ref={mergeRefs(menuRef, setNode)}
          role="menu"
          tabIndex={-1}
          $above={position?.above ?? false}
          tint="strong"
          blur="lg"
          elevation={4}
          radius="md"
          {...frame}
          {...rest}
          style={{ ...style, ...placed }}
          onKeyDown={handleKeyDown}
        >
          {children}
        </Panel>
      </MenuContext.Provider>
    </Portal>
  );
}

/* -------------------------------- MenuItem -------------------------------- */

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement>, SxProp {
  /** Element shown before the label, e.g. an icon. */
  startAdornment?: ReactNode;
  /** Marks the item as the current choice. */
  selected?: boolean;
}

const ItemRoot = styled.button<SxProp & { $selected: boolean }>(
  ({ theme, $selected }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    width: '100%',
    minHeight: 38,
    padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
    border: 0,
    borderRadius: theme.shape.radius.sm,
    background: $selected ? theme.palette.action.selected : 'transparent',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    ...theme.typography.body2,
    fontWeight: $selected ? 800 : 600,
    textAlign: 'start',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    transition: transition(theme, ['background-color', 'transform']),
    [reducedMotion]: { transition: 'none' },
    '&:hover': { background: $selected ? theme.palette.action.selected : theme.palette.action.hover },
    '&:active': { transform: 'scale(0.98)' },
    '&:focus-visible': { ...focusRing(theme), outlineOffset: -2, background: theme.palette.action.hover },
    '&:disabled': { cursor: 'not-allowed', color: theme.palette.action.disabled, background: 'transparent', transform: 'none' },
  }),
  applySx,
);

const Adornment = styled.span({ display: 'inline-flex', flexShrink: 0, fontSize: '1.2em' });

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { startAdornment, selected = false, onClick, children, ...rest },
  ref,
) {
  const menu = useContext(MenuContext);
  return (
    <ItemRoot
      ref={ref}
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-current={selected ? 'true' : undefined}
      $selected={selected}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) menu?.select();
      }}
      {...rest}
    >
      {startAdornment && <Adornment aria-hidden>{startAdornment}</Adornment>}
      {children}
    </ItemRoot>
  );
});
