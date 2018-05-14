'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var basketsCtrlStub = {
  index: 'basketsCtrl.index',
  show: 'basketsCtrl.show',
  create: 'basketsCtrl.create',
  upsert: 'basketsCtrl.upsert',
  patch: 'basketsCtrl.patch',
  destroy: 'basketsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var basketsIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './baskets.controller': basketsCtrlStub
});

describe('Baskets API Router:', function() {
  it('should return an express router instance', function() {
    expect(basketsIndex).to.equal(routerStub);
  });

  describe('GET /api/basketss', function() {
    it('should route to baskets.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'basketsCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/basketss/:id', function() {
    it('should route to baskets.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'basketsCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/basketss', function() {
    it('should route to baskets.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'basketsCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/basketss/:id', function() {
    it('should route to baskets.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'basketsCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/basketss/:id', function() {
    it('should route to baskets.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'basketsCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/basketss/:id', function() {
    it('should route to baskets.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'basketsCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
