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

function FrameMessage(opts) {
  opts = opts || {};

  if (!opts.target) {
    throw new Error('opts.target is required');
  }

  this._target = opts.target;
  this._origin = opts.origin || '*';
  this._channel = opts.channel || 'default';
  this._recievers = [];

  /* for mocking */
  var addEventListener = opts.addEventListener || window.addEventListener;
  var attachEvent = opts.attachEvent || window.attachEvent;

  var _this = this;
  function onMessage(e) {
    var event = parse(e.data);
    if (event.channel === _this._channel) {
      for (var i = 0, len = _this._recievers.length; i < len; i++) {
        _this._recievers[i].apply({}, event.args);
      }
    }
  }

  if (addEventListener) {
    addEventListener('message', onMessage, false);
  } else {
    attachEvent('onmessage', onMessage, false);
  }
}

FrameMessage.prototype.recieve = function(cb) {
  this._recievers.push(cb);
};

FrameMessage.prototype.post = function() {
  var msg = {
    channel: this._channel,
    args: Array.prototype.slice.call(arguments)
  };
  this._target.postMessage(JSON.stringify(msg), this._origin);
};

module.exports = FrameMessage;
