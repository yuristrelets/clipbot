var join = require('path').join;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: join(__dirname, './src/browser'),
  entry: {
    app: [
      './app/app.js',
      './app/index.html'
    ]
  },
  output: {
    path: join(__dirname, '/dist/browser'),
    filename: '[name]/[name].js'
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: [
      'node_modules',
      'src/browser'
    ]
  },
  debug: true,
  target: 'electron',
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'file?name=[path][name].[ext]'
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style', [
          'css?sourceMap',
          '&modules',
          '&importLoaders=1',
          '&localIdentName=[name]__[local]___[hash:base64:5]',
          '!less?sourceMap'
        ].join(''))
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]/[name].css', {
      allChunks: true
    })
  ]
};
