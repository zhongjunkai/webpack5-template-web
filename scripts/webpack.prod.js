const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const TerserPlugin = require("terser-webpack-plugin");

const resolve = (relativePath) => {
    return path.resolve(__dirname, relativePath);
};

module.exports = merge(baseConfig, {
    mode: "production",
    cache: { type: "filesystem" },
    devtool: false, // 开发时，开启这个； 打包时需要关掉
    output: {
        filename: "js/[name].[chunkhash:8].js",
        path: resolve("../dist"),
        publicPath: "./" // 打包后html引入的文件会在路径前加上publicPath设置的前缀
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin({
                parallel: true
            })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css"
        }),
        new CleanWebpackPlugin()
    ]
});