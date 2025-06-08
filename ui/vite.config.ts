import { fileURLToPath, URL } from 'node:url'
import type { ProxyOptions } from 'vite'
import { defineConfig, loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { ALL } from 'node:dns'

const envDir = './env'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const ENV = loadEnv(mode, envDir)
  const prefix = process.env.VITE_DYNAMIC_PREFIX || ENV.VITE_BASE_PATH
  const proxyConf: Record<string, string | ProxyOptions> = {}
  proxyConf['/api'] = {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(ENV.VITE_BASE_PATH, '/')
  }
  proxyConf['/doc'] = {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(ENV.VITE_BASE_PATH, '/')
  }
  proxyConf['/static'] = {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(ENV.VITE_BASE_PATH, '/')
  }
  return {
    preflight: false,
    lintOnSave: false,
    base: prefix,
    envDir: envDir,
    plugins: [vue(), DefineOptions()],
    server: {
      cors: true,
      host: '0.0.0.0',
      port: Number(ENV.VITE_APP_PORT),
      strictPort: true,
      proxy: proxyConf,
      allowedHosts: [
        "nunjxjcswaal.sealosbja.site", // 显式添加目标域名
        "localhost", // 保留本地开发支持
        ".local", // 允许局域网访问
      ]
    },
    build: {
      outDir: 'dist/ui'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
