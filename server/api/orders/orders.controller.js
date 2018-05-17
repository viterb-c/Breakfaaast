/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orderss              ->  index
 * POST    /api/orderss              ->  create
 * GET     /api/orderss/:id          ->  show
 * PUT     /api/orderss/:id          ->  upsert
 * PATCH   /api/orderss/:id          ->  patch
 * DELETE  /api/orderss/:id          ->  destroy
 */


'use strict';

import jsonpatch from 'fast-json-patch';
import Order from './orders.model';
import User from '../user/user.model';
import Deliverymen from '../deliverymen/deliverymen.model';
import Bakery from '../bakery/bakery.model';
import Product from '../product/product.model';
import mongoose from 'mongoose';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Orderss
export function index(req, res) {
  return Order.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Orders from the DB
export function show(req, res) {
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Orders in the DB
export function create(req, res) {
  return Order.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Orders in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Orders.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Orders in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Orders from the DB
export function destroy(req, res) {
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function createOrderForUser(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return handleEntityNotFound(res, 'User')(undefined);
    }
    return User.findById(req.params.id).exec()
        .then(user => {
            return Bakery.findById(req.body.bakery).exec()
                .then(bakery_ => {
                    let order = new Order({
                        customer: user,
                        bakery: bakery_
                    });
                    return order.save()
                        .then(function () {
                            bakery_.orders.push(order);
                            return bakery_.save()
                                .then(function () {
                                    user.orders_id.push(order);
                                    return user.save()
                                        .then(respondWithResult(res, 201)(order))
                                })
                        })
                })
        })
}

export function addProduct (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return handleEntityNotFound(res, 'Order')(undefined);
    }
    return Order.findById(req.params.id).exec()
        .then(order => {
          Product.findById(req.body.product_id).exec()
              .then(product => {
                order.products.push(product);
                return order.save()
                    .then(order => {
                      return Order.populate(order, 'products')
                          .then(respondWithResult(res, 201))
                          .catch(handleError(res));
                    })
                    .catch(handleError(res));
              })
              .catch(handleError(res));
        })
        .catch(handleError(res));
}
