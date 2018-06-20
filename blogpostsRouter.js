const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid');

const {BlogPosts} = require('./models');

router.get('/', (req, res) => {
    BlogPosts
    .find()
    .then(blogpost => {
      res.json(blogpost.map(blogpost => blogpost.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
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
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        // publishDate: req.body.publishDate || Date.now()
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
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(updatedBlogPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {
    BlogPosts
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}))
    ;
});

router.use('*', function (req, res) {
    res.status(404).json({message: 'Not Found'});
})

module.exports = router;