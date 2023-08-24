// rollup.config.js
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.min.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [terser()],
    external: ['uuid']
  }
]
