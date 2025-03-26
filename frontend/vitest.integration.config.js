import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    testTimeout: 30000  // Longer timeout for integration tests
  }
});