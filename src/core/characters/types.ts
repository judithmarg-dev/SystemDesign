import type { ComponentType } from 'react';
import type { CharacterName } from '../theme/types';
import type { Pen } from './geometry';

export type CharacterMood = 'neutral' | 'happy' | 'sleepy' | 'surprised';

export interface CharacterColors {
  /** Main body color. */
  base: string;
  /** Darker companion: outlines of paws, spikes, caps. */
  shade: string;
  /** Lighter companion: inner ears, muzzle, spots. */
  accent: string;
  cheek: string;
  /** Eyes, nose and mouth. */
  ink: string;
  /** Color the glass is tinted with in the silhouette variant. */
  tint: string;
}

export interface SilhouetteContext {
  /** Panel width in px. */
  w: number;
  /** Panel height in px. */
  h: number;
  /** Panel corner radius in px. */
  r: number;
  /** Feature unit in px: ears, caps and tails scale with it. */
  u: number;
}

export interface SilhouetteSpec {
  /**
   * Closed, clockwise subpaths that are unioned with the panel's rounded rectangle to form the outline.
   * They must all wind clockwise so the non-zero fill rule produces a union.
   */
  shapes: string[];
  /** How far the shapes reach outside the panel on each side, in px. */
  overflow: { top: number; right: number; bottom: number; left: number };
  /** Extra space to reserve at the top of the panel for features that overlap it (caps). */
  insetTop: number;
}

export interface SilhouetteDetailsProps extends SilhouetteContext {
  colors: CharacterColors;
  /** `url(#…)` reference to a clip path covering everything outside the panel body. */
  outsideClip: string;
}

export interface CharacterDefinition {
  name: CharacterName;
  label: string;
  colors: CharacterColors;
  /** Whether the face has a nose (animals) or just a mouth (plants). */
  nose: boolean;
  /**
   * Height (0–100, in the head's viewBox) at which a panel edge crosses the head in the peek variant.
   * Everything above it shows over the edge, so it sits just below the mouth.
   */
  peekLine: number;
  /** Full head, drawn in a 100×100 viewBox. Used for avatars, thumbs and the peek variant. */
  Head: ComponentType<{ mood: CharacterMood }>;
  /** Outline features for the silhouette variant, in panel coordinates. */
  silhouette: (ctx: SilhouetteContext, pen: Pen) => SilhouetteSpec;
  /** Opaque details drawn over the silhouette (inner ears, cap spots…), in panel coordinates. */
  SilhouetteDetails: ComponentType<SilhouetteDetailsProps>;
}
