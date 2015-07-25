'use strict';

var sinon = require('sinon');
var FrameMessage = require('../');
var dummyTarget = {
  postMessage: function() {}
};

describe('FrameMessage', function() {
  describe('inner communication', function() {
    it('handlers are executed in the correct order', function() {
      var cb;
      var handler1 = sinon.spy();
      var handler2 = sinon.spy();
      var frameMessage = new FrameMessage({
        target: dummyTarget,
        channel: 'default',
        addEventListener: function(event, _cb, useCapture) {
          expect(event).to.eq('message');
          expect(useCapture).to.be.false;
          cb = _cb;
        }
      });
      frameMessage.recieve(handler1);
      frameMessage.recieve(handler2);
      cb({
        data: JSON.stringify({
          channel: 'default',
          args: []
        })
      });

      sinon.assert.callOrder(handler1, handler2);
    });
  });

  describe('outer communication', function() {
    it('should postMessage when message posted', function() {
      var postMessage = sinon.spy();
      var frameMessage = new FrameMessage({
        channel: 'fooChannel',
        target: {
          postMessage: postMessage
        },
        origin: 'http://google.com'
      });
      frameMessage.post(1, 2);

      expect(postMessage.calledWithExactly(JSON.stringify({
        channel: 'fooChannel',
        args: [1, 2]
      }), 'http://google.com')).to.be.true;
    });

    it('should execute reciver when message posted', function() {
      var cb;
      var frameMessage = new FrameMessage({
        channel: 'barChannel',
        target: dummyTarget,
        addEventListener: function(event, _cb, useCapture) {
          expect(event).to.eq('message');
          expect(useCapture).to.be.false;
          cb = _cb;
        }
      });

      var handler = sinon.spy();
      frameMessage.recieve(handler);

      cb({
        data: JSON.stringify({
          channel: 'barChannel',
          args: [43, 23, 1]
        })
      });

      expect(handler.calledWithExactly(43, 23, 1)).to.be.true;
    });
  });
});
