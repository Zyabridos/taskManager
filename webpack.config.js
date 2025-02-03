import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { fileURLToPath } from 'url';

const mode = process.env.NODE_ENV || 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        // use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  // plugins: [new MiniCssExtractPlugin()],
  devServer: {
    port: 5000, // Сервер бэкенда
    hot: true,
  },
};
