import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { applySx } from '@core';
import type { ColorName, MochiTheme, SxProp, TypographyVariant } from '@core';

export type TypographyColor = ColorName | 'textPrimary' | 'textSecondary' | 'inherit';

export interface TypographyProps extends Omit<HTMLAttributes<HTMLElement>, 'color'>, SxProp {
  /** Text style from `theme.typography`. */
  variant?: TypographyVariant;
  /** Element to render. Defaults to the semantic tag for the variant (`h1`–`h6`, `p`, `span`). */
  component?: ElementType;
  color?: TypographyColor;
  align?: CSSProperties['textAlign'];
  /** Truncates the text to one line with an ellipsis. */
  noWrap?: boolean;
  /** Adds a bottom margin. */
  gutterBottom?: boolean;
}

const TAG: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  body1: 'p',
  body2: 'p',
  button: 'span',
  caption: 'span',
  overline: 'span',
};

const resolveColor = (theme: MochiTheme, color: TypographyColor): string => {
  if (color === 'inherit') return 'inherit';
  if (color === 'textPrimary') return theme.palette.text.primary;
  if (color === 'textSecondary') return theme.palette.text.secondary;
  // The `main` shades are too light for text on light glass, so use the readable companion.
  return theme.mode === 'dark' ? theme.palette[color].light : theme.palette[color].dark;
};

interface RootProps extends SxProp {
  $variant: TypographyVariant;
  $color: TypographyColor;
  $align: TypographyProps['align'];
  $noWrap: boolean;
  $gutterBottom: boolean;
}

const Root = styled.span<RootProps>(
  ({ theme, $variant, $color, $align, $noWrap, $gutterBottom }) => ({
    margin: 0,
    fontFamily: theme.typography.fontFamily,
    ...theme.typography[$variant],
    color: resolveColor(theme, $color),
    textAlign: $align,
    marginBottom: $gutterBottom ? '0.4em' : undefined,
    ...($noWrap && { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
  }),
  applySx,
);

/** Text in one of the theme's type styles. */
export const Typography = forwardRef<HTMLElement, TypographyProps>(function Typography(
  { variant = 'body1', component, color = 'inherit', align, noWrap = false, gutterBottom = false, ...rest },
  ref,
) {
  return (
    <Root
      as={component ?? TAG[variant]}
      ref={ref as never}
      $variant={variant}
      $color={color}
      $align={align}
      $noWrap={noWrap}
      $gutterBottom={gutterBottom}
      {...rest}
    />
  );
});
