'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var ordersCtrlStub = {
  index: 'ordersCtrl.index',
  show: 'ordersCtrl.show',
  create: 'ordersCtrl.create',
  upsert: 'ordersCtrl.upsert',
  patch: 'ordersCtrl.patch',
  destroy: 'ordersCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ordersIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './orders.controller': ordersCtrlStub
});

describe('Orders API Router:', function() {
  it('should return an express router instance', function() {
    expect(ordersIndex).to.equal(routerStub);
  });

  describe('GET /api/orderss', function() {
    it('should route to orders.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'ordersCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/orderss/:id', function() {
    it('should route to orders.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'ordersCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/orderss', function() {
    it('should route to orders.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'ordersCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/orderss/:id', function() {
    it('should route to orders.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'ordersCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/orderss/:id', function() {
    it('should route to orders.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'ordersCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/orderss/:id', function() {
    it('should route to orders.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'ordersCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
