/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  // Relative paths so the same build works on Netlify, Vercel and GitHub Pages (/repo-name/).
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Show "A new version is ready ✨ Refresh" instead of updating silently.
      registerType: 'prompt',
      includeAssets: ['icons/icon.svg', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'],
      manifest: {
        name: 'Wombtales',
        short_name: 'Wombtales',
        description:
          'Wombtales: a calm, private pregnancy companion with daily stories, shlokas, ragas, gentle games and love.',
        lang: 'hi-Latn',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFF8F3',
        theme_color: '#F4C2C2',
        icons: [
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
      workbox: {
        // App shell + all code chunks + woff2 fonts work offline. (The older .woff copies are skipped.)
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        globIgnores: ['**/og-image.png'],
        navigateFallback: 'index.html',
        // Real pages (About, Privacy, articles) and search files must not be swapped for the app.
        navigateFallbackDenylist: [/^\/(about|privacy|articles)(\/|$)/, /\.(xml|txt)$/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Audio is cached the first time it plays, so it works offline afterwards.
            urlPattern: ({ url }) => url.pathname.includes('/audio/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'gs-audio',
              rangeRequests: true,
              expiration: { maxEntries: 120 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.includes('/images/'),
            handler: 'CacheFirst',
            options: { cacheName: 'gs-images', expiration: { maxEntries: 200 } },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    alias: {
      'virtual:pwa-register/react': fileURLToPath(
        new URL('./src/test/pwaRegisterStub.ts', import.meta.url),
      ),
    },
  },
});
