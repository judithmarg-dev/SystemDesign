/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
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
      fileName: 'mochi-ui',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@emotion/react', '@emotion/styled'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));
