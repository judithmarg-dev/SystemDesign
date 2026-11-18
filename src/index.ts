// Core: theme, glass styling, characters and the base surface.
export * from './core';

// Modules: components grouped by what they are for.
export * from './modules/inputs';
export * from './modules/data-display';
export * from './modules/feedback';
export * from './modules/surfaces';
export * from './modules/navigation';
export * from './modules/layout';

// Shared building blocks that are useful to consumers too.
export { Portal, VisuallyHidden, alpha, darken, lighten, mix, mergeRefs, useControlled } from './shared';
export type { PortalProps, DeepPartial } from './shared';
