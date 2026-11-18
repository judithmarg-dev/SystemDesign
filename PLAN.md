# PLAN — Mochi UI: tareas pendientes

Estado verificado el 2026-11-16. La sesión original (Fable) se cortó por el límite de uso antes de escribir un plan.
Este archivo es la fuente de verdad para continuar. Marca cada tarea `[x]` al terminarla.

## Estado actual

- Fases 1 y 2 completadas el 2026-11-16: `pnpm typecheck`, `pnpm test` (106/106), `pnpm build` y
  `pnpm build-storybook` en verde.
- 27 de 32 componentes del README existen; faltan 5 (Slider, Select, Accordion, AppBar, Pagination).

## Reglas que hay que respetar (ver README)

- Dependencias solo hacia abajo: `modules → core → shared`. `shared` no importa de nadie.
- Entre módulos se importa por carpeta pública (`@modules/inputs/Button`), nunca archivos internos.
- Cada componente en su carpeta: `Name.tsx`, `Name.stories.tsx`, `Name.test.tsx`, `index.ts`.
- `index.ts` del componente exporta valores y tipos por separado (`verbatimModuleSyntax` está activo):
  ```ts
  export { Chip } from './Chip';
  export type { ChipProps } from './Chip';
  ```
- Estilos con `@emotion/styled`, valores siempre desde el tema (`theme.spacing`, `theme.palette`, `theme.shape.radius`…),
  `applySx` como último estilo para soportar la prop `sx`, `forwardRef` en todos los componentes.
- Tests con `renderWithTheme` de `@core/testing`.
- Componentes sobre vidrio que aceptan personaje → construir sobre `GlassSurface` (`@core`), ver `Paper`/`Card`/`Modal`.
- Patrones de referencia: `Badge` (simple), `Switch`/`Checkbox` + `inputs/internal/choice.tsx` (controles),
  `TextField` + `inputs/internal/field.tsx` (campos), `Menu` (popover con `Portal`), `Tabs` (compuesto + teclado).
- Después de **cada** fase: `pnpm typecheck && pnpm test` en verde antes de seguir.

---

## Fase 1 — Arreglar lo que falla

### 1.1 Barrels de módulo faltantes
`src/index.ts` exporta `./modules/inputs`, `./modules/data-display`, `./modules/surfaces` y `./modules/navigation`,
pero solo `feedback/index.ts` y `layout/index.ts` existen. Crear (mismo formato que `feedback/index.ts`):

- [x] `src/modules/inputs/index.ts` → Button, IconButton, TextField, Checkbox, Radio, Switch (no exportar `internal`)
- [x] `src/modules/data-display/index.ts` → Typography, Avatar, Badge
- [x] `src/modules/surfaces/index.ts` → Paper, Card
- [x] `src/modules/navigation/index.ts` → Tabs, Breadcrumbs, Menu

Al agregar componentes nuevos en fases siguientes, añadirlos también a su barrel.

### 1.2 `Divider` usado antes de existir
`src/modules/layout/Stack/Stack.stories.tsx:2` importa `@modules/data-display/Divider`. Se resuelve con la tarea 2.1
(crear `Divider`). Hacer 2.1 inmediatamente después de 1.1 para dejar `typecheck` en verde.

### 1.3 Test roto de Grid
- [x] `src/modules/layout/Grid/Grid.test.tsx` → *"uses the xs value as the base for responsive columns"*:
  esperaba `gridTemplateColumns: repeat(1, minmax(0, 1fr))` y no recibe nada.
- La lógica de `responsive()` en `Grid.tsx` parece correcta (`xs` va al estilo base). Hipótesis a verificar:
  la regla con `@media` que emite Emotion hace que jsdom falle al parsear la hoja (`Could not parse CSS stylesheet`
  aparece 8 veces en la salida) y se pierde también el estilo base. Revisar qué devuelve `theme.breakpoints.up()`
  en `src/core/theme/createTheme.ts` (debe ser `@media (min-width: Npx)` válido).
- **Resuelto:** el componente estaba bien. jsdom evalúa los media queries contra una ventana de 1024px, así que
  `md` (900px) sí aplicaba. El test ahora usa `lg` (1200px). Tener esto en cuenta en cualquier test responsive.

### 1.4 Conflicto de nombres (encontrado al arreglar 1.1)
- [x] El tipo de tokens `Typography` de `core/theme/types.ts` chocaba con el componente `Typography` en `src/index.ts`.
  Renombrado a `TypographyTokens`.

### 1.5 Verificar
- [x] `pnpm typecheck` sin errores, `pnpm test` todo verde, `pnpm build` genera `dist/`.

---

## Fase 2 — data-display

- [x] **2.1 Divider** — `orientation: 'horizontal' | 'vertical'`, `variant: 'fullWidth' | 'inset' | 'middle'`,
  `flexItem`, contenido opcional en el medio (texto). `role="separator"` + `aria-orientation`. Color `palette.divider`.
- [x] **2.2 Chip** — `label`, `variant: 'filled' | 'soft' | 'outlined'`, `color` (paleta), `size: 'sm' | 'md'`,
  `icon`/`avatar` al inicio, `onDelete` (botón de borrar con `aria-label`), `onClick` → clickable y enfocable.
- [x] **2.3 Tooltip** — envuelve un único hijo, `title`, `placement` (top/bottom/start/end), aparece en hover y focus,
  se cierra con Escape, `aria-describedby` en el hijo, render en `Portal`, delay configurable. Superficie glass pequeña.
- [x] **2.4 List** — `List`, `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText` (primary/secondary),
  `ListSubheader`; `dense`, `disablePadding`, `selected` en `ListItemButton`.

Notas de Fase 2:
- `Tooltip` envuelve al hijo en un `span` (para hover/focus/posición) y solo clona el hijo para añadir
  `aria-describedby`; no necesita ref del hijo. Reutilizar su lógica de posicionamiento si Select la necesita.
- `ListItemButton` acepta `component="a"` (o un Link de router) y entonces no pone `type`.
- `vite.config.ts`: `src/core/testing.tsx` excluido de los `.d.ts` (rompía la generación de tipos).

## Fase 3 — inputs

- [ ] **3.1 Slider** — controlado y no controlado (`useControlled` de `@shared`), `min`, `max`, `step`, `marks`,
  `valueLabelDisplay`, `disabled`, teclado (flechas, Home/End, PageUp/PageDown), `role="slider"` con aria-valuenow/min/max.
  Pulgar con estética glass; opcional: personaje pequeño como pulgar.
- [ ] **3.2 Select** — reutilizar `inputs/internal/field.tsx` para label/helperText/error y el patrón de popover de
  `Menu` para la lista. `options` o hijos `<Option>`, `multiple` opcional, teclado completo (flechas, Enter, Escape,
  typeahead), `role="combobox"` + `listbox`/`option`, `aria-expanded`, `aria-activedescendant`.

## Fase 4 — surfaces y navigation

- [ ] **4.1 Accordion** — `Accordion`, `AccordionSummary`, `AccordionDetails`; `expanded`/`defaultExpanded`/`onChange`,
  `disabled`, botón con `aria-expanded` + `aria-controls`, región con `role="region"`. Animar altura con `transform`/
  `grid-template-rows`, no `opacity` (ver nota de `backdrop-filter` en README). Sobre `GlassSurface`, acepta personaje.
- [ ] **4.2 AppBar** — `position: 'static' | 'sticky' | 'fixed'`, `color`, glass con blur, acepta personaje `peek`.
  Incluir `Toolbar` para alinear contenido.
- [ ] **4.3 Pagination** — `count`, `page`/`defaultPage`/`onChange`, `siblingCount`, `boundaryCount`, elipsis,
  botones prev/next, `size`, `variant`. `nav` con `aria-label`, página actual con `aria-current="page"`.

## Fase 5 — Cierre

- [ ] **5.1** Tests faltantes: `feedback/Skeleton/Skeleton.test.tsx`, `surfaces/Paper/Paper.test.tsx`.
- [ ] **5.2** Revisar que cada componente nuevo esté en su barrel y que `src/index.ts` exporte todo.
- [ ] **5.3** Actualizar README si alguna API difiere de lo documentado.
- [ ] **5.4** Verificación final: `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm build-storybook` sin errores.

## Fase 6 — Distribución (usar Mochi UI en otros proyectos)

Modelo elegido: **paquete** (como MUI), no copiar código (modelo shadcn) — los componentes dependen de `core`.
`package.json` ya expone `main`/`module`/`types`/`exports` hacia `dist/`.

- [ ] **6.1 Revisar el paquete** — `pnpm build` y luego `pnpm pack --dry-run`: confirmar que solo entra `dist/` +
  README + package.json, que `dist/index.d.ts` existe y que react, react-dom y emotion siguen como `peerDependencies`
  (no se empaquetan en el bundle; revisar `rollupOptions.external` en `vite.config.ts`).
- [ ] **6.2 Prueba local** — `pnpm pack` → crear una app Vite mínima fuera del repo → `pnpm add <ruta>/mochi-ui-0.1.0.tgz`
  → renderizar `ThemeProvider` + `CssBaseline` + Button + Modal con personaje. Verificar tipos en el editor,
  tree-shaking (`sideEffects: false`) y que funcione con React 18 y 19.
- [ ] **6.3 Versionado** — semver: `0.x` mientras la API cambie. Agregar `CHANGELOG.md`. Script `prepublishOnly`:
  `pnpm typecheck && pnpm test && pnpm build`.
- [ ] **6.4 Registry** — decidir dónde publicar (GitHub Packages / Azure Artifacts si es interno, npm si es público).
  Si el nombre `mochi-ui` está tomado en npm, usar un scope (`@org/mochi-ui`). Configurar `publishConfig` y `.npmrc`.
- [ ] **6.5 Documentación** — desplegar Storybook (`pnpm build-storybook`) como sitio estático (GitHub Pages,
  Netlify, etc.). Es el equivalente a la doc de MUI. Añadir una página "Getting started" en Storybook con: instalación,
  peer deps, `ThemeProvider` obligatorio y carga de la fuente Nunito.
- [ ] **6.6 CI** (opcional) — pipeline que corra typecheck, test y build en cada PR, y publique al crear un tag `v*`.

Requisitos para el proyecto consumidor (documentar en README): instalar `react`, `react-dom`, `@emotion/react`,
`@emotion/styled`; envolver la app en `ThemeProvider`; cargar Nunito.

## Opcional (no bloquea)

- El aviso `Could not parse CSS stylesheet` en tests: si no se resolvió en 1.3, investigar qué regla lo provoca.
- Vitest sugiere `pool: 'vmThreads'` para no recrear jsdom en cada archivo (los tests tardan ~40 s).
