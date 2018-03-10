'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './product.events';

var ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  picture: {
    type: String,
    default: null
  }
});

registerEvents(ProductSchema);
export default mongoose.model('Product', ProductSchema);
