const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid');

const {BlogPosts} = require('./models');

router.get('/', (req, res) => {
    BlogPosts.find().then(blogposts => {
        res.json({
            blogposts: blogposts.map(
                (blogpost.serialize()))
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    })
});

router.get('/:id', (req, res) => {
    BlogPosts
    .findById(req.params.id)
    .then(blogpost => res.json(blogpost.serialize()))
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.log(message);
            return res.status(400).send(message);
        }
    }

    BlogPosts
    .create({
        id: uuid.v4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate || Date.now()
    })
    .then(blogpost => res.status(201).json(blogpost.serialize()))
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
          `Request path id (${req.params.id}) and request body id ` +
          `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({ message: message });
      }
    
    console.log(`Updating blogpost item \`${req.params.id}\``);
    const toUpdate = {};
    const updateableFields = ['title', 'author', 'content'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    BlogPosts
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(blogpost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {
    BlogPosts
    .findByIdAndRemove(req.params.id)
    .then(blogpost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}))
    ;
});

module.exports = router;