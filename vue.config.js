module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer:{
        
        port: 8081,
        proxy:{
            "/api":{
                target:"http://jianyi.mynatapp.cc/",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }

            }
        }
    },

}