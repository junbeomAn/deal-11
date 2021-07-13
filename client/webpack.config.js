const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/main.js'
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          process.env.NODE_ENV === 'production'
          ? MiniCssExtractPlugin.loader
          : "style-loader",
          "css-loader",
          "sass-loader",
        ]
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'API_ENDPOINT': JSON.stringify('localhost:3000')
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      templateParameters: {
        env: process.env.NODE_ENV === 'development' ? "(개발용)" : "",
      },
      minify: process.env.NODE_ENV === 'production' ? {
        collapseWhitespace: true,
        removeComments: true,
      } : false,
    }),
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === 'production'
     ? [new MiniCssExtractPlugin({ filename: '[name].css' })]
     : [])
  ],
  devtool: 'source-map',
}