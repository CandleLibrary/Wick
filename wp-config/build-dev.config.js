const path = require('path');

module.exports = {
  entry: './source/wick.js',
  devtool:"eval",
  mode:"development",
  output: {
    filename: 'wick-dev.js',
    path: path.resolve(__dirname, '../build')
  }
};
