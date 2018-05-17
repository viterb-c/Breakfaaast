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
    type: mongoose.Schema.Types.ObjectId
  },
  bakery: {
    type: mongoose.Schema.Types.ObjectId
  },
  deliverymen: {
    type: mongoose.Schema.Types.ObjectId
  }
});

registerEvents(OrdersSchema);
export default mongoose.model('Orders', OrdersSchema);
