'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './orders.events';

var OrdersSchema = new mongoose.Schema({
  products: [{
    id_products: {type: String}
  }
  ],
  state: {
    type: String,
    required: true
  },
  bakeryname: {
    type: String,
    required: true
  },
  bakeryaddress: {
    type: String,
    required: true
  },
  customername: {
    type: String,
    required: true
  },
  customeraddress: {
    type: String,
    required: true
  }
});

registerEvents(OrdersSchema);
export default mongoose.model('Orders', OrdersSchema);
