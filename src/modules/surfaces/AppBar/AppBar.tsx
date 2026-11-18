import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { GlassSurface, applySx } from '@core';
import type { ColorName, GlassSurfaceProps, SxProp } from '@core';

export type AppBarPosition = 'static' | 'sticky' | 'fixed';

export interface AppBarProps extends Omit<GlassSurfaceProps, 'tone'> {
  /** `sticky` and `fixed` keep the bar at the top of the page while scrolling. */
  position?: AppBarPosition;
  /** Tints the glass with a palette color. Leave unset for neutral glass. */
  color?: ColorName;
  /**
   * A rounded bar detached from the page edges (the default). Set to `false` for a flush, square bar.
   * A peeking character rises above the top edge, so it needs a floating bar with room above it.
   */
  floating?: boolean;
}

const Root = styled(GlassSurface, { shouldForwardProp: (prop) => !prop.startsWith('$') })<{
  $position: AppBarPosition;
  $floating: boolean;
  $peek: boolean;
}>(({ theme, $position, $floating, $peek }) => {
  // Room above the bar for the character's head when it is pinned to the top.
  const offset = $floating ? ($peek ? 64 : 12) : 0;
  return {
    position: $position,
    zIndex: $position === 'static' ? undefined : theme.zIndex.appBar,
    display: 'flex',
    flexDirection: 'column',
    width: $floating ? undefined : '100%',
    boxSizing: 'border-box',
    ...($position !== 'static' && { top: offset }),
    ...($position === 'fixed' && { left: $floating ? 12 : 0, right: $floating ? 12 : 0 }),
    ...($floating && $position === 'sticky' && { marginInline: 12 }),
    ...(!$floating && { borderRadius: 0, borderInline: 0, borderTop: 0 }),
  };
});

/**
 * The top bar of an app or page: a blurred glass strip for the title, navigation and actions.
 * Put a `Toolbar` inside to lay out its content. Accepts the character frame props of every surface.
 */
export const AppBar = forwardRef<HTMLElement, AppBarProps>(function AppBar(
  {
    position = 'static',
    color,
    floating = true,
    character = false,
    characterVariant = 'peek',
    characterPlacement = 'start',
    characterSize = 'sm',
    blur = 'lg',
    tint = 'regular',
    elevation = 2,
    radius = 'lg',
    ...rest
  },
  ref,
) {
  return (
    <Root
      ref={ref as Ref<HTMLDivElement>}
      component="header"
      $position={position}
      $floating={floating}
      $peek={Boolean(character) && characterVariant === 'peek'}
      tone={color}
      character={character}
      characterVariant={characterVariant}
      characterPlacement={characterPlacement}
      characterSize={characterSize}
      blur={blur}
      tint={tint}
      elevation={elevation}
      radius={radius}
      {...rest}
    />
  );
});

/* --------------------------------- Toolbar -------------------------------- */

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement>, SxProp {
  /** `dense` for compact bars. */
  variant?: 'regular' | 'dense';
  /** Removes the side padding. */
  disableGutters?: boolean;
}

const ToolbarRoot = styled.div<SxProp & { $variant: 'regular' | 'dense'; $gutters: boolean }>(
  ({ theme, $variant, $gutters }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    minHeight: $variant === 'dense' ? 48 : 64,
    paddingInline: $gutters ? theme.spacing(2.5) : 0,
  }),
  applySx,
);

/** A horizontal row that aligns the content of an `AppBar`. */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { variant = 'regular', disableGutters = false, ...rest },
  ref,
) {
  return <ToolbarRoot ref={ref} $variant={variant} $gutters={!disableGutters} {...rest} />;
});
