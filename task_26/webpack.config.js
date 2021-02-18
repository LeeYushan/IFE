const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: "js/built.js",
        path: resolve(__dirname, 'build'),
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath:'../'
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },

            {
                test: /\.(jpg|png)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    name: 'imgs/[hash:10].[ext]'
                }
            },
            {
                test: /^\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'css/built.css'
        })
    ],
    mode: 'development'
}