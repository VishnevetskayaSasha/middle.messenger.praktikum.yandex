export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-class-pattern': [ 
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:_(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$',
      {
        message: 'Class selector should follow BEM notation',
      },
    ],

    'at-rule-empty-line-before': 'never',
    'declaration-empty-line-before': 'never',
    'scss/dollar-variable-empty-line-before': 'never',
  },
};
