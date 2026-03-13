import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: true,
    port: 10000,
  },
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pizza de Verdad',
        short_name: 'Pizza de Verdad',
        description: 'Dashboard de ventas Pizza de Verdad',
        theme_color: '#D11A1A',
        background_color: '#1A1A1A',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/BETO.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/BETO.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/BETO.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      }
    }),
  ],
});
