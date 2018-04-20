'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './deliverymen.events';

var DeliverymenSchema = new mongoose.Schema({
  name: {
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
  },
  mail: {
    type: String,
    required: true
  }
});

registerEvents(DeliverymenSchema);
export default mongoose.model('Deliverymen', DeliverymenSchema);
