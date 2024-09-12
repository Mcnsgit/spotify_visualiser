const { node } = require("prop-types");

const { node } = require("prop-types");

module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime'],
  overrides: [
    {
      files: ["*.config.js", "gulpfile.js"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.js", "*.jsx"],
      parser: "@babel/eslint-parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"]
        },
      },
    },
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'react'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "no-unused-vars": "warn",
    "react/prop-types": "error",
    "no-mixed-spaces-and-tabs": "error",
    "react/no-unknown-property": [
      "error",
      { ignore: ["castShadow", "receiveShadow", "shadow-mapSize", "toneMapped"] },
    ],
    "no-dupe-keys": "error",
    "no-case-declarations": "error",
  },
}
