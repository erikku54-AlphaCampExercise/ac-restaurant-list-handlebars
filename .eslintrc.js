module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'standard',
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    semi: ['off'],
    'no-multiple-empty-lines': ['off'],
    'padded-blocks': ['off']
  }
}
