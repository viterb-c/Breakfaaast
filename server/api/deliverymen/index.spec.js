'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var deliverymenCtrlStub = {
  index: 'deliverymenCtrl.index',
  show: 'deliverymenCtrl.show',
  create: 'deliverymenCtrl.create',
  upsert: 'deliverymenCtrl.upsert',
  patch: 'deliverymenCtrl.patch',
  destroy: 'deliverymenCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var deliverymenIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './deliverymen.controller': deliverymenCtrlStub
});

describe('Deliverymen API Router:', function() {
  it('should return an express router instance', function() {
    expect(deliverymenIndex).to.equal(routerStub);
  });

  describe('GET /api/deliverymens', function() {
    it('should route to deliverymen.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'deliverymenCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/deliverymens/:id', function() {
    it('should route to deliverymen.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'deliverymenCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/deliverymens', function() {
    it('should route to deliverymen.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'deliverymenCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/deliverymens/:id', function() {
    it('should route to deliverymen.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'deliverymenCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/deliverymens/:id', function() {
    it('should route to deliverymen.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'deliverymenCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/deliverymens/:id', function() {
    it('should route to deliverymen.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'deliverymenCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
