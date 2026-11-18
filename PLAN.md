# PLAN — Mochi UI: tareas pendientes

Estado verificado el 2026-11-16. La sesión original (Fable) se cortó por el límite de uso antes de escribir un plan.
Este archivo es la fuente de verdad para continuar. Marca cada tarea `[x]` al terminarla.

## Estado actual

- Fases 1 a 5 completadas y Fase 6 casi completa (2026-11-18): `pnpm typecheck`, `pnpm test` (145/145),
  `pnpm build` y `pnpm build-storybook` en verde. Los 32 componentes del README existen.
- Pendiente: **6.4** (decidir registry → luego job de publicación en CI) y el aviso opcional de CSS en tests.

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

- [x] **3.1 Slider** — controlado y no controlado (`useControlled` de `@shared`), `min`, `max`, `step`, `marks`,
  `valueLabelDisplay`, `disabled`, teclado (flechas, Home/End, PageUp/PageDown), `role="slider"` con aria-valuenow/min/max.
  Pulgar con estética glass; opcional: personaje pequeño como pulgar.
- [x] **3.2 Select** — reutilizar `inputs/internal/field.tsx` para label/helperText/error y el patrón de popover de
  `Menu` para la lista. `options` o hijos `<Option>`, `multiple` opcional, teclado completo (flechas, Enter, Escape,
  typeahead), `role="combobox"` + `listbox`/`option`, `aria-expanded`, `aria-activedescendant`.

## Fase 4 — surfaces y navigation

- [x] **4.1 Accordion** — `Accordion`, `AccordionSummary`, `AccordionDetails`; `expanded`/`defaultExpanded`/`onChange`,
  `disabled`, botón con `aria-expanded` + `aria-controls`, región con `role="region"`. Animar altura con `transform`/
  `grid-template-rows`, no `opacity` (ver nota de `backdrop-filter` en README). Sobre `GlassSurface`, acepta personaje.
- [x] **4.2 AppBar** — `position: 'static' | 'sticky' | 'fixed'`, `color`, glass con blur, acepta personaje `peek`.
  Incluir `Toolbar` para alinear contenido.
- [x] **4.3 Pagination** — `count`, `page`/`defaultPage`/`onChange`, `siblingCount`, `boundaryCount`, elipsis,
  botones prev/next, `size`, `variant`. `nav` con `aria-label`, página actual con `aria-current="page"`.

Notas de Fases 3–4:
- `Slider`: un solo pulgar, `onChangeCommitted` al soltar o tras cada tecla, `name` crea un input oculto.
- `Select`: genérico en el tipo de valor; `options` o hijos `<Option>`; typeahead con reinicio a 600 ms.
- `Accordion` anima `grid-template-rows` y oculta el contenido con `visibility` (no queda enfocable cerrado).
- `AppBar` usa la nueva prop `component` de `GlassSurface` para renderizar `<header>` (landmark banner).

## Fase 5 — Cierre

- [x] **5.1** Tests faltantes: `feedback/Skeleton/Skeleton.test.tsx`, `surfaces/Paper/Paper.test.tsx`.
- [x] **5.2** Revisar que cada componente nuevo esté en su barrel y que `src/index.ts` exporte todo.
- [x] **5.3** Actualizar README si alguna API difiere de lo documentado.
- [x] **5.4** Verificación final: `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm build-storybook` sin errores.

## Fase 6 — Distribución (usar Mochi UI en otros proyectos)

Resultado (2026-11-18):
- 6.1: el bundle único **no** permitía tree-shaking. Ahora `vite.config.ts` emite un archivo por módulo
  (`preserveModules`), entradas `dist/index.js` / `dist/index.cjs`. En una app de prueba el bundle bajó de 339 kB a 208 kB.
- 6.1: el CJS fallaba con `require()` (`styled.span is not a function`, interop de Rolldown en modo Node). Arreglado con
  el plugin `cjsInterop` de `vite.config.ts`. Verificado con SSR en Node (CJS y ESM).
- 6.2: app Vite de prueba con el `.tgz`: tipos estrictos (`skipLibCheck: false`) y build OK con React 18.3 y 19.3.
- 6.5: página *Getting started* como story (no hay addon-docs instalado). Despliegue: job `docs` del CI.
- 6.6: `.github/workflows/ci.yml` (verify en PR/main + Storybook a GitHub Pages). Falta el job de publicación (depende de 6.4).

Modelo elegido: **paquete** (como MUI), no copiar código (modelo shadcn) — los componentes dependen de `core`.
`package.json` ya expone `main`/`module`/`types`/`exports` hacia `dist/`.

- [x] **6.1 Revisar el paquete** — `pnpm build` y luego `pnpm pack --dry-run`: confirmar que solo entra `dist/` +
  README + package.json, que `dist/index.d.ts` existe y que react, react-dom y emotion siguen como `peerDependencies`
  (no se empaquetan en el bundle; revisar `rollupOptions.external` en `vite.config.ts`).
- [x] **6.2 Prueba local** — `pnpm pack` → crear una app Vite mínima fuera del repo → `pnpm add <ruta>/mochi-ui-0.1.0.tgz`
  → renderizar `ThemeProvider` + `CssBaseline` + Button + Modal con personaje. Verificar tipos en el editor,
  tree-shaking (`sideEffects: false`) y que funcione con React 18 y 19.
- [x] **6.3 Versionado** — semver: `0.x` mientras la API cambie. Agregar `CHANGELOG.md`. Script `prepublishOnly`:
  `pnpm typecheck && pnpm test && pnpm build`.
- [ ] **6.4 Registry** — decidir dónde publicar (GitHub Packages / Azure Artifacts si es interno, npm si es público).
  Si el nombre `mochi-ui` está tomado en npm, usar un scope (`@org/mochi-ui`). Configurar `publishConfig` y `.npmrc`.
- [x] **6.5 Documentación** — desplegar Storybook (`pnpm build-storybook`) como sitio estático (GitHub Pages,
  Netlify, etc.). Es el equivalente a la doc de MUI. Añadir una página "Getting started" en Storybook con: instalación,
  peer deps, `ThemeProvider` obligatorio y carga de la fuente Nunito.
- [x] **6.6 CI** (opcional) — pipeline que corra typecheck, test y build en cada PR, y publique al crear un tag `v*`.

Requisitos para el proyecto consumidor (documentar en README): instalar `react`, `react-dom`, `@emotion/react`,
`@emotion/styled`; envolver la app en `ThemeProvider`; cargar Nunito.

## Opcional (no bloquea)

- [x] Vitest con `pool: 'vmThreads'` (tests de ~24 s a ~14 s).
- [ ] El aviso `Could not parse CSS stylesheet` (8 veces) en tests: sigue sin identificarse la regla; no afecta resultados.

