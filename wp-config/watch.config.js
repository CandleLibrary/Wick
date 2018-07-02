const path = require('path');

module.exports = {
  entry: './source/wick.js',
  watch:true,
  devtool:"eval-source-map",
  mode:"development",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  output: {
    filename: 'wick-dev.js',
    path: path.resolve(__dirname, '../build'),
    library: 'wick',
    libraryTarget: 'var'
  }
};
