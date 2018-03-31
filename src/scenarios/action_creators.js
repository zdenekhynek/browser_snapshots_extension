import { List } from 'immutable';

import { getScriptById } from './scenario_scripts';
import { executeScript } from '../utils/extension_utils';

export const STOP_SCENARIO = 'STOP_SCENARIO';
export const START_SCENARIO = 'START_SCENARIO';
export const CHANGE_SCENARIO = 'CHANGE_SCENARIO';
export const CHANGE_SCENARIO_PARAM = 'CHANGE_SCENARIO_PARAM';

export let timeouts = [];

export function randomizeDuration(duration, randomness = 10) {
  const randomRange = duration / randomness;
  const random = Math.random() * randomRange;
  return duration + random;
}

export function executeStep(step, doneClb) {
  let duration = step.get('duration', 0);
  const randomness = step.get('randomness', 10);
  duration = randomizeDuration(duration, randomness);

  const repeat = step.get('repeat', 0);
  const scriptId = step.get('script');
  const scriptArgs = step.get('args', List()).toJS();

  console.log('scriptId', scriptId, 'scriptArgs', scriptArgs, duration);

  const script = getScriptById(scriptId, scriptArgs);
  console.log('script', script);

  //  if video has recursion
  if (step.has('steps')) {
    executeSteps(step.get('steps')); // eslint-disable-line no-use-before-define, max-len
  }

  let repeatIndex = 0;

  const timeout = setTimeout(() => {
    if (typeof script === 'string') {
      //  script is a string which should be run on a page
      executeScript(script);
    } else if (script.hasOwnProperty('fn')) {
      //  script is a function which calls extension API
      script.fn.apply(this, script.args);
    }

    repeatIndex++;

    if (repeat === -1 || repeatIndex <= repeat) {
      executeStep(step, doneClb);
    } else {
      doneClb();
    }
  }, duration);

  timeouts.push(timeout);
}

export function executeSteps(steps) {
  let stepIndex = 0;
  const nextStep = () => {
    if (stepIndex < steps.size) {
      const step = steps.get(stepIndex);
      stepIndex++;
      executeStep(step, nextStep);
    } else {
      console.log('steps finished');
    }
  };

  nextStep();
}

export function clearTimeouts() {
  timeouts.map((timeout) => {
    clearTimeout(timeout);
  });

  timeouts = [];
}

export function startScenario() {
  return (dispatch, getState) => {
    const { scenarios } = getState();

    const scenario = scenarios.find((s) => {
      return s.get('active', false);
    });

    const steps = scenario.get('steps');
    executeSteps(steps);

    dispatch({ type: START_SCENARIO });
  };
}

export function stopScenario() {
  clearTimeouts();

  return { type: STOP_SCENARIO };
}

export function changeScenario(scenarioId) {
  return {
    type: CHANGE_SCENARIO,
    scenarioId,
  };
}

export function changeScenarioParam(scenarioId, param, value) {
  return {
    type: CHANGE_SCENARIO_PARAM,
    param,
    value,
  };
}

export function activeScenarioFromTask(task) {
  console.log('activeScenarioFromTask', task);
  return (dispatch) => {
    //  change scenario
    const scenarioId = task.getIn(['scenario', 'id']);
    dispatch(changeScenario(scenarioId));

    //  start scenario
    dispatch(startScenario);
  };
}

