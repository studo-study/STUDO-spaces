import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    include: ['test/e2e/**/*.e2e-spec.ts'],
    globalSetup: ['./test/vitest.global-setup.ts'],
    fileParallelism: false,

    testTimeout: 30000,
    hookTimeout: 30000,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './test/coverage',
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.dto.ts',
        '**/*.module.ts',
        '**/*.entity.ts',
        '**/*.types.ts',
        '**/seed.ts',
        '**/reset.ts',
        '**/configuration.ts',
        '**/drizzle/**',
        '**/types/**',
      ],
    },

    environment: 'node',

    globals: true,
  },

  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});