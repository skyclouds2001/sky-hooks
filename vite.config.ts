import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import visualizer from 'rollup-plugin-visualizer'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    legacy(),
    visualizer({
      filename: 'report.html',
      title: 'report',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    checker({
      vueTsc: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx,vue}"',
      },
      stylelint: {
        lintCommand: 'stylelint ./src/**/*.{vue,css,sass,scss,less,styl,stylus}',
      },
    }),
  ],
  css: {
    devSourcemap: true,
  },
})
