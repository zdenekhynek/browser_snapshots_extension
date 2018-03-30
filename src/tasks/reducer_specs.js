import { expect } from 'chai';
import { fromJS } from 'immutable';

import { getInitialState, setNextTaskActive } from './reducer';

describe('Tasks reducer', () => {
  describe('setNextTaskActive', () => {
    it('should set the first task active and set engagment', () => {
      let state = getInitialState();
      state = state.set('tasks', fromJS([{}, {}]));

      let result = setNextTaskActive(state);
      let expected = fromJS({
        modes: state.get('modes'),
        isEngaged: true,
        tasks: [{ active: true }, { active: false }],
      });
      expect(result).to.eq(expected);

      result = setNextTaskActive(result);
      expected = fromJS({
        modes: state.get('modes'),
        isEngaged: true,
        tasks: [{ active: false }, { active: true }],
      });
      expect(result).to.eq(expected);
    });
  });
});
