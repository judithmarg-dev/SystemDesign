import styled from '@emotion/styled';
import { createContext, forwardRef, useContext, useId, useMemo } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';
import { GlassSurface, applySx, focusRing, reducedMotion, transition } from '@core';
import type { GlassSurfaceProps, SxProp } from '@core';
import { useControlled } from '@shared';

interface AccordionContextValue {
  expanded: boolean;
  disabled: boolean;
  toggle: (event: SyntheticEvent) => void;
  summaryId: string;
  detailsId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion(component: string): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) throw new Error(`<${component}> must be rendered inside <Accordion>.`);
  return context;
}

/* -------------------------------- Accordion ------------------------------- */

export interface AccordionProps extends Omit<GlassSurfaceProps, 'onChange'> {
  /** Open state (controlled). */
  expanded?: boolean;
  /** Initial open state (uncontrolled). */
  defaultExpanded?: boolean;
  /** Called when the summary is toggled. */
  onChange?: (event: SyntheticEvent, expanded: boolean) => void;
  disabled?: boolean;
  /** `AccordionSummary` followed by `AccordionDetails`. */
  children?: ReactNode;
}

const AccordionRoot = styled(GlassSurface)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  // Stacked accordions sit a little apart, so each glass panel reads on its own.
  '& + &': { marginTop: theme.spacing(1.5) },
}));

/**
 * A glass panel that shows a summary and expands to reveal its details.
 * Accepts the character frame props of every surface.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { expanded: expandedProp, defaultExpanded = false, onChange, disabled = false, radius = 'md', elevation = 1, children, ...rest },
  ref,
) {
  const id = useId();
  const [expanded, setExpanded] = useControlled(expandedProp, defaultExpanded);

  const context = useMemo<AccordionContextValue>(
    () => ({
      expanded,
      disabled,
      summaryId: `${id}-summary`,
      detailsId: `${id}-details`,
      toggle: (event) => {
        if (disabled) return;
        setExpanded(!expanded);
        onChange?.(event, !expanded);
      },
    }),
    [expanded, disabled, id, setExpanded, onChange],
  );

  return (
    <AccordionContext.Provider value={context}>
      <AccordionRoot ref={ref} radius={radius} elevation={elevation} {...rest}>
        {children}
      </AccordionRoot>
    </AccordionContext.Provider>
  );
});

/* ----------------------------- AccordionSummary ---------------------------- */

export interface AccordionSummaryProps extends ButtonHTMLAttributes<HTMLButtonElement>, SxProp {
  /** Icon at the end of the summary. Defaults to a chevron; pass `null` to hide it. */
  expandIcon?: ReactNode;
  /** Heading level wrapping the button, so the accordion shows up in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const Heading = styled.h3({ margin: 0, font: 'inherit' });

const SummaryButton = styled.button<SxProp>(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    width: '100%',
    minHeight: 52,
    padding: theme.spacing(1.5, 2.5),
    border: 0,
    borderRadius: 'inherit',
    background: 'transparent',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    ...theme.typography.subtitle1,
    textAlign: 'start',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    transition: transition(theme, ['background-color']),
    [reducedMotion]: { transition: 'none' },
    '&:hover': { background: theme.palette.action.hover },
    '&:focus-visible': focusRing(theme),
    '&:disabled': { cursor: 'not-allowed', color: theme.palette.text.disabled, background: 'transparent' },
  }),
  applySx,
);

const SummaryContent = styled.span({ flex: 1, minWidth: 0 });

const ExpandIcon = styled.span<{ $expanded: boolean }>(({ theme, $expanded }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  color: theme.palette.text.secondary,
  transform: $expanded ? 'rotate(180deg)' : 'none',
  transition: transition(theme, ['transform'], { duration: 'medium', easing: 'bounce' }),
  [reducedMotion]: { transition: 'none' },
  '& > svg': { width: '1.25em', height: '1.25em' },
}));

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const AccordionSummary = forwardRef<HTMLButtonElement, AccordionSummaryProps>(function AccordionSummary(
  { expandIcon = <Chevron />, headingLevel = 3, onClick, children, ...rest },
  ref,
) {
  const accordion = useAccordion('AccordionSummary');
  return (
    <Heading as={`h${headingLevel}`}>
      <SummaryButton
        ref={ref}
        type="button"
        id={accordion.summaryId}
        aria-expanded={accordion.expanded}
        aria-controls={accordion.detailsId}
        disabled={accordion.disabled}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) accordion.toggle(event);
        }}
        {...rest}
      >
        <SummaryContent>{children}</SummaryContent>
        {expandIcon !== null && (
          <ExpandIcon $expanded={accordion.expanded} aria-hidden>
            {expandIcon}
          </ExpandIcon>
        )}
      </SummaryButton>
    </Heading>
  );
});

/* ----------------------------- AccordionDetails ---------------------------- */

export interface AccordionDetailsProps extends HTMLAttributes<HTMLDivElement>, SxProp {}

// Animates the row height from 0fr to 1fr. No opacity: it would switch off the backdrop blur of the panel.
const Collapse = styled.div<{ $expanded: boolean }>(({ theme, $expanded }) => ({
  display: 'grid',
  gridTemplateRows: $expanded ? '1fr' : '0fr',
  visibility: $expanded ? 'visible' : 'hidden',
  transition: `${transition(theme, ['grid-template-rows'], { duration: 'medium' })}, visibility 0s linear ${
    $expanded ? 0 : theme.motion.duration.medium
  }ms`,
  [reducedMotion]: { transition: 'none' },
}));

const CollapseInner = styled.div({ overflow: 'hidden', minHeight: 0 });

const DetailsRoot = styled.div<SxProp>(
  ({ theme }) => ({
    padding: theme.spacing(0, 2.5, 2.5),
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
  }),
  applySx,
);

export const AccordionDetails = forwardRef<HTMLDivElement, AccordionDetailsProps>(function AccordionDetails(props, ref) {
  const accordion = useAccordion('AccordionDetails');
  return (
    <Collapse $expanded={accordion.expanded}>
      <CollapseInner>
        <DetailsRoot
          ref={ref}
          id={accordion.detailsId}
          role="region"
          aria-labelledby={accordion.summaryId}
          {...props}
        />
      </CollapseInner>
    </Collapse>
  );
});
