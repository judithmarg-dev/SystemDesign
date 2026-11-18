import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { forwardRef, useId, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import { alpha, lighten, mergeRefs, useElementSize } from '@shared';
import { Character, CharacterFace } from '../characters/Character';
import { createPen } from '../characters/geometry';
import { getCharacter } from '../characters/registry';
import type { CharacterDefinition, CharacterMood } from '../characters/types';
import { applySx, glass, reducedMotion } from '../styling';
import type { SxProp } from '../styling';
import { useTheme } from '../theme/ThemeProvider';
import type { BlurLevel, CharacterName, ColorName, RadiusName, Size, TintLevel } from '../theme/types';

export type CharacterVariant = 'peek' | 'silhouette';
export type CharacterPlacement = 'start' | 'center' | 'end';

/** Props shared by every component that can host a character on its frame. */
export interface CharacterFrameProps {
  /** Character decorating the surface. `true` uses `theme.character.default`; `false` renders plain glass. */
  character?: CharacterName | boolean;
  /**
   * How the character is integrated:
   * - `peek`: the surface keeps its shape and the character peeks over the top edge.
   * - `silhouette`: the surface outline itself takes the character's shape (ears, cap, tail…).
   */
  characterVariant?: CharacterVariant;
  /** Where the character peeks from along the top edge. Only for the `peek` variant. */
  characterPlacement?: CharacterPlacement;
  /** Scale of the character features. */
  characterSize?: Size;
  mood?: CharacterMood;
}

export interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement>, SxProp, CharacterFrameProps {
  blur?: BlurLevel;
  tint?: TintLevel;
  /** Shadow depth, 0–5. */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  radius?: RadiusName;
  /** Tints the glass with a palette color. */
  tone?: ColorName;
  /** Element rendered as the root, e.g. `header` or `section` for a landmark. */
  component?: 'div' | 'header' | 'footer' | 'section' | 'aside' | 'nav' | 'article';
}

const PEEK_SIZE: Record<Size, number> = { sm: 56, md: 80, lg: 112 };
const SILHOUETTE_UNIT: Record<Size, number> = { sm: 14, md: 20, lg: 28 };

const Root = styled.div<SxProp & { $radius: RadiusName }>(
  ({ theme, $radius }) => ({
    position: 'relative',
    // Own stacking context, so the decorative layers (negative z-index) stay inside the surface.
    isolation: 'isolate',
    borderRadius: theme.shape.radius[$radius],
    color: theme.palette.text.primary,
  }),
  applySx,
);

const GlassLayer = styled.div<{ $blur: BlurLevel; $tint: TintLevel; $elevation: 0 | 1 | 2 | 3 | 4 | 5; $tone?: ColorName }>(
  ({ theme, $blur, $tint, $elevation, $tone }) => {
    const tone = $tone ? theme.palette[$tone].soft : null;
    return {
      position: 'absolute',
      inset: 0,
      zIndex: -1,
      borderRadius: 'inherit',
      pointerEvents: 'none',
      ...glass(theme, {
        blur: $blur,
        tint: $tint,
        elevation: $elevation,
        background: tone
          ? `linear-gradient(${tone}, ${tone}), linear-gradient(${theme.glass.tint[$tint]}, ${theme.glass.tint[$tint]})`
          : undefined,
      }),
    };
  },
);

/* ---------------------------------- peek ---------------------------------- */

const rise = keyframes({
  from: { transform: 'translateY(45%)' },
  to: { transform: 'translateY(0)' },
});

const PeekSlot = styled.div<{ $size: number; $line: number; $placement: CharacterPlacement; $radius: RadiusName; $front?: boolean }>(
  ({ theme, $size, $line, $placement, $radius, $front }) => {
    const edge = Math.min(theme.shape.radius[$radius], 28) + 4;
    return {
      position: 'absolute',
      top: -($size * $line) / 100,
      width: $size,
      height: $size,
      // The head sits behind the glass (so its chin shows blurred through it); the paws rest on top of the edge.
      zIndex: $front ? 0 : -2,
      pointerEvents: 'none',
      ...($placement === 'start' && { insetInlineStart: edge }),
      ...($placement === 'end' && { insetInlineEnd: edge }),
      ...($placement === 'center' && { left: '50%', marginLeft: -$size / 2 }),
    };
  },
);

const PeekHead = styled.div(({ theme }) => ({
  width: '100%',
  height: '100%',
  animation: `${rise} ${theme.motion.duration.long}ms ${theme.motion.easing.bounce} both`,
  [reducedMotion]: { animation: 'none' },
}));

const Paw = styled.span<{ $line: number; $side: 'left' | 'right'; $color: string; $shade: string }>(
  ({ $line, $side, $color, $shade }) => ({
    position: 'absolute',
    top: `${$line}%`,
    [$side]: '13%',
    width: '21%',
    height: '15%',
    marginTop: '-8%',
    borderRadius: '50%',
    background: $color,
    boxShadow: `inset 0 -2px 0 ${alpha($shade, 0.55)}`,
  }),
);

/* ------------------------------- silhouette ------------------------------- */

const SilhouetteBackdrop = styled.div<{ $blur: BlurLevel }>(({ theme, $blur }) => {
  const filter = `blur(${theme.glass.blur[$blur]}px) saturate(${theme.glass.saturation})`;
  return {
    position: 'absolute',
    zIndex: -1,
    pointerEvents: 'none',
    backdropFilter: filter,
    WebkitBackdropFilter: filter,
  };
});

const SilhouetteSvg = styled.svg({
  position: 'absolute',
  inset: 0,
  zIndex: -1,
  width: '100%',
  height: '100%',
  overflow: 'visible',
  pointerEvents: 'none',
});

const FaceBand = styled.div({
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
});

interface SilhouetteProps {
  definition: CharacterDefinition;
  width: number;
  height: number;
  radius: number;
  unit: number;
  blur: BlurLevel;
  elevation: number;
}

function Silhouette({ definition, width: w, height: h, radius, unit: u, blur, elevation }: SilhouetteProps) {
  const theme = useTheme();
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const r = Math.min(radius, w / 2, h / 2);
  const ctx = { w, h, r, u };

  const outline = (offsetX: number, offsetY: number) => {
    const pen = createPen(offsetX, offsetY);
    return [pen.rect(0, 0, w, h, r), ...definition.silhouette(ctx, pen).shapes].join(' ');
  };

  const { overflow } = definition.silhouette(ctx, createPen());
  const path = outline(0, 0);
  const pad = 80;
  const bounds = {
    x: -overflow.left - pad,
    y: -overflow.top - pad,
    width: w + overflow.left + overflow.right + pad * 2,
    height: h + overflow.top + overflow.bottom + pad * 2,
  };
  const dark = theme.mode === 'dark';
  const { tint } = definition.colors;
  const Details = definition.SilhouetteDetails;

  return (
    <>
      <SilhouetteBackdrop
        $blur={blur}
        style={{
          top: -overflow.top,
          right: -overflow.right,
          bottom: -overflow.bottom,
          left: -overflow.left,
          clipPath: `path('${outline(overflow.left, overflow.top)}')`,
          background: `linear-gradient(165deg, ${alpha(lighten(tint, 0.45), dark ? 0.3 : 0.62)}, ${alpha(tint, dark ? 0.24 : 0.44)})`,
        }}
      />
      <SilhouetteSvg viewBox={`0 0 ${w} ${h}`} aria-hidden focusable="false">
        <defs>
          {/* Everything except the outline's interior: keeps the border and shadow from showing through the glass. */}
          <mask id={`${id}-outside`} maskUnits="userSpaceOnUse" {...bounds}>
            <rect {...bounds} fill="#fff" />
            <path d={path} fill="#000" />
          </mask>
          <clipPath id={`${id}-outside-body`}>
            <path d={`${createPen().rect(bounds.x, bounds.y, bounds.width, bounds.height, 0)} ${createPen().rect(0, 0, w, h, r)}`} clipRule="evenodd" />
          </clipPath>
        </defs>
        {elevation > 0 && (
          <g mask={`url(#${id}-outside)`}>
            <path
              d={path}
              transform={`translate(0 ${4 + elevation * 3})`}
              fill={dark ? 'rgb(8, 4, 6)' : 'rgb(134, 78, 40)'}
              opacity={(dark ? 0.3 : 0.12) + elevation * 0.03}
              style={{ filter: `blur(${6 + elevation * 4}px)` }}
            />
          </g>
        )}
        <Details {...ctx} colors={definition.colors} outsideClip={`url(#${id}-outside-body)`} />
        <path d={path} fill="none" stroke={theme.glass.border} strokeWidth={2.5} mask={`url(#${id}-outside)`} />
      </SilhouetteSvg>
    </>
  );
}

/* --------------------------------- surface -------------------------------- */

/**
 * The base surface of the system: a frosted-glass panel that can host a character on its frame.
 * Paper, Card, Modal, Alert… are all built on it.
 *
 * Decorations are drawn outside the panel box (above the top edge, and to the side for tails),
 * so leave room around the surface and avoid `overflow: hidden` on its parent.
 */
export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(function GlassSurface(
  {
    character = false,
    characterVariant = 'peek',
    characterPlacement = 'center',
    characterSize = 'md',
    mood = 'neutral',
    blur = 'md',
    tint = 'regular',
    elevation = 2,
    radius = 'lg',
    tone,
    component,
    children,
    ...rest
  },
  ref,
) {
  const theme = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const name = character === true ? theme.character.default : character;
  const definition = name ? getCharacter(name) : null;
  const isSilhouette = definition !== null && characterVariant === 'silhouette';
  const isPeek = definition !== null && characterVariant === 'peek';
  const size = useElementSize(rootRef, isSilhouette);

  const unit = SILHOUETTE_UNIT[characterSize];
  const peekSize = PEEK_SIZE[characterSize];
  const slot = { $size: peekSize, $line: definition?.peekLine ?? 0, $placement: characterPlacement, $radius: radius };

  return (
    <Root ref={mergeRefs(ref, rootRef)} as={component} $radius={radius} {...rest}>
      {isPeek && (
        <PeekSlot {...slot} aria-hidden>
          <PeekHead>
            <Character name={definition.name} size={peekSize} mood={mood} />
          </PeekHead>
        </PeekSlot>
      )}
      {isSilhouette && size ? (
        <Silhouette
          definition={definition}
          width={size.width}
          height={size.height}
          radius={theme.shape.radius[radius]}
          unit={unit}
          blur={blur}
          elevation={elevation}
        />
      ) : (
        <GlassLayer $blur={blur} $tint={tint} $elevation={elevation} $tone={tone} />
      )}
      {isPeek && (
        <PeekSlot {...slot} $front aria-hidden>
          <Paw $line={definition.peekLine} $side="left" $color={definition.colors.base} $shade={definition.colors.shade} />
          <Paw $line={definition.peekLine} $side="right" $color={definition.colors.base} $shade={definition.colors.shade} />
        </PeekSlot>
      )}
      {isSilhouette && (
        <FaceBand
          aria-hidden
          style={{ paddingTop: definition.silhouette({ w: 0, h: 0, r: 0, u: unit }, createPen()).insetTop + unit * 0.7 }}
        >
          <CharacterFace name={definition.name} width={unit * 4.4} mood={mood} />
        </FaceBand>
      )}
      {children}
    </Root>
  );
});
