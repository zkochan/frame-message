'use strict';

function Publisher(opts) {
  opts = opts || {};

  if (!opts.targets) {
    throw new Error('opts.targets is required');
  }

  this._channel = opts.channel || 'default';
  this._targets = [];
  for (var i = 0, len = opts.targets.length; i < len; i++) {
    var target = {
      window: opts.targets[i].window,
      origin: opts.targets[i].origin || '*'
    };
    this._targets.push(target);
  }
}

Publisher.prototype.publish = function() {
  var msg = {
    channel: this._channel,
    args: Array.prototype.slice.call(arguments)
  };
  for (var i = 0, len = this._targets.length; i < len; i++) {
    var target = this._targets[i];
    target.window.postMessage(JSON.stringify(msg), target.origin);
  }
};

module.exports = Publisher;
