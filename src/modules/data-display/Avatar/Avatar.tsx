import styled from '@emotion/styled';
import { forwardRef, useEffect, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Character, applySx, glass } from '@core';
import type { CharacterMood, CharacterName, Size, SxProp } from '@core';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement>, SxProp {
  /** Image URL. If it is missing or fails to load, the fallback is shown. */
  src?: string;
  /** Describes who the avatar represents. Used as the image's alt text and the fallback's accessible name. */
  alt?: string;
  /** Fallback content: a name (shown as initials) or any node such as an icon. */
  children?: ReactNode;
  /** Character shown when there is neither an image nor children. Defaults to `theme.character.default`. */
  character?: CharacterName;
  mood?: CharacterMood;
  /** A preset, or a diameter in px. */
  size?: Size | number;
}

const SIZE: Record<Size, number> = { sm: 32, md: 44, lg: 64 };

/** "Maple Bear" → "MB"; a single word keeps its first two letters. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

const Root = styled.span<SxProp & { $size: number }>(
  ({ theme, $size }) => ({
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: $size,
    height: $size,
    borderRadius: '50%',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 800,
    fontSize: $size * 0.38,
    lineHeight: 1,
    userSelect: 'none',
    ...glass(theme, { blur: 'sm', tint: 'strong', elevation: 1 }),
    borderWidth: 2,
  }),
  applySx,
);

const Image = styled.img({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
});

/** A person or thing, as a picture, initials, or — by default — one of the characters. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, children, character, mood, size = 'md', ...rest },
  ref,
) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const px = typeof size === 'number' ? size : SIZE[size];
  const showImage = Boolean(src) && !failed;
  // The fallback is not an <img>, so it needs its own accessible name.
  const fallbackLabel = showImage ? {} : alt ? { role: 'img', 'aria-label': alt } : {};

  return (
    <Root ref={ref} $size={px} {...fallbackLabel} {...rest}>
      {showImage ? (
        <Image src={src} alt={alt ?? ''} onError={() => setFailed(true)} />
      ) : children != null && children !== false ? (
        typeof children === 'string' ? (
          initials(children)
        ) : (
          children
        )
      ) : (
        <Character name={character} mood={mood} size={px * 0.8} />
      )}
    </Root>
  );
});
