module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
  rules: {
    'react/prop-types': 'warn', // Enable PropTypes rule to warn if PropTypes are missing
    'react/react-in-jsx-scope': 'off', // Next.js does not require React to be in scope
    'prettier/prettier': 'error', // Enforce Prettier formatting
    'no-unused-vars': 'warn', // Warn about unused variables
    'no-console': 'warn', // Warn about console.log usage
    'react/jsx-uses-react': 'off', // React 17+ doesn't require this anymore
    'react/jsx-uses-vars': 'error', // Catch unused variables in JSX
  },
  settings: {
    react: {
      version: 'detect', // Automatically detects React version
    },
  },
};
