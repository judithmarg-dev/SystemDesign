/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import dts from 'vite-plugin-dts';

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

/**
 * The package is `type: module`, so Rolldown wraps CommonJS imports with Node semantics in the CJS build
 * (`__toESM(mod, 1)`: default = the whole `module.exports`). Emotion's CJS builds export `{ __esModule, default }`,
 * which then breaks `styled.div` under `require()`. Dropping the Node-mode flag makes `default` honour `__esModule`.
 */
const cjsInterop = (): Plugin => ({
  name: 'mochi:cjs-interop',
  renderChunk(code, _chunk, options) {
    if (options.format !== 'cjs') return null;
    return { code: code.replace(/\.__toESM\(([\w$]+),\s*1\)/g, '.__toESM($1)'), map: null };
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    cjsInterop(),
    // Type declarations are only needed for the library bundle.
    ...(mode === 'production' && !process.env.STORYBOOK
      ? [
          dts({
            include: ['src'],
            exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx', 'src/**/*.test.ts', 'src/core/testing.tsx'],
          }),
        ]
      : []),
  ],
  resolve: {
    alias: [
      { find: /^@core$/, replacement: src('core/index.ts') },
      { find: /^@core\//, replacement: src('core/') },
      { find: /^@modules\//, replacement: src('modules/') },
      { find: /^@shared$/, replacement: src('shared/index.ts') },
      { find: /^@shared\//, replacement: src('shared/') },
    ],
  },
  build: {
    lib: {
      entry: src('index.ts'),
      name: 'MochiUI',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@emotion\//],
      // One file per source module: with `sideEffects: false`, consumers' bundlers drop the components they don't import.
      output: [
        { format: 'es', preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
        { format: 'cjs', preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].cjs', exports: 'named' },
      ],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Reuses one jsdom per worker instead of one per file (keeps per-file isolation).
    pool: 'vmThreads',
  },
}));
