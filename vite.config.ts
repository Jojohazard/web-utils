import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [

    viteStaticCopy({
      targets: [
        {
          src: 'lib/ui-components/icons/*',
          dest: 'icons'
        }
      ]
    })

  ],
  build: {
    lib: {
      entry: './src/client.ts',
      formats: ['es'],
    },
    outDir: './build/client',
    rollupOptions: {
      output: {
        entryFileNames: '[name]-[format].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      }
    },
  }
});
