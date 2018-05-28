/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import sinon from 'sinon';
import { startSocketService, onMessageCallback } from './socket_service';

describe('Socket service', () => {
  describe('onMessageCallback', () => {
    const socketData = {
      keyword: 'fox news',
      id: 135,
      tasks: [
        {
          id: 269, status: 1, type: 1, agent: 1, session: null,
          scenario:
            { id: 268, type: 1, config: [
              { settings: { keyword: 'fox news' } },
            ] },
        },
      ],
      message: 'race_started',
      type: 'chat_message',
    };

    it('dispatch correct action after receiving race_started', () => {
      const dispatchStub = sinon.stub();

      startSocketService(dispatchStub);
      onMessageCallback(socketData);

      expect(dispatchStub.calledOnce).to.be.true;
    });
  });
});
