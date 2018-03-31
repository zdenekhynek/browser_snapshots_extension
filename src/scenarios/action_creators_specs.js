/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import sinon from 'sinon';
import { fromJS, List } from 'immutable';

import {
  CHANGE_SCENARIO,
  activeScenarioFromTask,
} from './action_creators';

describe('Scenarios action creators', () => {
  describe('activeScenarioFromTask', () => {
    it('should activate scenario based on task', (done) => {
      const dispatchSpy = sinon.spy();
      const task = fromJS({
        id: 4,
        status: 1,
        agent: 1,
        scenario: {
          id: 3,
          type: 1,
          config: [
            {
              settings: {
                keyword: 'trump',
              },
            },
          ],
        },
      });
      const promise = activeScenarioFromTask(task)(dispatchSpy);

      Promise.resolve(promise).then(() => {
        const scenarioArgs = dispatchSpy.args[0][0];
        expect(scenarioArgs.type).to.equal(CHANGE_SCENARIO);
        expect(scenarioArgs.scenarioId).to.equal(1);
        expect(scenarioArgs.params.step).to.equal(2);
        expect(scenarioArgs.params.param).to.equal('args');
        expect(scenarioArgs.params.value).to.eql(List(['trump']));
        done();
      })
        .catch((err) => {
          done(err);
        });
    });
  });
});
