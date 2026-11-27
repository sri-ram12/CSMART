const app = require('../server/dist/bundle.js');
module.exports = app.default || app;
