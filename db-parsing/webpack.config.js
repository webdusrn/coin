var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var webpack = require('webpack');

var path = require('path');
var fs = require('fs');
var pagesPath = path.resolve(__dirname, "./app/client/pages");
var pages = fs.readdirSync(pagesPath);
var entry = {};

pages.forEach(function (page) {
    if (page != '.DS_Store') {
        entry['sg-' + page] = "./app/client/pages/" + page + "/app." + page + ".js";
        entry['sg-' + page + '-core'] = "./app/client/pages/" + page + "/app." + page + "-core.js";
    }
});

var ENV = process.env.NODE_ENV;

var config = {};

config.stats = {
    colors: true,
    reasons: false
};

config.entry = entry;

config.resolve = {
    modulesDirectories: [
        path.resolve('./app/node_modules'),
        path.resolve('./node_modules')
    ]
};

config.output = {
    publicPath: __dirname,
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    chunkFilename: "[name].js"
};

config.module = {
    preLoaders: [],
    loaders: [{
        test: /\.ejs$/, loader: 'ejs-loader?variable=data'
    }, {
        test: /\.scss|.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
    }, {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
    }, {
        test: /\.(jpg|png|svg)$/,
        loader: 'file?name=public/images/[name].[ext]'
    }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=public/fonts/[name].[ext]'
    }]
};

config.plugins = [
    // new webpack.optimize.CommonsChunkPlugin('sg-lib.js'),
    new ExtractTextPlugin("[name].css", {
        allChunks: true
    })
];

if (ENV == 'production') {
    config.plugins.push(
        new ngAnnotatePlugin({
            add: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin()
    )
} else {
    config.devtool = 'source-map';
    // config.watch = true;
    // config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config;