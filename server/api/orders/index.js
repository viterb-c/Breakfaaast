'use strict';

var express = require('express');
var controller = require('./orders.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.post('/user/:id', controller.createOrderForUser);
router.post('/:id/product', controller.addProduct);
//router.post('/:id/confirm', controller.confirmOrder);

module.exports = router;
