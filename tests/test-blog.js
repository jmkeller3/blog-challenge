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
                expect(res.body.length).to.be.at.least(2);
                const expectedKeys = ['id', 'title', 'content', 'author'];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it('should add a blogpost on POST', function() {
        const newItem = {title: 'Fizz', content: 'fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz fizzbuzz', author: 'Buzz'};
        return chai.request(app)
            .post('/blogPosts')
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'title', 'contnet', 'author');
                expect(res.body).to.not.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newItem, {id:res.body.id}));
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
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.deep.equal(updateData);
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