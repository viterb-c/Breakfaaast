'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './baskets.events';

var BasketsSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

registerEvents(BasketsSchema);
export default mongoose.model('Baskets', BasketsSchema);
