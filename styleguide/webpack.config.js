const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssConfig = require('../postcss.config');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    vkui: './src/vkui.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: `typeof self !== 'undefined' ? self : this`
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        loader: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => postcssConfig.plugins
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  stats: {
    children: false
  },
  plugins: [
    new MiniCssExtractPlugin('[name].css')
  ],
  externals: [
    {
      'react': 'react',
      'prop-types': 'prop-types',
      'react-dom': 'react-dom'
    },
    /@vkontakte\/icons/i
  ]
};

const devConfig = {
  mode: 'development'
};

const prodConfig = {
  mode: 'production'
};

module.exports = isProduction
  ? merge(config, prodConfig)
  : merge(config, devConfig);
