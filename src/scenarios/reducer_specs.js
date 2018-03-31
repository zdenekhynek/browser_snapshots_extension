/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';

import {
  SET_TASK_MODE,
  AUTOMATIC_MODE,
  MANUAL_MODE,
} from '../tasks/action_creators';
import reducer from './reducer';

describe('Scenarios reducer', () => {
  describe('reducer', () => {
    describe('SET_TASK_MODE ', () => {
      it('sets correct state based on tasks', () => {
        let result = reducer(undefined, { type: '' });
        expect(result.size).to.equal(4);

        result = reducer(
          undefined,
          { type: SET_TASK_MODE, taskMode: AUTOMATIC_MODE }
        );
        expect(result.size).to.equal(1);

        result = reducer(
          undefined,
          { type: SET_TASK_MODE, taskMode: MANUAL_MODE }
        );
        expect(result.size).to.equal(4);
      });
    });
  });
});
