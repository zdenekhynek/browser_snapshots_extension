const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // Entry files for our popup and background pages
  entry: {
    popup: './src/popup.js',
    background: './src/background.js',
  },

  // Extension will be built into ./dev folder,
  // which we can then load as unpacked extension in Chrome
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name].bundle.js',
  },

  // Here we define loaders for different file types
  module: {
    rules: [

      // We use Babel to transpile JSX
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, './src'),
        ],
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[path][name]---[local]---[hash:base64:5]',
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        use: 'file-loader?limit=100000',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?limit=100000',
          {
            loader: 'img-loader',
            options: {
              enabled: true,
              optipng: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [

    // create CSS file with all used styles
    new ExtractTextPlugin('bundle.css'),

    // create popup.html from template and inject styles and script bundles
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['popup'],
      filename: 'popup.html',
      template: './src/popup.html',
    }),

    // copy extension manifest and icons
    new CopyWebpackPlugin([
      { from: './src/manifest.json' },
      { from: './css', to: 'css' },
      { from: './vendor', to: 'vendor' },
      { from: './src/assets' },
    ]),

    new webpack.DefinePlugin({
      API_URL: JSON.stringify('http://127.0.0.1:8000/'),
      SOCKET_URL: JSON.stringify('ws://127.0.0.1:8000/'),
      SNAP_INTERVAL: 1000,

      // API_URL: JSON.stringify('https://browser-snapshots.herokuapp.com/'),
      // SNAP_INTERVAL: 1000,
    }),
  ],
};
