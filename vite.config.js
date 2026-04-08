import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Добавьте этот импорт

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Добавьте этот плагин
  ],
})