'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newBaskets;

describe('Baskets API:', function() {
  describe('GET /api/basketss', function() {
    var basketss;

    beforeEach(function(done) {
      request(app)
        .get('/api/basketss')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          basketss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(basketss).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/basketss', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/basketss')
        .send({
        //  name: 'New Baskets',
         // info: 'This is the brand new baskets!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBaskets = res.body;
          done();
        });
    });

    it('should respond with the newly created baskets', function() {
     // expect(newBaskets.name).to.equal('New Baskets');
      //expect(newBaskets.info).to.equal('This is the brand new baskets!!!');
    });
  });

  describe('GET /api/basketss/:id', function() {
    var baskets;

    beforeEach(function(done) {
      request(app)
        .get(`/api/basketss/${newBaskets._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          baskets = res.body;
          done();
        });
    });

    afterEach(function() {
      baskets = {};
    });

    it('should respond with the requested baskets', function() {
      //expect(baskets.name).to.equal('New Baskets');
      //expect(baskets.info).to.equal('This is the brand new baskets!!!');
    });
  });

  describe('PUT /api/basketss/:id', function() {
    var updatedBaskets;

    beforeEach(function(done) {
      request(app)
        .put(`/api/basketss/${newBaskets._id}`)
        .send({
          //name: 'Updated Baskets',
          //info: 'This is the updated baskets!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBaskets = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBaskets = {};
    });

    it('should respond with the updated baskets', function() {
      //expect(updatedBaskets.name).to.equal('Updated Baskets');
      //expect(updatedBaskets.info).to.equal('This is the updated baskets!!!');
    });

    it('should respond with the updated baskets on a subsequent GET', function(done) {
      request(app)
        .get(`/api/basketss/${newBaskets._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let baskets = res.body;

          //expect(baskets.name).to.equal('Updated Baskets');
          //expect(baskets.info).to.equal('This is the updated baskets!!!');

          done();
        });
    });
  });

  describe('PATCH /api/basketss/:id', function() {
    var patchedBaskets;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/basketss/${newBaskets._id}`)
        .send([
          //{ op: 'replace', path: '/name', value: 'Patched Baskets' },
          //{ op: 'replace', path: '/info', value: 'This is the patched baskets!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBaskets = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBaskets = {};
    });

    it('should respond with the patched baskets', function() {
      //expect(patchedBaskets.name).to.equal('Patched Baskets');
      //expect(patchedBaskets.info).to.equal('This is the patched baskets!!!');
    });
  });

  describe('DELETE /api/basketss/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/basketss/${newBaskets._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when baskets does not exist', function(done) {
      request(app)
        .delete(`/api/basketss/${newBaskets._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
