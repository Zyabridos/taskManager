import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const mode = process.env.NODE_ENV || 'development';

export default {
  mode,
  entry: './server/startServer.js', // Основной файл бэкенда
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  devServer: {
    port: 5000, // Сервер бэкенда
    hot: true,
  },
};
