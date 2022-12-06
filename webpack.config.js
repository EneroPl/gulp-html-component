import webpack from "webpack";
import path from "path";

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
    fallback: {
      fs: false,
      stream: false,
      buffer: require.resolve("buffer/"),
      path: false,
      util: false,
      console: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};
