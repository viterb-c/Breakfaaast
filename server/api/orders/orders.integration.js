'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newOrders;

describe('Orders API:', function() {
  describe('GET /api/orderss', function() {
    var orderss;

    beforeEach(function(done) {
      request(app)
        .get('/api/orderss')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          orderss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(orderss).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/orderss', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/orderss')
        .send({
          name: 'New Orders',
          info: 'This is the brand new orders!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newOrders = res.body;
          done();
        });
    });

    it('should respond with the newly created orders', function() {
      expect(newOrders.name).to.equal('New Orders');
      expect(newOrders.info).to.equal('This is the brand new orders!!!');
    });
  });

  describe('GET /api/orderss/:id', function() {
    var orders;

    beforeEach(function(done) {
      request(app)
        .get(`/api/orderss/${newOrders._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          orders = res.body;
          done();
        });
    });

    afterEach(function() {
      orders = {};
    });

    it('should respond with the requested orders', function() {
      expect(orders.name).to.equal('New Orders');
      expect(orders.info).to.equal('This is the brand new orders!!!');
    });
  });

  describe('PUT /api/orderss/:id', function() {
    var updatedOrders;

    beforeEach(function(done) {
      request(app)
        .put(`/api/orderss/${newOrders._id}`)
        .send({
          name: 'Updated Orders',
          info: 'This is the updated orders!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedOrders = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOrders = {};
    });

    it('should respond with the updated orders', function() {
      expect(updatedOrders.name).to.equal('Updated Orders');
      expect(updatedOrders.info).to.equal('This is the updated orders!!!');
    });

    it('should respond with the updated orders on a subsequent GET', function(done) {
      request(app)
        .get(`/api/orderss/${newOrders._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let orders = res.body;

          expect(orders.name).to.equal('Updated Orders');
          expect(orders.info).to.equal('This is the updated orders!!!');

          done();
        });
    });
  });

  describe('PATCH /api/orderss/:id', function() {
    var patchedOrders;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/orderss/${newOrders._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Orders' },
          { op: 'replace', path: '/info', value: 'This is the patched orders!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedOrders = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedOrders = {};
    });

    it('should respond with the patched orders', function() {
      expect(patchedOrders.name).to.equal('Patched Orders');
      expect(patchedOrders.info).to.equal('This is the patched orders!!!');
    });
  });

  describe('DELETE /api/orderss/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/orderss/${newOrders._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when orders does not exist', function(done) {
      request(app)
        .delete(`/api/orderss/${newOrders._id}`)
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
