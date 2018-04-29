import pkg from './package.json';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      sourceMap: true,
      format: 'es'
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }
];
