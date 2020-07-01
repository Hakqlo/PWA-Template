const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest')
const webpack = require('webpack')
module.exports = {
  entry: {
    app: './js/index.js',
    install: './js/install_in_install_page.js',
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CaseSensitivePathsPlugin(),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: './index.html',
      excludeChunks: ['install'],
    }),
    new HtmlWebpackPlugin({
      template: './install.html',
      filename: 'install.html',
      chunks: ['install'],
      
    }),
    //new webpack.HotModuleReplacementPlugin(),
    new webpack.ExtendedAPIPlugin(),
    new ServiceWorkerWebpackPlugin({
      entry: path.resolve('./sw.js'),
      publicPath: './',
      excludes: [
        'install.html', 
        'js/install_in_install_page.js', 
        'icon/ios-safari-add-to-home-icon.svg', 
        'icon/ios-safari-share-icon.svg',
        'icon/install.svg',
      ],
    }),
    new WebpackPwaManifest({
      filename: "manifest.webmanifest",
      orientation: 'omit',
      short_name: "template",
      name: "pwa template",
      start_url: "./",
      display: "fullscreen",
      background_color: "#000000",
      theme_color: "#000000",
      description: "Hakqlo the technology community's PWA app",
      icons: [
        {
          //src: path.resolve("./icon/logo.svg"),
          src: path.resolve("./icon/logo008b.svg"),
          sizes: [200],
          type: "image/svg+xml"
        }
      ],/*
      ios: {
        'apple-touch-icon': './src/imgs/ios-safari-add-to-home-icon.svg',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
        /*'mask-icon': {
          href:'./src/imgs/ios-safari-add-to-home-icon.svg',
          color: 'black',
        }
      }*/
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['file-loader',MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'file-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      { test: /\.svg$/,
        use: [
          'file-loader',
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {removeOffCanvasPaths: true},
                {removeDimensions: true},
                {reusePaths: true}
              ]
            }
          },
        ]
      },
      
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          attributes: {
            list: [
              {
                tag: 'img',
                attribute: 'src',
                type: 'src',
              },
              {
                tag: 'img',
                attribute: 'srcset',
                type: 'srcset',
              },
              {
                tag: 'img',
                attribute: 'data-src',
                type: 'src',
              },
              {
                tag: 'img',
                attribute: 'data-srcset',
                type: 'srcset',
              },
              {
                tag: 'link',
                attribute: 'href',
                type: 'src',
                /*
                filter: (tag, attribute, attributes) => {
                  if (!/stylesheet/i.test(attributes.rel)) {
                    return false;
                  }

                  if (
                    attributes.type &&
                    attributes.type.trim().toLowerCase() !== 'text/css'
                  ) {
                    return false;
                  }

                  return true;
                },*/
              },
            ]
          }
        }
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
  },
};