import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import type { SVGAttributes } from 'react';
import { applySx, reducedMotion } from '../styling';
import type { SxProp } from '../styling';
import { useTheme } from '../theme/ThemeProvider';
import type { CharacterName } from '../theme/types';
import { EYE_CLASS, FaceFeatures } from './FaceFeatures';
import { getCharacter } from './registry';
import type { CharacterMood } from './types';

const blink = keyframes({
  '0%, 92%, 100%': { transform: 'scaleY(1)' },
  '95%': { transform: 'scaleY(0.1)' },
});

const Svg = styled.svg<SxProp & { $animated: boolean }>(
  {
    display: 'inline-block',
    flexShrink: 0,
    overflow: 'visible',
    verticalAlign: 'middle',
  },
  ({ $animated }) =>
    $animated && {
      [`.${EYE_CLASS}`]: {
        transformBox: 'fill-box',
        transformOrigin: 'center',
        animation: `${blink} 5.5s ease-in-out infinite`,
        [reducedMotion]: { animation: 'none' },
      },
    },
  applySx,
);

interface CharacterBaseProps extends Omit<SVGAttributes<SVGSVGElement>, 'name'>, SxProp {
  /** Which character to draw. Defaults to `theme.character.default`. */
  name?: CharacterName;
  mood?: CharacterMood;
  /** Blink every few seconds. */
  animated?: boolean;
  /** Accessible name. Without it the character is decorative and hidden from assistive technology. */
  title?: string;
}

export interface CharacterProps extends CharacterBaseProps {
  /** Width and height in px. */
  size?: number;
}

/** A character's head as an inline SVG. */
export function Character({ name, size = 64, mood = 'neutral', animated = true, title, ...rest }: CharacterProps) {
  const theme = useTheme();
  const { Head } = getCharacter(name ?? theme.character.default);
  return (
    <Svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      $animated={animated}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      <Head mood={mood} />
    </Svg>
  );
}

export interface CharacterFaceProps extends CharacterBaseProps {
  /** Width in px; the height follows the 60:26 aspect ratio. */
  width?: number;
}

/** Just the facial features (eyes, cheeks, mouth), for drawing a face on top of a surface. */
export function CharacterFace({ name, width = 96, mood = 'neutral', animated = true, title, ...rest }: CharacterFaceProps) {
  const theme = useTheme();
  const { colors, nose } = getCharacter(name ?? theme.character.default);
  return (
    <Svg
      viewBox="0 0 60 26"
      width={width}
      height={(width * 26) / 60}
      $animated={animated}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      <FaceFeatures cx={30} cy={9} spread={13} mood={mood} ink={colors.ink} cheek={colors.cheek} nose={nose} />
    </Svg>
  );
}
