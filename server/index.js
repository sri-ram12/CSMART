const serverApp = require('./dist/index.js');
const app = serverApp.default || serverApp;
module.exports = app;
