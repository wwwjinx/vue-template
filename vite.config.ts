import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import VueRouter from 'vue-router/vite'

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
      UnoCSS(),
      VueRouter({
        // 如何导入路由，也可以是字符串
        importMode: 'async',
        // 要排除的文件
        exclude: ['**/components/*'],
        dts: './src/types/typed-router.d.ts',
      }),
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dirs: ['src/hooks', 'src/utils'],
        dts: 'src/types/auto-imports.d.ts',
        vueTemplate: true,
        vueDirectives: true,
      }),
      Components({
        dirs: ['src/components'],
        directoryAsNamespace: false, // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名，

        dts: 'src/types/components.d.ts',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
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
            ],
          },
        },
      },
    },
  })
})
