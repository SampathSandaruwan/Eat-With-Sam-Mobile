module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'react-native',
    '@typescript-eslint',
    'import',
    'simple-import-sort',
  ],
  rules: {
    // React specific rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/display-name': 'warn',
    'react/no-unused-prop-types': 'warn',
    'react/no-unused-state': 'warn',
    'react/jsx-uses-react': 'off', // Not needed in React 17+
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-key': 'warn',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-props': 'off', // Personal preference
    'react/jsx-wrap-multilines': 'warn',
    'react/jsx-closing-bracket-location': 'warn',
    'react/jsx-closing-tag-location': 'warn',
    'react/jsx-curly-spacing': ['warn', 'never'],
    'react/jsx-equals-spacing': ['warn', 'never'],
    'react/jsx-first-prop-new-line': ['warn', 'multiline'],
    'react/jsx-indent': ['warn', 2],
    'react/jsx-indent-props': ['warn', 2],
    'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],
    'react/jsx-no-bind': 'off',
    'react/jsx-no-literals': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-multi-spaces': 'warn',
    'react/jsx-sort-default-props': 'off',
    'react/jsx-tag-spacing': 'warn',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React Native specific rules
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'off', // Can be too strict
    'react-native/no-single-element-style-arrays': 'warn',

    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',

    // General ESLint rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'off', // Using TypeScript version instead
    'no-undef': 'error',
    'no-duplicate-imports': 'error',
    'no-unreachable': 'error',
    'no-constant-condition': 'error',
    'no-empty': 'warn',
    'no-extra-semi': 'error',
    'no-irregular-whitespace': 'error',
    'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],
    'no-trailing-spaces': 'error',
    'no-unexpected-multiline': 'error',
    'prefer-template': 'warn',
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],
    'computed-property-spacing': ['warn', 'never'],
    'space-before-blocks': 'warn',
    'keyword-spacing': 'warn',
    'space-infix-ops': 'warn',
    'eol-last': 'warn',
    'indent': ['warn', 2, { SwitchCase: 1 }],

    // Import rules
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports
          ['^\\u0000'],
          // External packages (libraries) - React, React Native, React Navigation, and other external packages
          ['^react$', '^react-native', '^@react', '^[a-z]'],
          // Internal custom path aliases (starting with @ but not external libraries)
          ['^@'],
          // Relative imports
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off', // TypeScript handles this
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    'react-native/react-native': true,
    es6: true,
    node: true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    'vendor/',
    'build/',
    'dist/',
    '*.config.js',
    '*.config.ts',
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
    '.eslintrc.js',
    'index.js',
  ],
};