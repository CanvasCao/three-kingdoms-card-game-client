const path = require('path')
const baseConfig = require("./webpack.base.config")

module.exports = {
    ...baseConfig,
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        hot: true,
    },
}
