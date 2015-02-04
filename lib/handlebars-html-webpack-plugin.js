// https://github.com/ampedandwired/html-webpack-plugin/blob/master/index.js
var fs = require('fs');
var path = require('path');
var Handlebars = require("handlebars");

function HandlebarsHtmlWebpackPlugin(options) {
  this.options = options || {};
  this.handlebars = Handlebars.create();
}

HandlebarsHtmlWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('emit', function(compiler, callback) {
    var webpackStatsJson = compiler.getStats().toJson();
    var templatePath = self.options.path || path.join(__dirname, 'app', 'assets');
    var templateParams = self.options.params || {};
    templateParams.hash = webpackStatsJson.hash;
    templateParams.digest = (templateParams.env == 'production') ? webpackStatsJson.hash : 'bundle';
    var files = fs.readdirSync(templatePath);
    var templateFiles = [];

    files.forEach(function(templateFile) {
      compiler.fileDependencies.push(templateFile);
      var extname = path.extname(templateFile);
      var basename = path.basename(templateFile, '.hbs');
      if (extname == '.hbs') {
        var fullpath = path.join(templatePath, templateFile);
        var templateContent = fs.readFileSync(fullpath, 'utf8');
        if (templateFile.substr(0, 1) == '_') {
          var template = self.handlebars.compile(templateContent);
          self.handlebars.registerPartial(basename, template);
        } else {
          templateFiles.push({templateContent: templateContent, outputFilename: basename + ".html"});
        }
      }
    });

    templateFiles.forEach(function(item) {
      self.emitHtml(compiler, item.templateContent, templateParams, item.outputFilename);
    });

    callback();

  });
};

HandlebarsHtmlWebpackPlugin.prototype.emitHtml = function(compiler, templateContent, templateParams, outputFilename) {
  var template = this.handlebars.compile(templateContent);
  var html = template(templateParams);
  compiler.assets[outputFilename] = {
    source: function() {
      return html;
    },
    size: function() {
      return html.length;
    }
  };
};

HandlebarsHtmlWebpackPlugin.prototype.htmlWebpackPluginAssets = function(compiler, webpackStatsJson) {
  var assets = {};
  for (var chunk in webpackStatsJson.assetsByChunkName) {
    var chunkValue = webpackStatsJson.assetsByChunkName[chunk];

    // Webpack outputs an array for each chunk when using sourcemaps
    if (chunkValue instanceof Array) {
      // Is the main bundle always the first element?
      chunkValue = chunkValue[0];
    }

    if (compiler.options.output.publicPath) {
      chunkValue = compiler.options.output.publicPath + chunkValue;
    }
    assets[chunk] = chunkValue;
  }

  return assets;
};

module.exports = HandlebarsHtmlWebpackPlugin;
