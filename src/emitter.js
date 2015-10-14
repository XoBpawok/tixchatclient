'use strict';
const util = require('util');
const EventEmitter = require('events');

function Emmiter() {
  // Initialize necessary properties from `EventEmitter` in this instance
  EventEmitter.call(this);
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(Emmiter, EventEmitter);

var emitter = new Emmiter();

module.exports = emitter;