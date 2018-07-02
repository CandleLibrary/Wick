const path = require('path');

module.exports = {
  entry: './source/wick.js',
  watch:true,
  devtool:"eval",
  mode:"development",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  output: {
    filename: 'wick-dev-es5.js',
    path: path.resolve(__dirname, '../build'),
    library: 'wick',
    libraryTarget: 'umd'
  }
};
