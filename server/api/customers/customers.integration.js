'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCustomers;

describe('Customers API:', function() {
  describe('GET /api/customerss', function() {
    var customerss;

    beforeEach(function(done) {
      request(app)
        .get('/api/customerss')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          customerss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(customerss).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/customerss', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/customerss')
        .send({
          name: 'New Customers',
          address: 'This is my address'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCustomers = res.body;
          done();
        });
    });

    it('should respond with the newly created customers', function() {
      expect(newCustomers.name).to.equal('New Customers');
      expect(newCustomers.address).to.equal('This is my address');
    });
  });

  describe('GET /api/customerss/:id', function() {
    var customers;

    beforeEach(function(done) {
      request(app)
        .get(`/api/customerss/${newCustomers._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          customers = res.body;
          done();
        });
    });

    afterEach(function() {
      customers = {};
    });

    it('should respond with the requested customers', function() {
      expect(customers.name).to.equal('New Customers');
      expect(customers.address).to.equal('This is my address');
    });
  });

  describe('PUT /api/customerss/:id', function() {
    var updatedCustomers;

    beforeEach(function(done) {
      request(app)
        .put(`/api/customerss/${newCustomers._id}`)
        .send({
          name: 'Updated Customers',
          address: 'This is my address'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCustomers = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCustomers = {};
    });

    it('should respond with the updated customers', function() {
      expect(updatedCustomers.name).to.equal('Updated Customers');
      expect(updatedCustomers.address).to.equal('This is my address');
    });

    it('should respond with the updated customers on a subsequent GET', function(done) {
      request(app)
        .get(`/api/customerss/${newCustomers._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let customers = res.body;

          expect(customers.name).to.equal('Updated Customers');
          expect(customers.address).to.equal('This is my address');

          done();
        });
    });
  });

  describe('PATCH /api/customerss/:id', function() {
    var patchedCustomers;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/customerss/${newCustomers._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Customers' },
          { op: 'replace', path: '/address', value: 'This is my address' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCustomers = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCustomers = {};
    });

    it('should respond with the patched customers', function() {
      expect(patchedCustomers.name).to.equal('Patched Customers');
      expect(patchedCustomers.address).to.equal('This is my address');
    });
  });

  describe('DELETE /api/customerss/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/customerss/${newCustomers._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when customers does not exist', function(done) {
      request(app)
        .delete(`/api/customerss/${newCustomers._id}`)
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
