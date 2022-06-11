const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const resolve = (relativePath) => {
    return path.resolve(__dirname, relativePath);
};

module.exports = {
    performance: false, // 不显示warning (不显示性能相关的警告提示)
    entry: {
        index: resolve("../src/main.js") // 入口文件
    },
    output: {
        filename: "js/[name].[chunkhash:8].js",
        path: resolve("../dist"),
        publicPath: "/" // 打包后html引入的文件会在路径前加上publicPath设置的前缀
    },
    resolve: {
        modules: [resolve("../node_modules")],
        alias: {
            "vue": resolve("../node_modules/vue/dist/vue.esm-browser.prod.js"),
            "vue-router": resolve("../node_modules/vue-router/dist/vue-router.esm-browser.js"),
            "@": resolve("../src")
        },
        mainFiles: ["index", "main"],
        extensions: [".js", ".json", ".scss"]
    },
    optimization: {
        usedExports: true,
        runtimeChunk: {
            name: "runtime"
        },
        splitChunks: {
            chunks: "all", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
            minSize: 30000, // 模块超过30k自动被抽离成公共模块
            minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
            minChunks: 1, // 模块被引用>=1次，便分割
            name: "[name][chunkhash:8].js", // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
            automaticNameDelimiter: "~", // 命名分隔符
            cacheGroups: {
                default: { // 模块缓存规则，设置为false，默认缓存组将禁用
                    minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
                    priority: -20, // 优先级
                    reuseExistingChunk: true, // 默认使用已有的模块
                },
                vue: {
                    test: /[\\/]node_modules[\\/](vue|vue-router)/,
                    name: "vue",
                    priority: 1,
                    reuseExistingChunk: true,
                    enforce: true
                },
                antd: {
                    test: /[\\/]node_modules[\\/]ant-design-vue/,
                    name: "antd",
                    priority: 5,
                    reuseExistingChunk: true,
                    enforce: true
                },
                // icons: {
                //     test: /[\\/]node_modules[\\/]@ant-design[\\/]icons-vue/,
                //     name: "icons",
                //     priority: 6,
                //     reuseExistingChunk: true
                // },
                vendor: {
                    // 过滤需要打入的模块
                    test: module => {
                        if (module.resource) {
                            const include = [/[\\/]node_modules[\\/]/].every(reg => {
                                return reg.test(module.resource);
                            });
                            const exclude = [/[\\/]node_modules[\\/](vue|vue-router|ant-design-vue)/].some(reg => {
                                return reg.test(module.resource);
                            });
                            return include && !exclude;
                        }
                        return false;
                    },
                    // test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    // minChunks: 1,
                    priority: 10, // 确定模块打入的优先级
                    reuseExistingChunk: true, // 使用复用已经存在的模块
                    enforce: true,
                },
                // styles: {
                //     name: "styles",
                //     test: /\.(s?css|css|sass)$/,
                //     chunks: "all",
                //     enforce: true,
                //     priority: 10
                // }
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /public/,
                use: {
                    loader: "raw-loader",
                    options: {
                        esModule: false
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: require.resolve("sass-resources-loader"),
                        options: {
                            resources: [
                                resolve("../src/assets/styles/index.scss")
                            ]
                        }
                    }
                ]
            },
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: "eslint-loader",
            //         options: {
            //             enforce: "pre" // 定义为前置loader,在normal的loader前执行
            //         }
            //     }
            // },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"], // 将es6转为es5
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                },
                include: resolve("../src"),
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|svg|gif)$/,
                exclude: /node_modules/,
                type: "asset", // asset/inline    asset/resouce
                generator: {
                    filename: "img/[hash][ext][query]" // 局部指定输出位置
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 限制8kb
                    }
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[hash][ext][query]"
                }
            },
            {
                test: /\.txt/, // 引入一个txt文件
                exclude: /node_modules/,
                type: "asset/source"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve("../public/index.html"),
            filename: "index.html",
            chunks: ["index"],
            minify: { removeAttributeQuotes: true, collapseWhitespace: true, removeComments: true },
            hash: true // 引入文件带上hash戳
        })
    ]
};