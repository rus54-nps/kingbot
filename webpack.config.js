const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  // ...остальные настройки
  plugins: [
    // ...другие плагины
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './src/service-worker.js',  // путь к вашему service-worker.js
      swDest: 'service-worker.js',       // итоговое местоположение service-worker.js
    }),
  ],
};
