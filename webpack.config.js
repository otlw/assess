const path = require('path')

module.exports = {
  mode: 'development',
  entry: './app/index.js',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "",
  },
  module : {
    rules : [
      {
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           {loader: 'file-loader'}
         ]
      }
    ]
  }
}
