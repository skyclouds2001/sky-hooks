module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    commonjs: true,
    'shared-node-browser': true,
    worker: true,
  },
  extends: ['standard-with-typescript', 'eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'plugin:n/recommended', 'plugin:promise/recommended', 'plugin:import/recommended', 'plugin:security/recommended', 'plugin:jsdoc/recommended', 'plugin:jsx-a11y/recommended', 'plugin:regexp/recommended', 'plugin:prettier/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: 'tsconfig.json',
    tsconfigRootDir: '.',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['tsdoc'],
  globals: {},
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'n/no-missing-import': 'off',
    'import/no-unresolved': [
      'error',
      {
        ignore: ['package.json'],
      },
    ],
    'promise/always-return': [
      'error',
      {
        ignoreLastCallback: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        directory: 'tsconfig.json',
      },
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      rules: {
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-property-type': 'off',
        'jsdoc/require-returns-type': 'off',
      },
    },
    {
      files: ['**/test/*.[jt]s?(x)'],
      extends: ['plugin:testing-library/vue', 'plugin:vitest/recommended'],
    },
    {
      files: ['**/type/*.[jt]s?(x)'],
      rules: {
        'no-var': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-redeclare': 'off',
      },
    },
  ],
}
