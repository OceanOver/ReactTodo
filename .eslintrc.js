module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ENV: true,
  },
  rules: {
    'no-underscore-dangle': 'off',
    'spaced-comment': 'off',
    'prefer-destructuring': ['error', {
      'array': false,
      'object': true,
    }],
    'no-console': 'off',
    'comma-dangle': 'off',
  },
};
