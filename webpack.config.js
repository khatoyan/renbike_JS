const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const directory = path.resolve(__dirname, 'build');

const pages = [
    {filename: 'index.html', content: './pages/index.html', title: 'Homepage'},
    {filename: 'inner.html', content: './pages/inner.html', title: 'Inner page'},
].map(row => new HtmlWebpackPlugin({
    ...row,
    template: './pages/_layout.html',
    inject: 'body',
    templateParameters: () =>
        ({pageContent: fs.readFileSync(row.content, 'utf8'), title: row.title})
}));

module.exports = {
    entry: './src/index.js',
    output: {
        path: directory,
    },
    plugins: pages,
    devServer: {
        static: {
            directory,
        },
        compress: true,
        port: 3000,
    },
    mode: "development"
}
