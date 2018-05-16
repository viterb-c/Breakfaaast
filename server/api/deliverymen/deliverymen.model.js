'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './deliverymen.events';

var DeliverymenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  orders_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders'}],
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
  }
});

registerEvents(DeliverymenSchema);
export default mongoose.model('Deliverymen', DeliverymenSchema);
