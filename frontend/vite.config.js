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
      target: 'es2020', // Ensure compatibility with Node.js 20
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['react-icons', 'lucide-react'],
            utils: ['axios'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      // Ensure Node.js compatibility
      commonjsOptions: {
        include: [/node_modules/],
      },
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

    // Optimize dependencies for Node.js compatibility
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios'],
      esbuildOptions: {
        target: 'es2020',
      },
    },
  }
})
