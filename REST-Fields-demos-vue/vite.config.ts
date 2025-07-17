import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgLoader(),
    tailwindcss(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Error with jsonforms Vuetify integration - https://github.com/eclipsesource/jsonforms/issues/2434
      'vuetify/labs/VNumberInput': path.resolve(
        __dirname,
        'node_modules/vuetify/lib/components/VNumberInput/index.js',
      ),
      'vuetify/labs/VTimePicker': path.resolve(
        __dirname,
        'node_modules/vuetify/lib/components/VTimePicker/index.js',
      ),
    },
  },
})
