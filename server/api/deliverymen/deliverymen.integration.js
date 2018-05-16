'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDeliverymen;

describe('Deliverymen API:', function() {
  describe('GET /api/deliverymens', function() {
    var deliverymens;

    beforeEach(function(done) {
      request(app)
        .get('/api/deliverymens')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          deliverymens = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(deliverymens).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/deliverymens', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/deliverymens')
        .send({
          name: 'New Deliverymen'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDeliverymen = res.body;
          done();
        });
    });

    it('should respond with the newly created deliverymen', function() {
      expect(newDeliverymen.name).to.equal('New Deliverymen');
    });
  });

  describe('GET /api/deliverymens/:id', function() {
    var deliverymen;

    beforeEach(function(done) {
      request(app)
        .get(`/api/deliverymens/${newDeliverymen._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          deliverymen = res.body;
          done();
        });
    });

    afterEach(function() {
      deliverymen = {};
    });

    it('should respond with the requested deliverymen', function() {
      expect(deliverymen.name).to.equal('New Deliverymen');
    });
  });

  describe('PUT /api/deliverymens/:id', function() {
    var updatedDeliverymen;

    beforeEach(function(done) {
      request(app)
        .put(`/api/deliverymens/${newDeliverymen._id}`)
        .send({
          name: 'Updated Deliverymen'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDeliverymen = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDeliverymen = {};
    });

    it('should respond with the updated deliverymen', function() {
      expect(updatedDeliverymen.name).to.equal('Updated Deliverymen');
    });

    it('should respond with the updated deliverymen on a subsequent GET', function(done) {
      request(app)
        .get(`/api/deliverymens/${newDeliverymen._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let deliverymen = res.body;

          expect(deliverymen.name).to.equal('Updated Deliverymen');

          done();
        });
    });
  });

  describe('PATCH /api/deliverymens/:id', function() {
    var patchedDeliverymen;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/deliverymens/${newDeliverymen._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Deliverymen' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDeliverymen = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDeliverymen = {};
    });

    it('should respond with the patched deliverymen', function() {
      expect(patchedDeliverymen.name).to.equal('Patched Deliverymen');
    });
  });

  describe('DELETE /api/deliverymens/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/deliverymens/${newDeliverymen._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when deliverymen does not exist', function(done) {
      request(app)
        .delete(`/api/deliverymens/${newDeliverymen._id}`)
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
