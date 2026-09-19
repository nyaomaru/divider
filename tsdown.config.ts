import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'esnext',
  // WHY: Keep the existing package export paths stable while migrating bundlers.
  outExtensions: ({ format }) =>
    format === 'cjs'
      ? { js: '.cjs', dts: '.d.cts' }
      : { js: '.js', dts: '.d.ts' },
});
