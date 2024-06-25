const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'));
const recommendedExtends = [
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:testing-library/react',
  'plugin:jest-dom/recommended',
  'airbnb-typescript',
  'plugin:package-json/recommended',
  'prettier',
  'next/core-web-vitals',
];

const rules = {
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'variable',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      leadingUnderscore: 'allow',
    },
    {
      selector: 'function',
      format: ['camelCase', 'PascalCase'],
    },
    {
      selector: 'typeLike',
      format: ['PascalCase', 'UPPER_CASE', 'camelCase'],
    },
  ],
  'jsx-no-lambda': 0,
  '@typescript-eslint/interface-name-prefix': 0,
  '@typescript-eslint/no-empty-interface': 0,
  quotes: ['error', 'single', { avoidEscape: true }],
  '@typescript-eslint/no-var-requires': 0,
  'member-ordering': 0,
  'object-literal-sort-keys': 0,
  'no-shadowed-variable': 0,
  'no-consecutive-blank-lines': 0,
  'no-string-literal': 0,
  'jsx-no-multiline-js': 0,
  'jsx-boolean-value': 0,
  'arrow-parens': 0,
  'no-implicit-dependencies': 0,
  'no-submodule-imports': 0,
  'no-case-declarations': 1,
  '@typescript-eslint/no-empty-function': 0,
  '@typescript-eslint/indent': 0,
  '@typescript-eslint/no-shadow': 0,
  '@typescript-eslint/no-unused-expressions': [
    'error',
    { allowShortCircuit: true, allowTernary: true },
  ],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  // the next three were added temporarily since airbnb did not update the definitions for these rules yet
  '@typescript-eslint/dot-notation': 0,
  '@typescript-eslint/lines-between-class-members': 0,
  '@typescript-eslint/ban-ts-ignore': 0,
  'jsx-alignment': 0,
  'jsx-wrap-multiline': 0,
  '@typescript-eslint/camelcase': 0,
  'prettier/prettier': ['error', prettierOptions],
  'arrow-body-style': [2, 'as-needed'],
  // this should be disabled if 'arrow-body-style' is enabled
  'implicit-arrow-linebreak': 0,
  'class-methods-use-this': 0,
  'import/imports-first': 0,
  'import/newline-after-import': 0,
  'import/no-unresolved': 0, // disabled because eslint gets stupid with this rule in a monorepo setup. ts already checks this as well
  'import/no-webpack-loader-syntax': 0,
  'import/no-cycle': 0,
  'import/prefer-default-export': 0,
  'no-param-reassign': 1,
  // throws false positives due to aliases if this is enabled
  'import/no-extraneous-dependencies': 0,
  'operator-linebreak': 0,
  'jsx-a11y/aria-props': 2,
  'jsx-a11y/heading-has-content': 0,
  'jsx-a11y/label-has-for': 0,
  'jsx-a11y/mouse-events-have-key-events': 2,
  'jsx-a11y/role-has-required-aria-props': 2,
  'jsx-a11y/role-supports-aria-props': 2,
  'max-len': 0,
  'newline-per-chained-call': 0,
  'no-confusing-arrow': 0,
  'no-console': 1,
  'no-use-before-define': 0,
  'prefer-template': 2,
  'react/destructuring-assignment': 0,
  'react-hooks/rules-of-hooks': 'error',
  'react/jsx-closing-tag-location': 0,
  'react/forbid-prop-types': 0,
  'react/jsx-first-prop-new-line': [2, 'multiline'],
  'react/jsx-filename-extension': 0,
  'react/jsx-no-target-blank': 0,
  'react/jsx-props-no-spreading': 0,
  'react/jsx-uses-vars': 2,
  'react/prop-types': 0,
  'react/require-default-props': 0,
  'react/require-extension': 0,
  'react/self-closing-comp': 0,
  'react/sort-comp': 0,
  'object-curly-spacing': ['error', 'always', { arraysInObjects: true }],
  'react/react-in-jsx-scope': 0,
  'react/jsx-uses-react': 0,
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],
  'no-undef': 0,
  'deprecation/deprecation': 'warn',
};

module.exports = {
  root: true,
  extends: recommendedExtends,
  plugins: [
    'react',
    'import',
    'prettier',
    'react-hooks',
    'jsx-a11y',
    'package-json',
    '@typescript-eslint',
    'deprecation',
  ],
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.eslint.json', './vite.config.js'],
  },
  rules,
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
};
