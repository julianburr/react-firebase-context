import pkg from './package.json';
import babel from 'rollup-plugin-babel';

console.log('pkg', pkg);

export default [
  {
    entry: 'src/index.js',
    dest: pkg.main,
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ],
    sourceMap: true,
    format: 'es'
  }
];
