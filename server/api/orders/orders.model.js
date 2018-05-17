'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './orders.events';

var OrdersSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

registerEvents(OrdersSchema);
export default mongoose.model('Orders', OrdersSchema);
