/**
 * Bakery model events
 */

'use strict';

import {EventEmitter} from 'events';
var BakeryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BakeryEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Bakery) {
  for(var e in events) {
    let event = events[e];
    Bakery.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    BakeryEvents.emit(event + ':' + doc._id, doc);
    BakeryEvents.emit(event, doc);
  };
}

export {registerEvents};
export default BakeryEvents;
