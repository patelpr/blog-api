const express = require('express');
const mongoose = require('mongoose');
const blogPostsRouter = require('./blogPostsRouter');
mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const app = express();

app.use('/', blogPostsRouter);
function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://USERR:USERR@ds017553.mlab.com:17553/blog',{useMongoClient: true}, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, () => {
                console.log(`Your app is listening on port ${PORT}`);
                resolve();
            })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };