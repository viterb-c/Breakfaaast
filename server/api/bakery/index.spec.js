'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var bakeryCtrlStub = {
  index: 'bakeryCtrl.index',
  show: 'bakeryCtrl.show',
  create: 'bakeryCtrl.create',
  upsert: 'bakeryCtrl.upsert',
  patch: 'bakeryCtrl.patch',
  destroy: 'bakeryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var bakeryIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './bakery.controller': bakeryCtrlStub
});

describe('Bakery API Router:', function() {
  it('should return an express router instance', function() {
    expect(bakeryIndex).to.equal(routerStub);
  });

  describe('GET /api/bakerys', function() {
    it('should route to bakery.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'bakeryCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/bakerys/:id', function() {
    it('should route to bakery.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'bakeryCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/bakerys', function() {
    it('should route to bakery.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'bakeryCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/bakerys/:id', function() {
    it('should route to bakery.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'bakeryCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/bakerys/:id', function() {
    it('should route to bakery.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'bakeryCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/bakerys/:id', function() {
    it('should route to bakery.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'bakeryCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
