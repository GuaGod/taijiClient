const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        manageGame: path.resolve(__dirname, '../src/pages/manageGame/manageGame.js'),
        createNewGame: path.resolve(__dirname, '../src/pages/createNewGame/createNewGame.js'),
        defineProject: path.resolve(__dirname, '../src/pages/defineProject/defineProject.js'),
        mGetGameDetail: path.resolve(__dirname, '../src/pages/mGetGameDetail/mGetGameDetail.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: 'pages/[name]/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(jpg|jpeg|gif|png)$/,
                loader:'file-loader',
                options: {
                    filename:'[name].[ext]',
                    publicPath: '../assets/imgs',
                    outputPath: './assets/imgs'
                },
                exclude: path.resolve(__dirname, '../node_modules')
            },{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, '../node_modules')
            },{
                test: /\.less$/,
                use:ExtractTextWebpackPlugin.extract({
                    fallback:{
                        loader:'style-loader',
                        options: {
                            sourceMap:true
                        }
                    },
                    use:[{
                        loader:'css-loader',
                        options: {
                            sourceMap: true
                        },
                    },{
                        loader: 'less-loader',
                        options: {
                            sourceMap: true
                        }
                    }]
                }),
                exclude: path.resolve(__dirname, '../node_modules')
            }, {
                test: /\.css$/,
                use:ExtractTextWebpackPlugin.extract({
                    fallback:{
                        loader:'style-loader',
                        options: {
                            sourceMap:true
                        }
                    },
                    use:[{
                        loader:'css-loader',
                        options: {
                            sourceMap: true
                        },
                    }]
                })
            },
            {
                test: /\.(htm|html)$/,
                use: ['html-withimg-loader']
            }
        ]
    },
    plugins: [
        
        new ExtractTextWebpackPlugin({
            filename: 'pages/[name]/[name].min.css'
        }),
        
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/pages/manageGame/manageGame.html'),
            filename: 'pages/manageGame/manageGame.html',
            inject: true,
            chunks: ['manageGame']
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/pages/createNewGame/createNewGame.html'),
            filename: 'pages/createNewGame/createNewGame.html',
            inject: true,
            chunks: ['createNewGame']
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/pages/defineProject/defineProject.html'),
            filename: 'pages/defineProject/defineProject.html',
            inject: true,
            chunks: ['defineProject']
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/pages/mGetGameDetail/mGetGameDetail.html'),
            filename: 'pages/mGetGameDetail/mGetGameDetail.html',
            inject: true,
            chunks: ['mGetGameDetail']
        }),
    ]
}