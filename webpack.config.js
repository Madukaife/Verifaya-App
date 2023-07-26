const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace 'index.js' with your main entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Replace 'bundle.js' with your desired output file name
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
