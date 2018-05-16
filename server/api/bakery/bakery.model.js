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
    /*,
  email: {
    type: String,
    lowercase: true,
    required() {
      if(authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  }
  password: {
    type: String,
    required() {
      if(authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  },*/
});

registerEvents(BakerySchema);
export default mongoose.model('Bakery', BakerySchema);
