import { List, Map } from 'immutable';

import { getScriptById } from './scenario_scripts';
import { executeScript } from '../utils/extension_utils';
import { changeTaskStatus, setNextTaskActive,
  activateScenarioForTask, setTaskSession } from '../tasks/action_creators';
import { startSession, stopSession } from '../sessions/action_creators';

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

export function executeStep(step, doneClb, repeatIndex = 0) {
  let duration = step.get('duration', -1);
  const randomness = step.get('randomness', 10);
  duration = randomizeDuration(duration, randomness);

  const repeat = step.get('repeat', 0);
  const scriptId = step.get('script');
  const scriptArgs = step.get('args', List()).toJS();

  const script = getScriptById(scriptId, scriptArgs);

  //  if step has recursion
  // if (step.has('steps')) {
  //   executeSteps(step.get('steps'), doneClb); // eslint-disable-line no-use-before-define, max-len
  // }

  //  is step just a wrapper
  if (step.has('duration') || step.has('script')) {
    const timeout = setTimeout(() => {
      if (typeof script === 'string') {
        //  script is a string which should be run on a page
        executeScript(script);
      } else if (script.hasOwnProperty('fn')) {
        //  script is a function which calls extension API
        script.fn.apply(this, script.args);
      }

      const newRepeatIndex = repeatIndex + 1;

      if (repeat === -1 || newRepeatIndex <= repeat) {
        executeStep(step, doneClb, newRepeatIndex);
      } else {
        doneClb();
      }
    }, duration);

    timeouts.push(timeout);
  }
}

export function executeSteps(steps, doneClb) {
  let stepIndex = 0;
  const nextStep = () => {
    if (stepIndex < steps.size) {
      const step = steps.get(stepIndex);
      stepIndex++;
      executeStep(step, nextStep);
    } else {
      doneClb();
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

export function startScenario(sessionId) {
  return (dispatch, getState) => {
    const { scenarios } = getState();

    const scenario = scenarios.find((s) => {
      return s.get('active', false);
    });

    const steps = scenario.get('steps');

    const finishSteps = () => {
      console.log('finishSteps');
      dispatch(stopSession(sessionId));

      //  complete existing task
      dispatch(changeTaskStatus(4));

      //  activate next step
      dispatch(setNextTaskActive());

      //  check whether we can activate next scenario
      const { tasks } = getState();
      activateScenarioForTask(tasks, dispatch);
    };

    executeSteps(steps, finishSteps);

    if (getState().tasks.get('isEngaged')) {
      dispatch(setTaskSession(sessionId));
    }

    dispatch({ type: START_SCENARIO });
  };
}

export function stopScenario() {
  clearTimeouts();

  return { type: STOP_SCENARIO };
}

export function changeScenario(scenarioId, params = null) {
  return {
    type: CHANGE_SCENARIO,
    scenarioId,
    params,
  };
}

export function changeScenarioParam(scenarioId, param, value) {
  return {
    type: CHANGE_SCENARIO_PARAM,
    param,
    value,
  };
}

export function activateScenarioFromTask(task = Map()) {
  return (dispatch) => {
    //  pick scenario id: 1 for race, and scenario id: 2 for training
    const scenarioId = (task.get('type') === 1) ? 2 : 1;

    const step = 2;
    const param = 'args';
    const value = List([task.getIn(
      ['scenario', 'config', 0, 'settings', 'keyword'],
    )]);

    //  change scenario with params
    const params = { step, param, value };

    dispatch(changeScenario(scenarioId, params));

    //  start scenario
    dispatch(startSession());
  };
}
