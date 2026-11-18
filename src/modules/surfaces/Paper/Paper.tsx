import styled from '@emotion/styled';
import { GlassSurface } from '@core';
import type { GlassSurfaceProps } from '@core';

export interface PaperProps extends GlassSurfaceProps {
  /** Inner padding, in spacing units. */
  padding?: number;
}

const PaperRoot = styled(GlassSurface, { shouldForwardProp: (prop) => prop !== 'padding' })<PaperProps>(
  ({ theme, padding = 3 }) => ({ padding: theme.spacing(padding) }),
);

/** A plain frosted-glass sheet. The simplest surface; optionally framed by a character. */
export const Paper = PaperRoot;
