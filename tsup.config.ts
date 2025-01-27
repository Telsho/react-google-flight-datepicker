import { defineConfig } from "tsup";
import svgr from 'esbuild-plugin-svgr';
import { copy } from 'esbuild-plugin-copy'; // Use this plugin instead

export default defineConfig({
  entry: ['src/lib/index.ts'], // Removed SCSS entry
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [
    svgr(),
    copy({
      assets: {
        from: ['src/lib/components/DatePicker/styles.scss'],
        to: ['dist/styles.scss'],
      },
      resolveFrom: 'cwd',
    }),
  ],
  esbuildOptions(options) {
    options.assetNames = 'assets/[name]-[hash]';
  }
});