import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { GlassSurface, applySx, reducedMotion, transition } from '@core';
import type { GlassSurfaceProps, SxProp } from '@core';

export interface CardProps extends GlassSurfaceProps {
  /** Lifts the card on hover, for cards that act as a link or button target. */
  interactive?: boolean;
}

const CardRoot = styled(GlassSurface, { shouldForwardProp: (prop) => prop !== '$interactive' })<{ $interactive: boolean }>(
  ({ theme, $interactive }) =>
    $interactive && {
      // Transform only: it keeps the backdrop blur intact while animating.
      transition: transition(theme, ['transform'], { duration: 'medium', easing: 'bounce' }),
      '&:hover': { transform: 'translateY(-4px)' },
      [reducedMotion]: { transition: 'none', '&:hover': { transform: 'none' } },
    },
);

/**
 * A glass container for one subject: media, text and actions. Compose it from CardHeader, CardMedia,
 * CardContent and CardActions. Accepts the character frame props of every surface.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ interactive = false, ...rest }, ref) {
  return <CardRoot ref={ref} $interactive={interactive} {...rest} />;
});

/* --------------------------------- header --------------------------------- */

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SxProp {
  title?: ReactNode;
  subheader?: ReactNode;
  /** Element shown before the title, usually an Avatar. */
  avatar?: ReactNode;
  /** Element shown at the end, usually an IconButton. */
  action?: ReactNode;
}

const HeaderRoot = styled.div<SxProp>(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2, 2.5),
  }),
  applySx,
);

const HeaderText = styled.div({ flex: 1, minWidth: 0 });
const HeaderTitle = styled.div(({ theme }) => ({ ...theme.typography.h6 }));
const HeaderSub = styled.div(({ theme }) => ({ ...theme.typography.body2, color: theme.palette.text.secondary }));
const HeaderSlot = styled.div({ display: 'flex', flexShrink: 0 });

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { title, subheader, avatar, action, ...rest },
  ref,
) {
  return (
    <HeaderRoot ref={ref} {...rest}>
      {avatar && <HeaderSlot>{avatar}</HeaderSlot>}
      <HeaderText>
        {title && <HeaderTitle>{title}</HeaderTitle>}
        {subheader && <HeaderSub>{subheader}</HeaderSub>}
      </HeaderText>
      {action && <HeaderSlot>{action}</HeaderSlot>}
    </HeaderRoot>
  );
});

/* ---------------------------------- media --------------------------------- */

export interface CardMediaProps extends ImgHTMLAttributes<HTMLImageElement>, SxProp {
  /** Text alternative. Pass an empty string for purely decorative images. */
  alt: string;
  /** Image height in px. */
  height?: number;
}

const MediaRoot = styled.img<SxProp & { $height: number }>(
  ({ theme, $height }) => ({
    display: 'block',
    // Inset from the card edge so the image's rounded corners echo the card's.
    width: `calc(100% - ${theme.spacing(3)})`,
    height: $height,
    margin: theme.spacing(1.5, 1.5, 0),
    objectFit: 'cover',
    borderRadius: theme.shape.radius.md,
    '&:last-child': { marginBottom: theme.spacing(1.5) },
  }),
  applySx,
);

export const CardMedia = forwardRef<HTMLImageElement, CardMediaProps>(function CardMedia({ height = 160, ...rest }, ref) {
  return <MediaRoot ref={ref} $height={height} {...rest} />;
});

/* ----------------------------- content / actions -------------------------- */

export const CardContent = styled.div<SxProp>(
  ({ theme }) => ({
    padding: theme.spacing(2, 2.5),
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    // Sits closer to a header above it.
    [`${HeaderRoot} + &`]: { paddingTop: 0 },
  }),
  applySx,
);

export const CardActions = styled.div<SxProp>(
  ({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0, 2, 2),
  }),
  applySx,
);
