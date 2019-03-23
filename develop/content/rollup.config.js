import babel from 'rollup-plugin-babel';

export default [ {
  input: 'src/background.js',
  output: {
    format: 'iife',
    file: '../../build/content/background.js'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
},
{
  input: 'src/inject.js',
  output: {
    format: 'iife',
    file: '../../build/content/inject.js'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
},
{
  input: 'src/main.js',
  output: {
    format: 'iife',
    file: '../../build/content/main.js'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
];
