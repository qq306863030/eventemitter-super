import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'lib',
        format: 'cjs',
        entryFileNames: 'eventemitter-super.cjs.js',
        sourcemap: false,
      },
      {
        dir: 'lib',
        format: 'esm',
        entryFileNames: 'eventemitter-super.esm.js',
        sourcemap: false,
      }
    ],
    plugins: [resolve(), commonjs(), typescript({ module: "ESNext"})],
    external: ['eventemitter3']
  },
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'lib',
        format: 'umd',
        entryFileNames: 'eventemitter-super.umd.js',
        name: 'EventTool',
        sourcemap: false,
        plugins: [terser()],
      },
    ],
    plugins: [resolve(), commonjs(), typescript({ module: "ESNext"})],
  }
]

