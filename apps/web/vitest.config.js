import { defineConfig } from 'vitest/config'

// Config própria do vitest (separada do vite.config) para não puxar os plugins
// de build (react/tailwind). Testes de unidade rodam lógica pura em node.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,ts}'],
  },
})
