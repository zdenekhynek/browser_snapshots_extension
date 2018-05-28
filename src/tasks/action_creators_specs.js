/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import sinon from 'sinon';
import { fromJS, Map, List } from 'immutable';

//  import { store } from '../background';
import { createTestStore } from '../utils/test_setup';
import {
  REQUEST_TASKS,
  RECEIVE_TASKS,
  SET_TASK_MODE,
  MANUAL_MODE,
  AUTOMATIC_MODE,
  AUTOMATIC_MODE_RACE,
  activateScenarioForTask,
  fetchTasks,
  setTaskMode,
} from './action_creators';
import {
  activateAgent,
  receiveListAgents,
} from '../agents/action_creators';
import {
  getInitialState,
  setTaskMode as reducerSetTaskMode,
} from './reducer';
import * as dao from './dao';
import * as taskService from './task_service';
import * as socketService from './socket_service';

describe('Tasks action creators', () => {
  let startServiceStub;
  let startSocketServiceStub;

  beforeEach(() => {
    startServiceStub = sinon.stub(taskService, 'startService');
    startSocketServiceStub = sinon.stub(socketService, 'startSocketService');
  });

  afterEach(() => {
    startServiceStub.restore();
    startSocketServiceStub.restore();
  });

  describe('setTaskMode', () => {
    const dispatchSpy = sinon.spy();

    afterEach(() => {
      dispatchSpy.reset();
    });

    it('dispatch correct action', (done) => {
      const promise = setTaskMode('automatic')(dispatchSpy);
      Promise.resolve(promise)
        .then(() => {
          expect(dispatchSpy.args[0]).to.deep.equal([
            {
              type: SET_TASK_MODE,
              mode: 'automatic',
            },
          ]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should call startService when in AUTOMATIC_MODE', (done) => {
      let promise = setTaskMode(AUTOMATIC_MODE)(dispatchSpy);
      Promise.resolve(promise)
        .then(() => {
          expect(startServiceStub.calledOnce).to.be.true;

          promise = setTaskMode(AUTOMATIC_MODE_RACE)(dispatchSpy);
          Promise.resolve(promise)
            .then(() => {
              //  check startService hasn't been called
              expect(startServiceStub.calledOnce).to.be.true;
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should call startSocketService when in AUTOMATIC_MODE_RACE', (done) => {
      let promise = setTaskMode(AUTOMATIC_MODE)(dispatchSpy);
      Promise.resolve(promise)
        .then(() => {
          expect(startSocketServiceStub.calledOnce).to.be.false;

          promise = setTaskMode(AUTOMATIC_MODE_RACE)(dispatchSpy);
          Promise.resolve(promise)
            .then(() => {
              //  check startService hasn't been called
              expect(startSocketServiceStub.calledOnce).to.be.true;
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('activateScenarioForTask', () => {
    const dispatchSpy = sinon.spy();

    it('should not call startService if not in AUTOMATIC_MODE', () => {
      let tasks = getInitialState();
      activateScenarioForTask(tasks, dispatchSpy);
      expect(startServiceStub.calledOnce).to.be.false;

      tasks = reducerSetTaskMode(tasks, AUTOMATIC_MODE);
      activateScenarioForTask(tasks, dispatchSpy);
      expect(startServiceStub.calledOnce).to.be.true;

      tasks = reducerSetTaskMode(tasks, AUTOMATIC_MODE_RACE);
      activateScenarioForTask(tasks, dispatchSpy);
      expect(startServiceStub.calledOnce).to.be.true;

      tasks = reducerSetTaskMode(tasks, MANUAL_MODE);
      activateScenarioForTask(tasks, dispatchSpy);
      expect(startServiceStub.calledOnce).to.be.true;

      tasks = reducerSetTaskMode(tasks, AUTOMATIC_MODE);
      activateScenarioForTask(tasks, dispatchSpy);
      expect(startServiceStub.calledTwice).to.be.true;
    });
  });

  describe('fetchTasks', () => {
    let apiStub;
    let store;

    const resp = [
      { id: '1', status: 1 },
      { id: '2', status: 1 },
      { id: '3', status: 1 },
    ];

    before(() => {
      apiStub = sinon.stub(dao, 'fetch');
      apiStub.returns(Promise.resolve(resp));
      store = createTestStore();
    });

    after(() => {
      apiStub.restore();
    });

    it('should fetch tasks and dispatch correct actions', (done) => {
      const dispatchSpy = sinon.spy();
      const getState = () => {
        return {
          auth: Map({ token: 'a' }),
          agents: fromJS([
            { id: 0, active: false },
            { id: 1, active: true },
          ]),
          tasks: getInitialState(),
        };
      };
      const promise = fetchTasks()(dispatchSpy, getState);

      Promise.resolve(promise).then(() => {
        expect(apiStub.firstCall.args).to.deep.equal([1, 'a', 2]);

        expect(dispatchSpy.args[0]).to.deep.equal([{ type: REQUEST_TASKS }]);

        // expect(dispatchSpy.args[1]).to.deep.equal([{ type: RECEIVE_TASKS,
        //   response: resp }]);

        done();
      })
        .catch((err) => {
          done(err);
        });
    });

    it('should call set next task and activate scenario for task', (done) => {
      const agents = [
        { id: 0 },
        { id: 1 },
      ];

      store.dispatch(receiveListAgents(agents));
      store.dispatch(activateAgent(1));

      // trigger fetch tasks
      store.dispatch(setTaskMode(AUTOMATIC_MODE, false));

      const promise = fetchTasks()(store.dispatch, store.getState);

      Promise.resolve(promise)
        .then(() => {
          let tasks = store.getState().tasks;
          expect(tasks.get('tasks').size).to.equal(3);
          expect(tasks.getIn(['tasks', 0, 'active'])).to.be.true;
          expect(tasks.getIn(['tasks', 1, 'active'])).to.be.false;

          //  should set extension to engaged
          expect(tasks.get('isEngaged')).to.be.true;

          //  change task dao
          setTimeout(() => {
            tasks = store.getState().tasks;

            //  should set task to queued
            expect(tasks.getIn(['tasks', 0, 'status'])).to.equal(2);
            done();
          }, 250);
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
