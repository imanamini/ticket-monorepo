module.exports = {
  '**/*.{ts,html,json,md}': ['eslint --fix', 'prettier --write'],
  "**/*.scss": ["stylelint --fix", "prettier --write"]
};
