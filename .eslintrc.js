// https://medium.com/@brygrill/create-react-app-with-typescript-eslint-prettier-and-github-actions-f3ce6a571c97

module.exports = {
  plugins: ['import'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'no-param-reassign': 'off',
    'default-case': 'off',
    'no-unused-vars': 'off',
    'prettier/prettier': [1],
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-use-before-define': 'off',
    'react/prop-types': 'off',
    'no-underscore-dangle': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'no-case-declarations': 'off',
    'consistent-return': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-use-before-define': ['off'],
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'import/no-named-as-default': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/prefer-default-export': 'off',
  },
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  env: {
    jasmine: true,
    jest: true,
    node: true,
  },
  // settings: {
  //   'import/parsers': {
  //     '@typescript-eslint/parser': ['.ts'],
  //   },
  //   'import/resolver': {
  //     typescript: {
  //       alwaysTryTypes: true,
  //     },
  //   },
  // },
  parserOptions: {
    ecmaVersion: 2018,
    project: './tsconfig.json',
  },
}
