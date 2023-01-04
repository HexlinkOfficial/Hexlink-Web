import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import nodePolyfills from "rollup-plugin-polyfill-node";
const production = process.env.NODE_ENV === "production";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    !production &&
    nodePolyfills({
      include: ["node_modules/**/*.js", new RegExp("node_modules/.vite/.*js")]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      external: ['react', 'subscriptions-transport-ws', '@vue/apollo-composable'],
      plugins: [
        // ↓ Needed for build
        nodePolyfills()
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
});