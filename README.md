# webpack-boilerplate

Simple production-ready boilerplate for [Webpack](http://webpack.github.io/) (CoffeeScript and HTML)

## Features

* compiles your scripts, templates, styles
* lints them
* wraps the scripts and templates in common.js / AMD modules
* concatenates scripts and styles
* generates source maps for concatenated files
* shrinks the output by minifying code and optimizing images
* watches your files for changes
* notifies you about errors via console
* generates your static html from handlebars templates

## Install

```sh
# Clone repository
$ git clone https://github.com/otard/webpack-boilerplate.git && cd webpack-boilerplate

# Install dependencies
$ npm install
```

## Development

```sh
$ npm run build
```

## Production

If you want to run the project in production, set the `NODE_ENV` environment variable to `production`.

```sh
export NODE_ENV=production
```

## Tests

```sh
$ npm test
```

## License

MIT © [Otard Sun](http://github.com/otard)
