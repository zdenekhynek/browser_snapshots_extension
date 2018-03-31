/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';

import {
  SET_TASK_MODE,
  AUTOMATIC_MODE,
  MANUAL_MODE,
} from '../tasks/action_creators';
import { CHANGE_SCENARIO } from './action_creators';
import reducer, {
  changeScenarioParam,
  getAutomaticScenarios,
} from './reducer';

describe('Scenarios reducer', () => {
  describe('changeScenarioParam', () => {
    it('changeScenarioParam', () => {
      const state = getAutomaticScenarios();
      const params = { step: 2, param: 'args', value: ['test'] };
      const scenarioId = 1;
      const result = changeScenarioParam(state, scenarioId, params);
      expect(result.getIn([0, 'steps', 1, 'args'])).to.eql(['test']);
    });
  });

  describe('reducer', () => {
    describe('CHANGE_SCENARIO', () => {
      it('activates correct scenario', () => {
        let result = reducer(
          undefined,
          { type: '' }
        );
        expect(result.getIn([0, 'active'])).to.be.true;

        result = reducer(
          result,
          { type: CHANGE_SCENARIO, scenarioId: 2 }
        );
        expect(result.getIn([0, 'active'])).to.be.false;
        expect(result.getIn([1, 'active'])).to.be.true;
      });

      it('also changes params', () => {
        const state = getAutomaticScenarios();
        const params = { step: 2, param: 'args', value: ['test'] };
        const result = reducer(
          state,
          { type: CHANGE_SCENARIO, scenarioId: 1, params }
        );
        expect(result.getIn([0, 'active'])).to.be.true;
        expect(result.getIn([0, 'steps', 1, 'args'])).to.eql(['test']);
      });
    });

    describe('SET_TASK_MODE', () => {
      it('sets correct state based on tasks', () => {
        let result = reducer(undefined, { type: '' });
        expect(result.size).to.equal(4);

        result = reducer(
          undefined,
          { type: SET_TASK_MODE, mode: AUTOMATIC_MODE }
        );
        expect(result.size).to.equal(1);

        result = reducer(
          undefined,
          { type: SET_TASK_MODE, mode: MANUAL_MODE }
        );
        expect(result.size).to.equal(4);
      });
    });
  });
});
