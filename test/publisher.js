'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var Publisher = require('../lib/publisher');

describe('Publisher', function() {
  it('should postMessage when message published', function() {
    var postMessage1 = sinon.spy();
    var postMessage2 = sinon.spy();
    var publisher = new Publisher({
      channel: 'fooChannel',
      targets: [{
        window: {
          postMessage: postMessage1
        },
        origin: 'http://google.com'
      }, {
        window: {
          postMessage: postMessage2
        },
        origin: 'http://facebook.com'
      }]
    });
    publisher.publish(1, 2);

    expect(postMessage1.calledWithExactly(JSON.stringify({
      channel: 'fooChannel',
      args: [1, 2]
    }), 'http://google.com')).to.be.true;
    expect(postMessage2.calledWithExactly(JSON.stringify({
      channel: 'fooChannel',
      args: [1, 2]
    }), 'http://facebook.com')).to.be.true;
  });
});
