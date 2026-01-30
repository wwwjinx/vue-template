import path from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv

  return ({
    base: env.VITE_BASE || '/',
    server: {
      port: 8080,
      open: false,
    },
    plugins: [
      vue(),
      tailwindcss(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        dirs: ['src/components'],
        dts: 'src/types/components.d.ts',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      emptyOutDir: true,
      rolldownOptions: {
        output: {
          minify: {
            compress: {
              dropDebugger: true, // drop debugger statements
            // dropConsole: true,
            },
          },
          assetFileNames: 'assets/[ext]/[name].[hash][extname]',
          chunkFileNames: 'assets/[ext]/[name].[hash].js',
          advancedChunks: {
            groups: [
              { name: 'vue', test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/ },
              { name: 'lodash', test: /[\\/]node_modules[\\/](lodash-es)[\\/]/ },
            ],
          },
        },
      },
    },
  })
})
