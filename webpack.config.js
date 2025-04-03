import path from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const mode = process.env.NODE_ENV || 'development';

export default {
  mode,
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false, // оставляем отключённым, чтобы пути не переписывались
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'assets/main.css' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/assets', to: 'assets/images' },
      ],
    }),
  ],
};
