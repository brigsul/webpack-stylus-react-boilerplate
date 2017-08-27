const webpack = require('webpack') // webpack
const path = require('path') // nodejs dep for paths
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin') // dep to extract stylus into css file
const UglifyJSPlugin = require('uglifyjs-webpack-plugin') // uglify dep for minimization
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin')

let config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'output.js'    
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.styl', '.css', '.jpeg', ',jpg', '.gif', '.png'], // automatically resolve these extensions
        alias: {
            images: path.resolve(__dirname, 'src/assets/images')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/, //files ending with .js
                exclude: /node_modules/, // exclude the node_modules direcotry
                loader: "babel-loader"
            },
            {
                test: /\.styl$/i, // files ending with .styl
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'stylus-loader',
                    ]
                })
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ['file-loader?context=src/assets/images/&name=images/[path][name].[ext]', {
                    loader: 'image-webpack-loader',
                    query: {
                        mozjpeg: {
                            progressive: true,
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        optipng: {
                            optimizationLevel: 4,
                        },
                        pngquant: {
                            quality: '75-90',
                            speed: 3,
                        },
                    },
                }],
                exclude: /node_modules/,
                include: __dirname,
            },
        ]
    },
    plugins: [
        new ExtractTextWebpackPlugin('styles.css'), // call the ExtractText plugin to compile .css
        
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './public'), // A directory or URL to serve HTML content from
        historyApiFallback: true, // fallback to /index.html for Single Page Applications
        inline: true, // inline mode (set to false to disable including client scripts (like livereload)
        open: true, // open default browser while launching
    },
    devtool: 'eval-source-map'
}

module.exports = config

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new UglifyJSPlugin(), // call the uglifiy plugin
        new OptimizeCSSAssets() // call the css optimizer
    )
}