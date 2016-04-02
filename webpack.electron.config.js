var join = require('path').join;

module.exports = {
  context: join(__dirname, './'),
  entry: {
    main: [
      './main.js'
    ]
  },
  output: {
    path: join(__dirname, '/dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: [
      'node_modules',
      'src/main'
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
        test: /\.ico$/,
        exclude: /node_modules/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  }
};
