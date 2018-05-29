const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './source/wick.js',
  mode:"production",
  output: {
    filename: 'wick-min.js',
    path: path.resolve(__dirname, '../build'),
    library: 'wick'
  },
  plugins: [
    new UglifyJsPlugin()
  ],
};
