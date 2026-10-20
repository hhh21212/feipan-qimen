import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Tailwind v4 的 Vite 插件：负责把 @import "tailwindcss" 里的
    // @theme / @tailwind 指令解析成真正的 :root 变量与工具类。
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/icon.svg',
        'icons/apple-touch-icon.png',
        'icons/favicon-32.png',
        'totems/*.png',
      ],
      manifest: {
        name: '飞盘奇门排盘',
        short_name: '飞盘奇门',
        description: '飞盘奇门遁甲排盘 · 手机优先 · 可离线',
        lang: 'zh-CN',
        theme_color: '#0d1b2a',
        background_color: '#0d1b2a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
})
