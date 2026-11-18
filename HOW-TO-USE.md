Hay dos formas de reutilizar componentes. Material UI usa la primera, aunque su documentación te deje copiar ejemplos.

1. Como paquete (el modelo de MUI)

El otro proyecto instala la librería y la importa:
pnpm add mochi-ui
import { ThemeProvider, createTheme, Button } from 'mochi-ui';
Los ejemplos de la documentación de MUI se copian, pero el código del componente vive en node_modules. Cuando la librería sale en otra versión, actualizas con un comando.

Tu proyecto ya está preparado para esto: package.json define main, module, types y exports apuntando a dist/, y pnpm build genera ESM, CJS y los tipos. Solo falta decidir cómo distribuirlo:

┌──────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────┐
│                    Opción                    │          Cuándo usarla          │                            Cómo                             │
├──────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Monorepo (pnpm workspaces)                   │ La app y la librería viven en   │ "mochi-ui": "workspace:*"                                   │
│                                              │ el mismo                                                         │
├──────────────────────────────────────────────┼─────────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Dependencia git                              │ Pocos pro add git+https://…/mochi-ui.git#v0.1.0 (necesita        │
│                                              │                                 │ prepare: pnpm build)                                        │
├──────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Registry privado (GitHub Packages, Azure     │ Uso dentro de la empresa        │ pnpm publish a ese registry                                 │
│ Artifacts, Verdaccio)                        │                                                                  │
├──────────────────────────────────────────────┼─────────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ npm público                                  │ Quieres q publish                                                │
├──────────────────────────────────────────────┼─────────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Prueba local                                 │ Probarlo  pack → pnpm add ../SystemDesign/mochi-ui-0.1.0.tgz     │
└──────────────────────────────────────────────┴─────────────────────────────────┴─────────────────────────────────────────────────────────────┘

Qué necesita el proyecto que lo usa
- Dependencias compartidas: react, react-dom, @emotion/rearDependencies, así que las pone el proyecto y no seduplican.
- ThemeProvider: envolver la app con él, porque los compon
- Fuente Nunito: cargarla; el README lo indica.
- Nada más. Los personajes son SVG dentro del código, así

2. Copiar el código (el modelo de shadcn/ui)

Esto es lo que probablemente tenías en mente: un comando oa el archivo del componente dentro del proyecto, que pasa aser dueño de ese código.
- Ventaja: puedes modificarlo sin límites.
- Desventaja: no recibe actualizaciones y cada proyecto termina con su propia versión.

En tu caso sería más difícil, porque cada componente depende de @core: tema, GlassSurface, personajes, applySx. Habría que copiar core siempre, y
eso es casi la librería entera.

Mi recomendación

Usarlo como paquete. Para el uso interno en tu equipo:
1. Ahora: probarlo en otra app con pnpm pack.
2. Después: publicarlo en un registry privado (GitHub Packages si usan GitHub) con versiones semver.
3. Mientras tanto, dejar Storybook como documentación, con pnpm build-storybook desplegado en un sitio estático. Cumple el papel de la documentación de MUI, donde se ven los componentes y se copian los ejemplos de uso.

Si quieres, agrego una fase "Distribución" al PLAN.md, o preparo ahora una prueba con pnpm pack en una app de ejemplo.