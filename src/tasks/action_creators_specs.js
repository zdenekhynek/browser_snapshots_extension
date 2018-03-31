/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import sinon from 'sinon';
import { fromJS, Map, List } from 'immutable';

import {
  REQUEST_TASKS,
  RECEIVE_TASKS,
  fetchTasks,
} from './action_creators';
import * as dao from './dao';

describe('Tasks action creators', () => {
  describe('fetchTasks', () => {
    let apiStub;
    const resp = fromJS([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);

    before(() => {
      apiStub = sinon.stub(dao, 'fetch');
      apiStub.returns(Promise.resolve(resp));
    });

    after(() => {
      apiStub.restore();
    });

    it('should fetch tasks and dispatch correct actions', (done) => {
      const dispatchSpy = sinon.spy();
      const getState = () => {
        return { auth: Map(), agents: List() };
      };
      const promise = fetchTasks()(dispatchSpy, getState);

      Promise.resolve(promise).then(() => {
        expect(dispatchSpy.args[0]).to.deep.equal([
          {
            type: REQUEST_TASKS,
          },
        ]);
        expect(dispatchSpy.args[1]).to.deep.equal([
          {
            type: RECEIVE_TASKS,
            response: resp,
          },
        ]);
        done();
      })
        .catch((err) => {
          done(err);
        });
    });
  });
});
