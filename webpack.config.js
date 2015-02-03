// https://github.com/srn/react-webpack-boilerplate/blob/master/webpack.config.js
var env = process.env['NODE_ENV'];
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HandlebarsHtmlPlugin = require("./lib/handlebars-html-webpack-plugin");
var lessSourceMap = (env != "production") ? "?sourceMap" : "";
var hash = (env == "production") ? "[hash]" : "bundle";
var templateParams = {env: env};

var config = {
  entry: {
    index: "./app/bundles/index/initialize.coffee",
    account: "./app/bundles/account/initialize.coffee"
  },

  output: {
    path: __dirname + "/public",
    filename: "assets/[name]-"+hash+".js",
    chunkFilename: "assets/[id]-"+hash+".js",
  },

  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.hbs$/, loader: "handlebars-loader" },
      // { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
      { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader"+lessSourceMap+"!less-loader") },
      // { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3|\.html$/, loader: "file-loader" },
    ]
  },

  resolve: {
    root: [__dirname + '/bower_components', __dirname + '/app'],
    extensions: ["", ".web.coffee", ".web.js", ".coffee", ".js", ".hbs", ".ejs", ".less"]
  },

  plugins: [
    new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])),
    new ExtractTextPlugin("assets/[name]-"+hash+".css"),
    new HandlebarsHtmlPlugin({path: __dirname + '/app/templates', params: templateParams})
  ]
};

if (env == 'production') {
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
} else {
  config.cache = true;
  config.debug = true;
  config.devtool = "source-map";
}

module.exports = config;
