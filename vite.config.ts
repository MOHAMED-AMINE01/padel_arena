import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    build: {
      // Le code Spline (physics/navmesh/...) est volumineux ; on relève le seuil
      // d'alerte et on isole les gros vendors pour un meilleur cache navigateur.
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        external: [/club-website-tep-sport-officel/],
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('@splinetool') || id.includes('three')) return 'spline';
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'react-vendor';
            if (id.includes('motion') || id.includes('framer-motion')) return 'motion';
            if (id.includes('lucide-react')) return 'icons';
          },
        },
      },
    },
  };
});
