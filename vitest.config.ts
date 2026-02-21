import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx,js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/proxy.ts',
        'src/app/**/*.{ts,tsx,js,jsx}',
        'src/consts/**/*.{ts,tsx,js,jsx}',
        'src/design-tokens/*.{ts,tsx,js,jsx}',
        'src/scripts/*.{ts,tsx,js,jsx}',
        'src/types/*.{ts,tsx,js,jsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
