let mongoose = require('mongoose');

let baseUrl = 'mongodb://localhost:27017/';
let appName = 'TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect(baseUrl + appName, { useNewUrlParser: true });

module.exports = {mongoose};