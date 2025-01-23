import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';
import svgr from 'esbuild-plugin-svgr';

export default defineConfig({
  entry: ['src/lib/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  bundle: true,
  splitting: false,
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  platform: 'browser',
  target: 'es2017',
  inject: ['./src/lib/ssr-shim.js'], 
  external: ['react', 'react-dom'],
  esbuildPlugins: [
    sassPlugin({
      type: 'css-text',
      cssImports: true
    }),
    svgr(),
  ],
});