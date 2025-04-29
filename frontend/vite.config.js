import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'src/setupTests.js','src/main.jsx','src/App.jsx','src/index.js'],
    },
  },
})
