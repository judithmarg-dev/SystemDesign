# Mochi UI

Design system para React con estética **glassmorphism + personajes cute**, inspirado en Material UI y Material Design.
Los componentes no solo tienen bordes redondeados: un personaje puede asomarse por el borde (`peek`) o darle su forma
al contenedor entero (`silhouette`).

```tsx
import { ThemeProvider, CssBaseline, createTheme, Modal, Button } from 'mochi-ui';

const theme = createTheme({ mode: 'light', character: { default: 'bear' } });

export function App() {
  const [open, setOpen] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button character onClick={() => setOpen(true)}>Abrir</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="¿Guardar tus bellotas?"
        character="squirrel"
        characterVariant="silhouette"
        actions={<Button onClick={() => setOpen(false)}>Guardar</Button>}
      >
        Se acerca el invierno.
      </Modal>
    </ThemeProvider>
  );
}
```

`ThemeProvider` es obligatorio: los componentes leen todos sus valores del tema. La tipografía por defecto es
[Nunito](https://fonts.google.com/specimen/Nunito); cárgala en tu app (el sistema no la descarga por ti).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Storybook en `http://localhost:6006` |
| `pnpm test` | Tests con Vitest + Testing Library |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` | Bundle de librería (ESM + CJS + tipos) en `dist/` |
| `pnpm build-storybook` | Storybook estático |

## Arquitectura

Screaming architecture + modular: las carpetas dicen para qué sirve cada cosa, no qué tecnología usa.

```
src/
├─ core/                 El motor del sistema. No conoce ningún componente concreto.
│  ├─ theme/             Tokens, createTheme, ThemeProvider, CssBaseline
│  ├─ styling/           Receta glass(), focusRing(), transition(), prop sx
│  ├─ characters/        Personajes SVG, registro, geometría de siluetas, decoraciones
│  └─ surface/           GlassSurface: el panel de vidrio que aloja a un personaje
├─ modules/              Componentes agrupados por propósito (como la navegación de MUI)
│  ├─ inputs/            Button, IconButton, TextField, Checkbox, Radio, Switch, Slider, Select
│  ├─ data-display/      Typography, Avatar, Badge, Chip, Divider, Tooltip, List
│  ├─ feedback/          Modal, Alert, Snackbar, LinearProgress, CircularProgress, Skeleton
│  ├─ surfaces/          Paper, Card, Accordion, AppBar
│  ├─ navigation/        Tabs, Breadcrumbs, Menu, Pagination
│  └─ layout/            Box, Stack, Container, Grid
├─ shared/               Utilidades sin opinión visual: hooks, color, refs, Portal
└─ index.ts              API pública
```

Regla de dependencias (siempre hacia abajo):

```
modules  →  core  →  shared
```

- `shared` no importa de nadie.
- `core` solo importa de `shared`.
- Un módulo importa de `core` y `shared`. Si necesita un componente de otro módulo, lo importa por su carpeta pública
  (`@modules/inputs/Button`), nunca por archivos internos.
- Cada componente vive en su carpeta: `Name.tsx`, `Name.stories.tsx`, `Name.test.tsx`, `index.ts`.

## Tema

`createTheme(options)` devuelve un tema completo; cualquier token se puede sobrescribir en profundidad.

| Grupo | Contenido |
| --- | --- |
| `palette` | `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral` (cada uno con `main`, `light`, `dark`, `contrastText`, `soft`), más `text`, `background`, `divider`, `action`, `scrim` |
| `glass` | `blur` (sm/md/lg), `tint` (subtle/regular/strong), `border`, `highlight`, `saturation` |
| `shape.radius` | `xs` 8 · `sm` 12 · `md` 18 · `lg` 26 · `xl` 36 · `pill` |
| `spacing` | `theme.spacing(2)` → `16px` |
| `typography` | `h1`–`h6`, `subtitle1`, `body1`, `body2`, `button`, `caption`, `overline` |
| `shadows` | Elevaciones 0–5 |
| `motion` | Duraciones y curvas; `bounce` es la curva "blandita" del sistema |
| `character.default` | Personaje que se usa cuando un componente recibe `character` sin nombre |

Modos: `light` ("día de otoño") y `dark` ("noche acogedora").

## Personajes

`bear`, `squirrel`, `hedgehog`, `mushroom`, `acorn`, `apple`, más las decoraciones `Leaf` y `Flower`.
Son SVG originales dibujados para este sistema.

Los componentes basados en `GlassSurface` (Paper, Card, Modal, Alert, Menu…) aceptan:

| Prop | Valores | |
| --- | --- | --- |
| `character` | nombre · `true` · `false` | `true` usa `theme.character.default` |
| `characterVariant` | `peek` · `silhouette` | Asomado por el borde, o el panel con la forma del personaje |
| `characterPlacement` | `start` · `center` · `end` | Solo `peek` |
| `characterSize` | `sm` · `md` · `lg` | |
| `mood` | `neutral` · `happy` · `sleepy` · `surprised` | |

Los personajes son decorativos: quedan ocultos para lectores de pantalla y no reciben eventos de puntero.

### Cosas a tener en cuenta

- Las decoraciones se dibujan **fuera** de la caja del panel (arriba, y a un lado en el caso de la cola de la ardilla).
  Deja espacio alrededor y evita `overflow: hidden` en el contenedor padre.
- `backdrop-filter` deja de ver lo que hay detrás si un ancestro tiene `opacity < 1`, `filter` o `transform` animado
  con opacidad. Para animar la entrada de una superficie glass, anima `transform`, no `opacity`.
- La variante `silhouette` mide el panel con `ResizeObserver`; en el primer render (y en SSR) se muestra el panel
  redondeado normal y la silueta aparece al hidratar.

### Añadir un personaje

1. Crea `src/core/characters/definitions/<nombre>.tsx` exportando un `CharacterDefinition`: colores, `Head`
   (viewBox 100×100), `peekLine`, `silhouette()` y `SilhouetteDetails`.
2. Regístralo en `registry.ts` y añade el nombre a `CharacterName` en `core/theme/types.ts`.

Las formas de `silhouette()` deben ser trazados cerrados en sentido horario (usa el `Pen`), porque se unen con el
rectángulo del panel mediante la regla de relleno non-zero.
