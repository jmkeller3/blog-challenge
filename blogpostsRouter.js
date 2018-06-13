const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Blogposts} = require('./models');

//sample blogs
BlogPosts.create('Who is Who at Whoville', 'Many are wondering who is top who for the whoville whovest . . .', 'Gary Whoster');
BlogPosts.create('A Cat Sat on the Bat', 'My Thomas is an extraordinary creature who does amazing . . .', 'Cindy Walker');
BlogPosts.create('Help Needed!', 'I need twelve large men to help my aunt move her Organ from the 12th . . .', 'Larry Tulip');

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParer, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.log(message);
            return res.status(400).send(message);
        }
    }

    const item = BlogPosts.create(req.body.name, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});

router.put('/:id', jsonParer, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.log(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id(${req.body.id}) must match`;
        console.log(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blogpost item \`${req.params.id}\``);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).end();
})

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blogpost \`${req.params.id}\``);
    res.status(204).end();
});

module.exports = router;