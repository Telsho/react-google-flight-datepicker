import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';
import svgr from 'esbuild-plugin-svgr';

export default defineConfig({
  entry: ['src/lib/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  esbuildPlugins: [
    sassPlugin({
      type: 'style',
    }),
    svgr(), 
  ],
  loader: {
    '.scss': 'css',
  },
});