import { List, fromJS } from 'immutable';

import {
  RECEIVE_START_SESSION,
  RECEIVE_STOP_SESSION,
  CLEAR_SESSIONS,
} from './action_creators';
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
      duration: 5000,
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
    return scenario.set('active', i === 1);
  });

  return scenarios;
}

export default function(state = getInitialState(), action) {
  return state;

  // switch (action.type) {
  //   case RECEIVE_START_SESSION:
  //     return state.push(fromJS(action.response));
  //   case RECEIVE_STOP_SESSION:
  //     return reduceStopSession(state, fromJS(action.response));
  //   case CLEAR_SESSIONS:
  //     return List();
  //   default:
  //     return state;
  // }
}
