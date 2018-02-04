import { List, fromJS } from 'immutable';

import { CHANGE_SCENARIO } from './action_creators';
import { CLICK_SKIP_AD_SCRIPT, NEXT_VIDEO_SCRIPT } from './scenario_scripts';

export function reduceStopSession(state, response) {
  return state.map((session) => {
    let newSession = session;

    if (session.get('id') === response.get('id')) {
      newSession = newSession.set('end', response.get('end'));
    }

    return newSession;
  });
}

export const SCENARIOS = [
  {
    id: 1,
    name: 'Let it watch',
    steps: [],
  },
  {
    id: 2,
    name: 'Next up',
    steps: [{
      id: 1,
      name: 'Watch next up video',
      repeat: -1,
      duration: 40000,
      steps: [
        {
          id: 2,
          name: 'Click next up video',
          repeat: 0,
          script: NEXT_VIDEO_SCRIPT,
        },
        {
          id: 2,
          name: 'Click skip add',
          repeat: 0,
          duration: 10000,
          script: CLICK_SKIP_AD_SCRIPT,
        },
      ],
    }],
  },
];

export function getInitialState() {
  let scenarios = fromJS(SCENARIOS);

  //   make the first scenario active by default
  scenarios = scenarios.map((scenario, i) => {
    return scenario.set('active', i === 0);
  });

  return scenarios;
}

export function changeScenario(state, scenarioId) {
  return state.map((scenario) => {
    return scenario.set('active', scenario.get('id') === scenarioId);
  });
}

export default function(state = getInitialState(), action) {
  switch (action.type) {
    case CHANGE_SCENARIO:
      return changeScenario(state, action.scenarioId);
    default:
      return state;
  }
}
