'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var productCtrlStub = {
  index: 'productCtrl.index',
  show: 'productCtrl.show',
  create: 'productCtrl.create',
  upsert: 'productCtrl.upsert',
  patch: 'productCtrl.patch',
  destroy: 'productCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './product.controller': productCtrlStub
});

describe('Product API Router:', function() {
  it('should return an express router instance', function() {
    expect(productIndex).to.equal(routerStub);
  });

  describe('GET /api/products', function() {
    it('should route to product.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'productCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/products/:id', function() {
    it('should route to product.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'productCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/products', function() {
    it('should route to product.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'productCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/products/:id', function() {
    it('should route to product.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'productCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/products/:id', function() {
    it('should route to product.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'productCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/products/:id', function() {
    it('should route to product.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'productCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
