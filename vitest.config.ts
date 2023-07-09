import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    root: '.',
    watch: false,
    environment: 'jsdom',
    include: ['tests/{unit,components}/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    reporters: ['default', 'html'],
    coverage: {
      provider: 'v8',
      enabled: true,
    },
    cache: {},
  },
})
