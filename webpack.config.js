const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  // ...другие настройки
  plugins: [
    // ...другие плагины
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
    }),
  ],
};
