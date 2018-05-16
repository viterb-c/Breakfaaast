/**
 * Customers model events
 */

'use strict';

import {EventEmitter} from 'events';
var CustomersEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CustomersEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Customers) {
  for(var e in events) {
    let event = events[e];
    Customers.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    CustomersEvents.emit(event + ':' + doc._id, doc);
    CustomersEvents.emit(event, doc);
  };
}

export {registerEvents};
export default CustomersEvents;
