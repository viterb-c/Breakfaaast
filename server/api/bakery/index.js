'use strict';

var express = require('express');
var controller = require('./bakery.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/products', controller.getProductBakery);
router.post('/', controller.create);
router.post('/products/:id', controller.addProduct);
router.put('/:id', controller.upsert);
router.put('/products/:id', controller.addExistingProduct);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.delete('products/:id', controller.removeProduct);

module.exports = router;
