'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var customersCtrlStub = {
  index: 'customersCtrl.index',
  show: 'customersCtrl.show',
  create: 'customersCtrl.create',
  upsert: 'customersCtrl.upsert',
  patch: 'customersCtrl.patch',
  destroy: 'customersCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var customersIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './customers.controller': customersCtrlStub
});

describe('Customers API Router:', function() {
  it('should return an express router instance', function() {
    expect(customersIndex).to.equal(routerStub);
  });

  describe('GET /api/customerss', function() {
    it('should route to customers.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'customersCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/customerss/:id', function() {
    it('should route to customers.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'customersCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/customerss', function() {
    it('should route to customers.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'customersCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/customerss/:id', function() {
    it('should route to customers.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'customersCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/customerss/:id', function() {
    it('should route to customers.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'customersCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/customerss/:id', function() {
    it('should route to customers.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'customersCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
