module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2016,
        "sourceType": "module"
    },
    "parser": "typescript-eslint-parser",
    "plugins": [
      "typescript"
    ],
    "extends": "standard-with-typescript",
    "rules": {
      "indent": ['error', 2],
      "typescript/explicit-function-return-type": 0,
      "typescript/explicit-member-accessibility": 0,
      "camelcase": 0
    }
};
