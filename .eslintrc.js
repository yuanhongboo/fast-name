module.exports = {
  env: {
    node: true,
    browser: false,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb", "plugin:prettier/recommended", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
  },
};
