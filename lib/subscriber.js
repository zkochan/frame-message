'use strict';

function parse(data) {
  var parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (err) {
    parsedData = {};
  }
  return parsedData;
}

/**
 * An object for subscribing to frame messages.
 *
 * @param {String} [opts.channel=default] - The name of the messaging channel to
 *   subscribe to.
 */
function Subscriber(opts) {
  opts = opts || {};

  this._channel = opts.channel || 'default';
  this._subscribers = [];

  /* for mocking */
  var addEventListener = opts.addEventListener || window.addEventListener;
  var attachEvent = opts.attachEvent || window.attachEvent;

  var _this = this;
  function onMessage(e) {
    var event = parse(e.data);
    if (event.channel === _this._channel) {
      for (var i = 0, len = _this._subscribers.length; i < len; i++) {
        _this._subscribers[i].apply({}, event.args);
      }
    }
  }

  if (addEventListener) {
    addEventListener('message', onMessage, false);
  } else {
    attachEvent('onmessage', onMessage, false);
  }
}

Subscriber.prototype.subscribe = function(cb) {
  this._subscribers.push(cb);
};

module.exports = Subscriber;
