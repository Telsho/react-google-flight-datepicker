const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: {
    main: isProduction ? "./src/lib/index.ts" : "./src/dev/index.tsx", // Main entry point
  },
  output: {
    filename: isProduction ? "[name].[contenthash].js" : "[name].js", // Unique filenames
    path: path.resolve(__dirname, "dist"),
    libraryTarget: isProduction ? "umd" : undefined,
    library: isProduction ? "ReactGoogleFlightDatepicker" : undefined,
    globalObject: isProduction ? "this" : undefined,
    clean: true,
    publicPath: "/",
  },
  externals: isProduction
    ? {
        react: {
          root: "React",
          commonjs2: "react",
          commonjs: "react",
          amd: "react",
          umd: "react",
        },
        "react-dom": {
          root: "ReactDOM",
          commonjs2: "react-dom",
          commonjs: "react-dom",
          amd: "react-dom",
          umd: "react-dom",
        },
        dayjs: {
          commonjs: "dayjs",
          commonjs2: "dayjs",
          amd: "dayjs",
          root: "dayjs",
        },
      }
    : {},
  module: {
    rules: [
      {
        test: /dayjs[/\\]locale/,
        type: "javascript/auto",
        include: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules|dist/, // Exclude dist directory
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript",
              ],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-object-rest-spread",
              ],
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules|dist/, // Exclude dist directory
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-object-rest-spread",
            ],
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      },
      {
        test: /\.(s?)css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: false,
                outputStyle: "compressed",
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      "react-svg-loader": "@svgr/webpack",
      'dayjs/locale': path.resolve(__dirname, 'node_modules/dayjs/locale')
    },
    fallback: {
      path: false,
      fs: false,
    },
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        parallel: true, // Enable parallel processing
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      minSize: 20000, // Minimum size for chunks
      maxSize: 244000, // Maximum size for chunks (adjust as needed)
      minChunks: 1,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        default: {
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: isProduction ? "[name].[contenthash].css" : "[name].css",
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || "development",
      BABEL_ENV: process.env.BABEL_ENV || "development",
    }),
    new webpack.ContextReplacementPlugin(
      /dayjs[/\\]locale$/,
      new RegExp(`^\\.\\/(${["en"].join("|")})\\.js$`)
    ),
    new CopyPlugin({
      patterns: [
        { from: "src/types/index.d.ts", to: "index.d.ts" },
      ],
    }),
    new CompressionPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
      publicPath: "/",
    },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  devtool: isProduction ? false : "cheap-module-source-map",
};