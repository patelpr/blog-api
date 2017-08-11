exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       'mongodb://USERR:USERR@ds017553.mlab.com:17553/blog';
exports.PORT = process.env.PORT || 8080;