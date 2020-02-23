module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
    [
      "@emotion/babel-preset-css-prop",
      {
        autoLabel: process.env.NODE_ENV !== "production",
        labelFormat: "[local]",
      },
    ],
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
  ],
}
