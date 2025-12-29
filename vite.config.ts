import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 3456; // Changed to 3456

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.json',
        buildMode: true,
      },
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}" --max-warnings=-1',
        dev: {
          logLevel: ['error'],
          overrideConfig: {
            rules: {
              // Disable all rules during build
            },
          },
        },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
      // Disable type checking during build
      enableBuild: false,
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: PORT,
    host: '127.0.0.1', // Bind to IPv4
  },
  preview: {
    port: PORT,
    host: '127.0.0.1', // Bind to IPv4
  },
  build: {
    // Don't fail on warnings
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress all warnings
        return;
      },
    },
    // Continue on error
    chunkSizeWarningLimit: 2000,
  },
});
