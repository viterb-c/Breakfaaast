'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './orders.events';

var OrdersSchema = new mongoose.Schema({
  state: {
    type: String,
    default: 'Panier'
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bakery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bakery'
  },
  deliverymen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deliverymen'
  }
});

registerEvents(OrdersSchema);
export default mongoose.model('Orders', OrdersSchema);
