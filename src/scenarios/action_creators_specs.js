/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import sinon from 'sinon';
import { fromJS, List, Map } from 'immutable';

import {
  CHANGE_SCENARIO,
  activeScenarioFromTask,
  executeStep,
  executeSteps,
} from './action_creators';
import { AUTOMATIC_SCENARIOS } from './reducer';

describe('Scenarios action creators', () => {
  describe('executeStep', () => {
    let doneSpy;
    let clock;

    beforeEach(() => {
      doneSpy = sinon.spy();
      clock = sinon.useFakeTimers();
    });

    it('should call done in a defined interval', () => {
      const step = Map({
        id: 1,
        name: 'Watch next up video',
        repeat: 0,
        duration: 1000,
        script: 'script',
      });
      executeStep(step, doneSpy);

      clock.tick(1200);
      expect(doneSpy.calledOnce).to.be.true;
    });

    //  make it work for nested intervals
    xit('should call done for nested intervals', () => {
      const step = fromJS(AUTOMATIC_SCENARIOS).get(0);
      executeStep(step, doneSpy);

      clock.tick(100000);
      expect(doneSpy.calledOnce).to.be.true;
    });
  });

  describe('executeSteps', () => {
    let doneSpy;
    let clock;

    beforeEach(() => {
      doneSpy = sinon.spy();
      clock = sinon.useFakeTimers();
    });

    it('should call done for nested intervals', () => {
      const steps = fromJS(AUTOMATIC_SCENARIOS).getIn([0, 'steps']);
      executeSteps(steps, doneSpy);

      clock.tick(100000);
      expect(doneSpy.calledOnce).to.be.true;
    });
  });

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
