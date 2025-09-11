// frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'
  const target = (env.VITE_API_URL || 'http://127.0.0.1:8222').replace(/\/$/, '')
  
  console.log('🔧 Vite Config Debug:')
  console.log('   Mode:', mode)
  console.log('   Environment:', isDev ? 'Development' : 'Production')
  console.log('   VITE_API_URL from env:', env.VITE_API_URL)
  console.log('   Target for proxy:', target)

  return {
    plugins: [react(), tailwindcss()],
    
    // Development server configuration
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'your-domain.com',
        'www.your-domain.com',
        'app.your-domain.com',
        'api.your-domain.com',
      ],
      watch: { usePolling: true },
      cors: true,
      proxy: isDev ? {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p,
        },
      } : undefined,
    },

    // Production build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@heroicons/react'],
            utils: ['axios'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    // Preview server for production testing
    preview: {
      host: '0.0.0.0',
      port: 4173,
      cors: true,
    },

    // Path resolution
    resolve: {
      alias: { 
        '@': '/src', 
        '@components': '/src/components',
        '@utils': '/src/utils',
        '@pages': '/src/pages',
        '@assets': '/src/assets',
      },
    },

    // Environment variables
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      '__DEV__': isDev,
    },

    // CSS configuration
    css: {
      devSourcemap: isDev,
    },
  }
})
