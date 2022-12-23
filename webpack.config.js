const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        hot: true,
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    entry: {
        main: path.resolve(__dirname, './src/index.ts'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
                exclude: /node_modules/,
            },
            // JavaScript
            {
                test: /\.(j)sx?$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            // CSS, PostCSS, and Sass
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'), // template file
            filename: 'index.html', // output file
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
}