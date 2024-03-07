const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const htmlPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "index.html"),
});

const dotEnvObj = new Dotenv({
  path: "./.env",
  systemvars: true
});

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    htmlPlugin,
    dotEnvObj
  ],
  devServer: {
    static: {
      publicPath: "/",
      directory: path.resolve(__dirname),
    },
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      }
    ],
  },
  resolve: {
    extensions: [".*", ".js", ".jsx"],
  },
};