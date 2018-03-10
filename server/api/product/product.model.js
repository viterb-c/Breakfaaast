'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './product.events';

var ProductSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(ProductSchema);
export default mongoose.model('Product', ProductSchema);
