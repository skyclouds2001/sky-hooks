module.exports = {
  '*.{ts,tsx,vue}': ['eslint --fix'],
  '*.{ts,tsx,json,vue,html,md,css}': ['prettier --write'],
  '*.{vue,css}': ['stylelint --fix'],
}
