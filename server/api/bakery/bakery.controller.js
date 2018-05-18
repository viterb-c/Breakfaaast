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

import mongoose from 'mongoose';
import jsonpatch from 'fast-json-patch';
import Bakery from './bakery.model';
import Product from '../product/product.model'
import config from "../../config/environment";
import async from 'async';

var geocoder = require('node-geocoder')(config.geocoder.provider, config.geocoder.httpAdapter, config.geocoder.extra);

/**
 * Function used to find lat / long from a location
 * @param req
 * @param cb
 * @returns {*}
 */
function geolocation(req, cb) {
    console.log("debut geolocation");
    if (req.body.address) {
        geocoder.geocode(req.body.address, (err, tmpRes) => {
            console.log("apres geocoder.geocode");
            if (err) {
                return cb(err);
            } else {
                req.body.position = [tmpRes.longitude, tmpRes.latitude];
                return cb(null, req);
            }
        });
    } else {
        return cb(null, req);
    }
}

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
    console.log('error find');
    console.log(err);
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
    return geolocation(req, (err, req) => {
        if (err) {
            return handleError(res)(err);
        }
        console.log(req.body.location);
        return Bakery.create(req.body)
            .then(respondWithResult(res, 201))
            .catch(handleError(res));
    });
}

// Create and add a new product to a bakery
export function addProduct(req, res) {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return handleEntityNotFound(res, 'Bakery')(undefined);
  }
  return Bakery.findById(req.params.id).exec()
      .then(bakery => {
          req.body.description = req.body.description ? req.body.description : '';
        let product = new Product({
          name: req.body.name,
          price: req.body.price
        });
          product.save()
            .then(
              bakery.products.push(product)
            )
            .catch(handleError(res));
        return bakery.save()
            .then(bakery => {
                return Bakery.populate(bakery, 'products')
                  .then(respondWithResult(res, 201))
                  .catch(handleError(res));
            })
            .catch(handleError(res));
      })
        .catch(handleError(res));
}

// Add an existing product to a bakery
export function  addExistingProduct(req, res) {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return handleEntityNotFound(res, 'Bakery')(undefined);
    }
    return Bakery.findById(req.params.id).exec()
        .then(bakery => {
          Product.findById(req.body.product_id).exec()
              .then(product => {
                bakery.products.push(product);
                return bakery.save()
                    .then(bakery => {
                      return Bakery.populate(bakery, 'products')
                          .then(respondWithResult(res, 201))
                          .catch(handleError(res));
                    })
                    .catch(handleError(res));
              })
              .catch(handleError(res));
        })
        .catch(handleError(res));
}

// get bakery products
export function getProductBakery(req, res) {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return handleEntityNotFound(res, 'Bakery')(undefined);
    }
    return Bakery.findById(req.params.id)
        .populate('products')
        .exec()
        .then(bakery => {
            return respondWithResult(res, 201)(bakery.products);
        })
        .catch(handleError(res))
}



// Remove a product to a bakery
export function  removeProduct(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return handleEntityNotFound(res, 'Bakery')(undefined);
  }
  return Bakery.findById(req.params.id).exec()
      .then(bakery => {
        let i = 0;
        while (i < bakery.products.length && bakery.products[i].id != req.body.product_id) {
          ++i;
        }
        if (i == bakery.products.length) {
          return handleEntityNotFound(res, 'activity')(undefined);
        }
        bakery.products.splice(i, 1);
        return bakery.save()
            .then(bakery => {
              return Bakery.populate(bakery, 'products')
                  .then(respondWithResult(res, 201))
                  .catch(handleError(res));
            })
            .catch(handleError(res));
      })
      .catch(handleError(res));
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

function findBakery(position, range) {
    return new Promise((resolve, reject) => {
        return Bakery.aggregate([{
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [position[0], position[1]],
                },
                "distanceField": "dist.calculated",
                "includeLocs": "dist.location",
                "spherical": true,
                "maxDistance": range
            }
        }], (err, bakeries) => {
            if (err) { console.log('err => ', err); return reject(err); } else {
                return resolve(bakeries);
            }
        });
    });
}

function prepareBakery(req, res) {
    return new Promise(((resolve, reject) => {
        return async.waterfall([
            cb => {
                geocoder.geocode(req.body.address, (err, position) => {
                    if (err) {
                        console.log('error geocoder ==> ', err);
                        cb({status: 422, message: "Unable to find your location"});
                    } else {
                        req.body.position = [position.longitude, position.latitude];
                        req.body.location_range = 2000;
                        return cb(null);
                    }
                })
            }
        ], (error, body) => {
            if (error) { console.log('1 => ', error); return reject(error); }
            return findBakery(req.body.position, req.body.location_range)
                .then(respondWithResult(res))
                .catch(handleError(res));
        })
    }))

}

export function searchBakery(req, res) {
    if (req.body.address == undefined) {
        return handleError(res, 422)({status: 422, message: 'you must specific an address.'});
    }
    return prepareBakery(req, res).then()
}
