/**
 * Baskets model events
 */

'use strict';

import {EventEmitter} from 'events';
var BasketsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BasketsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Baskets) {
  for(var e in events) {
    let event = events[e];
    Baskets.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    BasketsEvents.emit(event + ':' + doc._id, doc);
    BasketsEvents.emit(event, doc);
  };
}

export {registerEvents};
export default BasketsEvents;
