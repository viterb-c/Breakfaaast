/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  upsert
 * PATCH   /api/products/:id          ->  patch
 * DELETE  /api/products/:id          ->  destroy
 * POST    /api/products/upload       ->  uploadImage
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Product from './product.model';
import multer from 'multer';

let storage = multer.diskStorage({
  destination: function(rq, file, callback) {
    callback(null, 'public/');
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
  }
});

let upload = multer({ storage: storage, fileFilter: fileFilterCreate }).single('image');

function fileFilterCreate (req, file, cb) {
    console.log("ICI");
    if (file == undefined) { return cb(null, true); }
    return cb(null, true);
}

export function uploadImage(req, res) {
    console.log("ICI");
    return upload(req, res, (err) => {
        if (err) {
            return handleError(res)(err);
        }
        req.body.picture = req.get('host') + '/' + req.file.filename;
        return Product.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
            .then(respondWithResult(res))
            .catch(handleError(res));
    });
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
    res.status(statusCode).send(err);
  };
}

// Gets a list of Products
export function index(req, res) {
  return Product.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Product from the DB
export function show(req, res) {
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Product in the DB
export function create(req, res) {
  console.log('TOTOTOT');
  if(req.body.name == null) {
    console.log('c null');
  }
  else {
    console.log(req.body.name);
  }
  //console.log(req);
  return Product.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Product in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Product.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Product in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Product from the DB
export function destroy(req, res) {
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
