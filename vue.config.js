module.exports = {
  devServer: {
    open: true, //是否自動彈出瀏覽器頁面
    host: "localhost",
    port: 8080,
    proxy: "https://www.travel.taipei/",
  },
};
