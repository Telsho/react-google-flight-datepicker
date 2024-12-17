const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: isProduction ? './src/lib/index.js' : './src/dev/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: isProduction ? 'umd' : undefined,
    library: isProduction ? 'ReactGoogleFlightDatepicker' : undefined,
    globalObject: isProduction ? 'this' : undefined,
    clean: true,
    publicPath: '/'
  },
  externals: isProduction ? {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    },
  } : {},
  module: {
    rules: [
      {
        test: /\.d\.ts$/,
        use: 'ignore-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ignore-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread'
            ],
            cacheDirectory: true,
            cacheCompression: false,
          }
        },
      },
      {
        test: /\.(s?)css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: false,
                outputStyle: 'compressed',
              },
            }
          }
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts'],
    alias: {
      'react-svg-loader': '@svgr/webpack'
    }
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
      BABEL_ENV: process.env.BABEL_ENV || 'development'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/'
    },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: true
    }
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map'
};