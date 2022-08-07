const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dist = path.resolve(__dirname, "dist");

const pages = [
  {
    filename: "index.html",
    path: "./src/html/pages/index.html",
    title: "Rent Bike | Главная",
  },
  {
    filename: "catalog.html",
    path: "./src/html/pages/catalog.html",
    title: "Rent Bike | Каталог",
  },
  {
    filename: "settings.html",
    path: "./src/html/pages/settings.html",
    title: "Rent Bike | Настройки",
  },
  {
    filename: "booking.html",
    path: "./src/html/pages/booking.html",
    title: "Rent Bike | Бронирования",
  },
].map(
  (row) =>
    new HtmlWebpackPlugin({
      filename: row.filename,
      template: row.path,
      inject: false,
      title: row.title,
    })
);

module.exports = {
  entry: {
    main: {
      import: ["./src/js/index.js", "./src/styles/main.css"],
      library: {
        name: "app",
        type: "assign",
      },
    },
    header: {
      dependOn: "main",
      import: "./src/js/modules/header.js",
    },
    catalog: {
      dependOn: "main",
      import: "./src/js/modules/catalog.js",
    },
    settings: {
      dependOn: "main",
      import: "./src/js/modules/settings.js",
    },
    booking: {
      dependOn: "main",
      import: "./src/js/modules/booking.js",
    }
  },
  output: {
    path: dist,
  },
  devtool: "source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "./src/styles"),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, "src/html/includes"),
        use: ["raw-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.bundle.css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/favicon.ico",
          to: "favicon.ico",
        },
        {
          from: "src/images",
          to: "images",
        },
      ],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ].concat(pages),
  performance: {
    hints: false,
  },
  devServer: {
    port: 3000,
    hot: false,
    liveReload: true,
    proxy: {
      "/api": {
        target: "http://localhost:3010",
      },
    },
  },
};
