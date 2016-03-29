var path = require('path');
var webpack = require('webpack');
// var HtmlwebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(process.cwd());
var APP_PATH = path.resolve(ROOT_PATH, 'public/js');
var BUILD_PATH = path.resolve(ROOT_PATH, 'public/build');
var TEM_PATH = path.resolve(ROOT_PATH, 'templates');
var BOWER_PATH = path.resolve(ROOT_PATH, 'public/lib');

module.exports = {
  entry: {
    "bundle": path.resolve(APP_PATH, 'app.js'),
    "vendors": ['jquery', 'angular', 'swiper']
  },
  output: {
    path: path.join(BUILD_PATH, 'js'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      swiper: path.resolve(BOWER_PATH, 'Swiper/dist/js/swiper.min.js')
    }
  },
  //enable dev source map
  // devtool: 'eval-source-map',
  //enable dev server
  // devServer: {
  //   historyApiFallback: true,
  //   hot: true,
  //   inline: true,
  //   progress: true,
  // },
  module: {
    // preLoaders: [
    //   {
    //     test: /\.jsx?$/,
    //     include: APP_PATH,
    //     loader: "jshint-loader"
    //   }
    // ],
    loaders: [
      // {
      //   test: /\.jsx?$/,
      //   loader: 'babel',
      //   include: APP_PATH,
      //   query: {
      //     presets: ['es2015']
      //   }
      // }
      // ,
      // {
      //   test: /\.scss$/,
      //   loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
      //   include: APP_PATH
      // },
      // {
      //   test: /\.(png|jpg)$/,
      //   loader: 'url?limit=40000'
      // }
    ]
  }
  ,
  

  //custom jshint options
  // any jshint option http://www.jshint.com/docs/options/
  // jshint: {
  //   "esnext": true
  // },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendors", "bundle.lib.js")
  ]

  /*plugins: [
    new HtmlwebpackPlugin({
      title: 'Hello World app',
      template: path.resolve(TEM_PATH, 'index.html'),
      filename: 'index.html',
      chunks: ['app', 'vendors'],
      inject: 'body'
    }),
    /!*new HtmlwebpackPlugin({
     title: 'Hello Mobile app',
     template: path.resolve(TEM_PATH, 'mobile.html'),
     filename: 'mobile.html'
     }),*!/
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    //provide $, jQuery and window.jQuery to every script
    /!*new webpack.ProvidePlugin({
     $: "jquery",
     jQuery: "jquery",
     "window.jQuery": "jquery"
     })*!/
  ]*/
};