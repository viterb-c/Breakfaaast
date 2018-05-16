'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newBakery;

describe('Bakery API:', function() {
  describe('GET /api/bakerys', function() {
    var bakerys;

    beforeEach(function(done) {
      request(app)
        .get('/api/bakerys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          bakerys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(bakerys).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/bakerys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/bakerys')
        .send({
          name: 'New Bakery',
          address: 'Addresse de ma nouvelle bakery !!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBakery = res.body;
          done();
        });
    });

    it('should respond with the newly created bakery', function() {
      expect(newBakery.name).to.equal('New Bakery');
      expect(newBakery.address).to.equal('Addresse de ma nouvelle bakery !!');
    });
  });

  describe('GET /api/bakerys/:id', function() {
    var bakery;

    beforeEach(function(done) {
      request(app)
        .get(`/api/bakerys/${newBakery._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          bakery = res.body;
          done();
        });
    });

    afterEach(function() {
      bakery = {};
    });

    it('should respond with the requested bakery', function() {
      expect(bakery.name).to.equal('New Bakery');
      expect(bakery.info).to.equal('This is the brand new bakery!!!');
    });
  });

  describe('PUT /api/bakerys/:id', function() {
    var updatedBakery;

    beforeEach(function(done) {
      request(app)
        .put(`/api/bakerys/${newBakery._id}`)
        .send({
          name: 'Updated Bakery',
          info: 'This is the updated bakery!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBakery = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBakery = {};
    });

    it('should respond with the updated bakery', function() {
      expect(updatedBakery.name).to.equal('Updated Bakery');
      expect(updatedBakery.info).to.equal('This is the updated bakery!!!');
    });

    it('should respond with the updated bakery on a subsequent GET', function(done) {
      request(app)
        .get(`/api/bakerys/${newBakery._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let bakery = res.body;

          expect(bakery.name).to.equal('Updated Bakery');
          expect(bakery.info).to.equal('This is the updated bakery!!!');

          done();
        });
    });
  });

  describe('PATCH /api/bakerys/:id', function() {
    var patchedBakery;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/bakerys/${newBakery._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Bakery' },
          { op: 'replace', path: '/info', value: 'This is the patched bakery!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBakery = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBakery = {};
    });

    it('should respond with the patched bakery', function() {
      expect(patchedBakery.name).to.equal('Patched Bakery');
      expect(patchedBakery.info).to.equal('This is the patched bakery!!!');
    });
  });

  describe('DELETE /api/bakerys/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/bakerys/${newBakery._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when bakery does not exist', function(done) {
      request(app)
        .delete(`/api/bakerys/${newBakery._id}`)
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
