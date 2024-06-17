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
  entry: "./src/index.ts",
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
        test: /\.(t|j)sx?$/,
        use: { loader: "ts-loader" },
        exclude: /node_modules/,
      },
      // source-map support
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "source-map-loader"
      }
    ],
  },
  devtool: "source-map",
  resolve: {
    extensions: [".*", ".ts", ".tsx", ".js", ".jsx"],
  },
};