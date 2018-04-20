/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/deliverymens              ->  index
 * POST    /api/deliverymens              ->  create
 * GET     /api/deliverymens/:id          ->  show
 * PUT     /api/deliverymens/:id          ->  upsert
 * PATCH   /api/deliverymens/:id          ->  patch
 * DELETE  /api/deliverymens/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Deliverymen from './deliverymen.model';

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

// Gets a list of Deliverymens
export function index(req, res) {
  return Deliverymen.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Deliverymen from the DB
export function show(req, res) {
  return Deliverymen.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Deliverymen in the DB
export function create(req, res) {
  return Deliverymen.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Deliverymen in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Deliverymen.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Deliverymen in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Deliverymen.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Deliverymen from the DB
export function destroy(req, res) {
  return Deliverymen.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
