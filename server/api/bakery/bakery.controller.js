/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bakerys              ->  index
 * POST    /api/bakerys              ->  create
 * GET     /api/bakerys/:id          ->  show
 * PUT     /api/bakerys/:id          ->  upsert
 * PATCH   /api/bakerys/:id          ->  patch
 * DELETE  /api/bakerys/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Bakery from './bakery.model';

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

// Gets a list of Bakerys
export function index(req, res) {
  return Bakery.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Bakery from the DB
export function show(req, res) {
  return Bakery.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Bakery in the DB
export function create(req, res) {
  return Bakery.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Create and add a new product to a bakery
export function addProduct(req, res) {
    Bakery.findById(req.params.id).exec();
}

// Upserts the given Bakery in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Bakery.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Bakery in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Bakery.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Bakery from the DB
export function destroy(req, res) {
  return Bakery.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
