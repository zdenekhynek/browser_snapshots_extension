/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { fromJS } from 'immutable';

import {
  RECEIVE_TASKS,
  SET_TASK_MODE,
  SET_NEXT_TASK_ACTIVE,
  AUTOMATIC_MODE,
  MANUAL_MODE,
} from './action_creators';
import reducer, { getInitialState, setTaskMode,
  setNextTaskActive } from './reducer';

describe('Tasks reducer', () => {
  describe('setTaskMode', () => {
    it('shouls set task mode', () => {
      const state = getInitialState();
      let result = setTaskMode(state, AUTOMATIC_MODE);
      expect(result.getIn(['modes', 0, 'active'])).to.be.false;
      expect(result.getIn(['modes', 1, 'active'])).to.be.true;

      result = setTaskMode(result, MANUAL_MODE);
      expect(result.getIn(['modes', 0, 'active'])).to.be.true;
      expect(result.getIn(['modes', 1, 'active'])).to.be.false;
    });
  });

  describe('setNextTaskActive', () => {
    it('should set the first task active and set engagment', () => {
      let state = getInitialState();
      state = state.set('tasks', fromJS([{ id: 1 }, { id: 2 }]));

      let result = setNextTaskActive(state);
      let expected = fromJS({
        modes: state.get('modes'),
        isEngaged: true,
        tasks: [{ id: 1, active: true }, { id: 2, active: false }],
      });
      expect(result).to.eq(expected);

      result = setNextTaskActive(result);
      expected = fromJS({
        modes: state.get('modes'),
        isEngaged: true,
        tasks: [{ id: 1, active: false }, { id: 2, active: true }],
      });
      expect(result).to.eq(expected);
    });

    it('should set engagment to false if no tasks to activate', () => {
      let state = getInitialState();
      state = state.set('tasks', fromJS([{ id: 1, active: true },
        { id: 2, active: false }]));

      let result = setNextTaskActive(state);
      let expected = fromJS({
        modes: state.get('modes'),
        isEngaged: true,
        tasks: [{ id: 1, active: false }, { id: 2, active: true }],
      });
      expect(result).to.eq(expected);

      result = setNextTaskActive(result);
      expected = fromJS({
        modes: state.get('modes'),
        isEngaged: false,
        tasks: [{ id: 1, active: false }, { id: 2, active: false }],
      });
      expect(result).to.eq(expected);
    });
  });

  describe('reducer', () => {
    describe('RECEIVE_TASKS ', () => {
      it('adds tasks', () => {
        const state = getInitialState();
        const tasks = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const result = reducer(state, { type: RECEIVE_TASKS, response: tasks });
        expect(result.get('tasks').size).to.equal(3);
      });

      it('activates first task if not engaged', () => {
        const state = getInitialState();
        const tasks = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const result = reducer(state, { type: RECEIVE_TASKS, response: tasks });
        expect(result.getIn(['tasks', 0, 'active'])).to.be.true;
        expect(result.getIn(['tasks', 1, 'active'])).to.be.false;
        expect(result.get('isEngaged')).to.be.true;
      });

      it('it merges new tasks with the existing tasks', () => {
        const state = getInitialState();
        let tasks = [{ id: 1 }, { id: 2 }, { id: 3 }];

        let result = reducer(state, { type: RECEIVE_TASKS, response: tasks });
        expect(result.get('tasks').size).to.equal(3);

        tasks = [{ id: 4 }, { id: 3 }];
        result = reducer(result, { type: RECEIVE_TASKS, response: tasks });

        expect(result.get('tasks').size).to.equal(4);
      });
    });

    describe('SET_TASK_MODE', () => {
      it('should clear tasks if switched to manual', () => {
        const state = getInitialState();
        const tasks = [{ id: 1 }, { id: 2 }, { id: 3 }];
        let result = reducer(state, { type: RECEIVE_TASKS, response: tasks });
        expect(result.get('tasks').size).to.eq(3);

        result = reducer(result,
          { type: SET_TASK_MODE, mode: MANUAL_MODE }
        );
        expect(result.get('tasks').size).to.eq(0);
      });
    });

    describe('SET_NEXT_TASK_ACTIVE', () => {
      it('should activate the next task and set isEngaged', () => {
        const state = getInitialState();
        const tasks = [{ id: 1 }, { id: 2 }];
        let result = reducer(state, { type: RECEIVE_TASKS, response: tasks });
        result = reducer(result,
          { type: SET_NEXT_TASK_ACTIVE }
        );

        let expected = fromJS({
          modes: state.get('modes'),
          isEngaged: true,
          tasks: [{ id: 1, active: false }, { id: 2, active: true }],
        });
        expect(result).to.eq(expected);

        result = reducer(result,
          { type: SET_NEXT_TASK_ACTIVE }
        );

        expected = fromJS({
          modes: state.get('modes'),
          isEngaged: false,
          tasks: [{ id: 1, active: false }, { id: 2, active: false }],
        });
        expect(result).to.eq(expected);
      });
    });
  });
});
