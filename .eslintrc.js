const javascriptConfig = require("./.eslintrc-javascript")
const typescriptConfig = require("./.eslintrc-typescript")
const packageConfig = require("./.eslintrc-package")
const markdownConfig = require("./.eslintrc-markdown")

module.exports = {
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      ...javascriptConfig,
    },
    {
      files: ["*.ts", "*.tsx"],
      ...typescriptConfig,
    },
    {
      files: ["package.json"],
      ...packageConfig,
    },
    {
      files: ["*.md"],
      ...markdownConfig,
    },
  ],
}
