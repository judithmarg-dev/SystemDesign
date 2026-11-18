import styled from '@emotion/styled';

/** Hides content visually while keeping it available to assistive technology. */
export const VisuallyHidden = styled.span({
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
});
