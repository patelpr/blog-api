const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const { BlogPosts } = require('./models');


router.get('/posts', (req, res) => {
    BlogPosts
        .find()
        .then(posts => {
            res.json({
                posts: posts.map(
                    (post) => post.apiRepr())
            });
        })
        .catch(
        err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

router.get('/posts/:id', (req, res) => {
    BlogPosts
        .findById(req.params.id)
        .then(post => res.json(post.apiRepr()))
})

router.post('/posts', (req, res) => {
    const item = BlogPosts.create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    })
        .then(
        post => res.status(201).json(post.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
})

router.delete('/posts/:id', (req, res) => {
    BlogPosts.findByIdAndRemove(req.params.id)
        .then(post => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }))
})

router.put('/posts/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        res.status(400).json({ message: message });
    }

    // we only support a subset of fields being updateable.
    // if the user sent over any of the updatableFields, we udpate those values
    // in document
    const toUpdate = {};
    const updateableFields = ['name', 'borough', 'cuisine', 'address'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    BlogPosts
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .exec()
        .then(restaurant => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
})

module.exports = router;