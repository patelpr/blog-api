const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const should = chai.should();

chai.use(chaiHttp);


describe('BlogPosts', function () {

    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });
    it('should list all blog posts', function () {
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);
                const expectedKeys = ['title', 'content', 'author', 'publishDate'];
                res.body.forEach(function (item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    })


    it('should add a blog post on POST', function () {
        const newItem = {
            title: 'Thanks for your help!',
            content: 'Learning.. Learning, learnin',
            author: 'Rastafarian',
            publishDate: '8/17/17'
        };
        return chai.request(app)
            .post('/blog-posts')
            .send(newItem)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys('title', 'content', 'author', 'publishDate');
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(Object.assign(newItem, { id: res.body.id }));
            });
    });
    it('should update posts on PUT', function () {
        const updateData = {
            title: 'Thanks for your help!',
            content: 'Learning.. Learning, learnin',
            author: 'Rastafarian',
            publishDate: '8/17/17'
        };
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData);
            })
    });
    it('should delete items on DELETE', function () {
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`);
            })
            .then(function (res) {
                res.should.have.status(204);
            });
    });
});