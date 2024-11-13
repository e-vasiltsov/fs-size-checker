import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/bin/fs-size-checker.ts'],
  clean: true,
  sourcemap: true,
  target: 'node16',
  format: ['cjs'],
  splitting: false,
  shims: false,
})