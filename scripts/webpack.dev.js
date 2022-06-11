const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
    mode: "development",
    cache: false,
    devtool: "eval-source-map", // 开发时，开启这个； 打包时需要关掉
    devServer: {
        static: {
            directory: path.join(__dirname, "../public")
        },
        port: 5000,
        compress: true,
        open: true,
        hot: true,
        client: { progress: true },
        // proxy: {
        //     "/api": {
        //         target: "http://localhost:3000",
        //         pathRewrite: {
        //             "/api": ""
        //         }
        //     }
        // }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        })
    ]
});