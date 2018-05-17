'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './bakery.events';

//const authTypes = ['github', 'twitter', 'facebook', 'google'];


var BakerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  manager: {
    type: String,
    required: false
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders'}]
});

registerEvents(BakerySchema);
export default mongoose.model('Bakery', BakerySchema);
