# Next steps — Mochi UI

Lo que queda después de completar las fases 1–6 de [PLAN.md](PLAN.md) (2026-11-18).
Estado actual: `pnpm typecheck`, `pnpm test` (145/145), `pnpm build` y `pnpm build-storybook` en verde.

## 1. Decidir el registry y publicar (PLAN 6.4) — bloqueante para distribuir

Es una decisión del equipo:

| Opción | Cuándo | Qué cambia |
| --- | --- | --- |
| **GitHub Packages** | Uso interno; el repo ya está en GitHub | El nombre necesita scope: `@judithmarg-dev/mochi-ui` |
| **npm público** | Uso abierto | Comprobar si `mochi-ui` está libre; si no, usar un scope |
| Azure Artifacts / Verdaccio | Si la empresa ya usa uno | URL del feed en `.npmrc` |

Una vez decidido:

- [ ] Renombrar el paquete si hace falta (`package.json` → `name`) y actualizar los imports del README y de *Getting started*.
- [ ] Añadir `publishConfig` en `package.json`, por ejemplo para GitHub Packages:
  ```json
  "publishConfig": { "registry": "https://npm.pkg.github.com", "access": "restricted" }
  ```
- [ ] Añadir `.npmrc` en los proyectos consumidores: `@judithmarg-dev:registry=https://npm.pkg.github.com`
  (más un token con `read:packages`). No hay que commitear el token.
- [ ] Añadir a `.github/workflows/ci.yml` un job `publish` que se dispare con tags `v*`: `pnpm publish --no-git-checks`
  con `NODE_AUTH_TOKEN` (para GitHub Packages basta con `GITHUB_TOKEN` y `permissions: packages: write`).
- [ ] Publicar `0.1.0`: `git tag v0.1.0 && git push --tags`.

## 2. Activar GitHub Pages para Storybook

- [ ] En el repo: *Settings → Pages → Source: GitHub Actions*. El job `docs` del CI ya despliega `storybook-static`
  en cada push a `main`.
- [ ] Añadir el enlace al sitio en el README cuando esté publicado.

## 3. Calidad (no bloquea)

- [ ] **Aviso `Could not parse CSS stylesheet`** (8 veces en los tests): no se ha identificado la regla que lo provoca
  y no afecta a los resultados. Candidatos: `clip-path: path(...)` de las siluetas, `color-mix()` o selectores `:has()`.
  Para aislarlo, ejecutar los tests archivo por archivo y ver cuáles lo imprimen.
- [ ] **Tipos para consumidores CJS**: `exports.require` usa el mismo `dist/index.d.ts` que ESM. Con
  `moduleResolution: node16` en un proyecto CommonJS, TypeScript puede quejarse ("masquerading as ESM"). Si aparece,
  generar también `.d.cts`.
- [ ] **Plugin `cjsInterop`** de `vite.config.ts`: es un parche sobre la salida de Rolldown. Revisarlo al actualizar
  Vite/Rolldown; la prueba es `node -e "require('mochi-ui')"` en una app que instale el `.tgz`.
- [ ] Probar Storybook y los componentes nuevos (Slider, Select, Accordion, AppBar, Pagination) en navegador real,
  en modo claro y oscuro y con `dir="rtl"`. Los tests de jsdom no cubren el layout ni el arrastre real del Slider.
- [ ] Auditoría de accesibilidad con un lector de pantalla (NVDA/VoiceOver) para Select (combobox) y Slider.

## 4. Ideas para siguientes versiones

- Slider con rango (dos pulgares) y orientación vertical.
- Select con búsqueda (Autocomplete) y grupos de opciones.
- Componentes que aún no existen y tiene MUI: Drawer, Table, Stepper, Popover genérico (reutilizando el posicionamiento
  de Menu/Tooltip/Select, que hoy está duplicado en los tres).
