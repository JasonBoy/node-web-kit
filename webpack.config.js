var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var HtmlwebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(process.cwd());
var APP_PATH = path.resolve(ROOT_PATH, 'public');
var BUILD_PATH = path.resolve(ROOT_PATH, 'public/build');
var BOWER_PATH = path.resolve(ROOT_PATH, 'public/lib');

module.exports = {
  entry: {
    "bundle": path.resolve(APP_PATH, 'js/app.js'),
    "vendors": ['jquery', 'angular', 'swiper']
    ,
    "style": path.resolve(APP_PATH, 'js/less.js')
  },
  output: {
    path: path.join(BUILD_PATH, 'js'),
    filename: '[name].js'
    // ,
    // chunkFilename: '[id].js'
  },
  resolve: {
    //test bower libs
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
    loaders: [
      //extract css into separate css files
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      // Optionally extract less files
      // or any other compile-to-css language
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      }
      //inline css into style script
      // {
      //   test: /\.less$/,
      //   loader: "style!css!less"
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'bundle.lib.js',
      minChunks: 'Infinity' //don't add common app less into this file
    })
    //extract css into separate files, works with the loads above
    ,
    new ExtractTextPlugin("../css/[name].css")
    // ,
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ]
};