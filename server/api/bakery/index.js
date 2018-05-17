'use strict';

var express = require('express');
var controller = require('./bakery.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/product', controller.getProductBakery);
router.post('/', controller.create);
router.post('/:id/product', controller.addProduct);
router.post('/search', controller.searchBakery);
router.put('/:id', controller.upsert);
router.put('/:id/product', controller.addExistingProduct);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.delete('/:id/product', controller.removeProduct);

module.exports = router;
