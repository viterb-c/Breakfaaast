'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './customers.events';

var CustomersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    validate: {
      validator: function(v) {
        return /d{10}/.test(v);
      },
      message: '{VALUE} is not a valid 10 digit number!'
    }
  }
});

registerEvents(CustomersSchema);
export default mongoose.model('Customers', CustomersSchema);
