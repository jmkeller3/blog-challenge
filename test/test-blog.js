const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('BlogPosts', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list blogposts on GET', function() {
        return chai.request(app)
            .get('/blogPosts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.above(0);

                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.have.all.keys('id', 'title', 'content', 'author', 'publishDate');
                });
            });
    });

    it('should add a blogpost on POST', function() {
        const newPost = {title: 'Fizz', content: 'fizzbuzz fizzbuzz fizzbuzz ', author: 'Buzz'};

        const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

        return chai.request(app)
            .post('/blogPosts')
            .send(newPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.all.keys(expectedKeys);
                expect(res.body.title).to.equal(newPost.title);
                expect(res.body.content).to.equal(newPost.content);
                expect(res.body.author).to.equal(newPost.author);
            });
    });

    it('should update blogPosts on PUT', function() {
        const updateData = {
            title: 'foo',
            content: 'foo bar foo bar foo bar foo bar foo bar foo bar foo bar foo bar foo bar foo bar foo bar',
            author: 'bar'
        };

        return chai.request(app)
            .get('/blogPosts')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blogPosts/${updateData.id}`)
                    .send(updateData);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });

    it('should delete blogposts on DELETE', function() {
        return chai.request(app)
            .get('/blogPosts')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blogPosts/${res.body[0].id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            })
    })
});