const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const incstr = require('incstr');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const constants = require('../server/app.constants');


const createUniqueIdGenerator = () => {
  const index = {};

  const generateNextId = incstr.idGenerator({
    // Removed "d" letter to avoid accidental "ad" construct.
    // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
    alphabet: 'abcefghijklmnopqrstuvwxyz0123456789',
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      // Class name cannot start with a number.
      nextId = generateNextId();
    } while (/^[0-9]/.test(nextId));

    index[name] = nextId;

    return index[name];
  };
};

const uniqueIdGenerator = createUniqueIdGenerator();

const getComponentName = (resourcePath, separator) => {
  return resourcePath.split(separator).slice(-5, -1).join(separator);
};

const generateScopedName = (localName, resourcePath) => {
  const componentUnixName = getComponentName(resourcePath, '/');
  const componentWindowsName = getComponentName(resourcePath, '\\');

  const componentName = componentUnixName > componentWindowsName
    ? componentUnixName
    : componentWindowsName;

  return `${uniqueIdGenerator(componentName)}_${uniqueIdGenerator(localName)}`;
};

module.exports = {
  mode: 'production',

  entry: {
    main: ['@babel/polyfill', './index.jsx'],
  },

  output: {
    path: `${__dirname}/static/`,
    publicPath: '/static/',
    filename: 'main.[hash].js',
    chunkFilename: 'main.[id].[hash].js',
  },

  context: path.resolve(__dirname, './'),

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            'lodash',
            [
              'react-css-modules',
              {
                generateScopedName,
                webpackHotModuleReloading: false,
              },
            ],
          ],
        },
      },
      {
        test: /\.pcss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
                getLocalIdent: ({ resourcePath }, localIdentName, localName) => {
                  return generateScopedName(localName, resourcePath);
                },
              },
              localsConvention: 'camelCase',
            },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
                getLocalIdent: ({ resourcePath }, localIdentName, localName) => {
                  return generateScopedName(localName, resourcePath);
                },
              },
              localsConvention: 'camelCase',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|woff|woff2|ttf|eot|ico)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['url-loader?limit=5000&name=[name].[hash].[ext]?'],
      },
    ],
  },

  devtool: 'eval',

  resolve: {
    modules: ['./', 'node_modules'],
    extensions: ['.mjs', '.js', '.jsx', '.pcss'],
  },

  optimization: {
    minimize: true,
  },

  plugins: [
    new LodashModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'main.[hash].css',
      chunkFilename: 'main.[id].[hash].css',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BABEL_ENV: JSON.stringify('production'),
      },
      APP_CONSTANTS: {
        ACCESS_TOKEN_COOKIE_NAME: JSON.stringify(constants.COOKIES.ACCESS_TOKEN),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'views/index-template.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};
