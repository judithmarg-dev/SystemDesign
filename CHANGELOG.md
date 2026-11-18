# Changelog

All notable changes to Mochi UI are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).
While the version is `0.x`, minor versions may include breaking API changes.

## [Unreleased]

## [0.1.0] - 2026-11-18

First release.

### Added

- **Core**: `createTheme`, `ThemeProvider`, `CssBaseline`, light ("autumn day") and dark ("cozy night") modes,
  the `glass()` styling recipe, `sx` prop, `GlassSurface` with `peek` and `silhouette` characters.
- **Characters**: bear, squirrel, hedgehog, mushroom, acorn and apple, plus the `Leaf` and `Flower` decorations.
- **Inputs**: Button, IconButton, TextField, Checkbox, Radio, Switch, Slider, Select (with `Option`).
- **Data display**: Typography, Avatar, Badge, Chip, Divider, Tooltip, List.
- **Feedback**: Modal, Alert, Snackbar, LinearProgress, CircularProgress, Skeleton.
- **Surfaces**: Paper, Card, Accordion, AppBar (with `Toolbar`).
- **Navigation**: Tabs, Breadcrumbs, Menu, Pagination (with `getPaginationItems`).
- **Layout**: Box, Stack, Container, Grid.
- `GlassSurface` (and every surface built on it) accepts `component` to render a landmark element such as `header`
  or `section`.
- Package ships ESM and CJS, one file per module, so bundlers tree-shake the components you don't import.
