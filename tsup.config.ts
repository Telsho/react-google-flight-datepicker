import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';

export default defineConfig({
  entry: ['src/lib/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'], 
  dts: true, 
  clean: true,
  minify: true,
  sourcemap: true,
  esbuildPlugins: [sassPlugin()], 
});