'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var Subscriber = require('../lib/subscriber');

describe('Subscriber', function() {
  it('handlers are executed in the correct order', function() {
    var cb;
    var handler1 = sinon.spy();
    var handler2 = sinon.spy();
    var subscriber = new Subscriber({
      channel: 'default',
      addEventListener: function(event, _cb, useCapture) {
        expect(event).to.eq('message');
        expect(useCapture).to.be.false;
        cb = _cb;
      }
    });
    subscriber.subscribe(handler1);
    subscriber.subscribe(handler2);
    cb({
      data: JSON.stringify({
        channel: 'default',
        args: []
      })
    });

    sinon.assert.callOrder(handler1, handler2);
  });

  it('should execute reciver when message posted', function() {
    var cb;
    var subscriber = new Subscriber({
      channel: 'barChannel',
      addEventListener: function(event, _cb, useCapture) {
        expect(event).to.eq('message');
        expect(useCapture).to.be.false;
        cb = _cb;
      }
    });

    var handler = sinon.spy();
    subscriber.subscribe(handler);

    cb({
      data: JSON.stringify({
        channel: 'barChannel',
        args: [43, 23, 1]
      })
    });

    expect(handler.calledWithExactly(43, 23, 1)).to.be.true;
  });
});
