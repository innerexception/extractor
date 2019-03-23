const path = require('path')
const webpack= require('webpack')
module.exports = {
    entry: [
        "./index.tsx"
    ],
    output: {
        path: path.join(__dirname, './build'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    devtool: 'eval-source-map',
    resolve: {extensions: ['.js', '.jsx', '.ts', '.tsx']},
    plugins: [
        new webpack.WatchIgnorePlugin([
          /\.d\.ts$/
        ])
      ],
    module: {
        rules: [{
                test: /\.css$/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.ts|\.tsx$/,
                loader: "ts-loader",
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'url-loader?limit=100000',
                }]
            },
            {
                test: /sw.(j|t)s$/,
                use: [{
                    loader: 'file-loader',
                }]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ],
    },
};