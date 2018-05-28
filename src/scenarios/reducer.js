import { fromJS } from 'immutable';

import { CHANGE_SCENARIO, CHANGE_SCENARIO_PARAM } from './action_creators';
import {
  CLICK_SKIP_AD_SCRIPT,
  NEXT_VIDEO_SCRIPT,
  STOP_VIDEO_SCRIPT,
  CLEAR_CACHE_SCRIPT,
  GO_ON_YOUTUBE_SCRIPT,
  SEARCH_YOUTUBE,
  CLICK_SEARCH_RESULT,
} from './scenario_scripts';
import { SET_TASK_MODE, AUTOMATIC_MODE, AUTOMATIC_MODE_RACE }
  from '../tasks/action_creators';

export function reduceStopSession(state, response) {
  return state.map((session) => {
    let newSession = session;

    if (session.get('id') === response.get('id')) {
      newSession = newSession.set('end', response.get('end'));
    }

    return newSession;
  });
}

export const MANUAL_SCENARIOS = [
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
  {
    id: 3,
    name: 'Let it watch, next up',
    steps: [{
      id: 1,
      name: 'Watch next up video',
      repeat: -1,
      duration: 5 * 60 * 1000,
      randomness: 2, // high variability, compared to default 10
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
  {
    id: 4,
    name: 'Search on YouTube',
    controls: ['searchInput'],
    steps: [{
      id: 1,
      name: 'Clear cache',
      duration: 0,
      script: CLEAR_CACHE_SCRIPT,
    }, {
      id: 2,
      name: 'Go on YouTube',
      duration: 1000,
      script: GO_ON_YOUTUBE_SCRIPT,
    }, {
      id: 3,
      name: 'Search YouTube',
      duration: 3000,
      script: SEARCH_YOUTUBE,
      args: ['plane'],
    }, {
      id: 4,
      name: 'Click first result',
      duration: 5000,
      script: CLICK_SEARCH_RESULT,
      args: [0],
    }, {
      id: 5,
      name: 'Watch next up video',
      repeat: 10,
      duration: 40000,
      steps: [
        {
          id: 1,
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

export const AUTOMATIC_SCENARIOS = [
  {
    id: 1,
    name: 'Automatic Search on YouTube',
    controls: ['searchInput'],
    steps: [/* {
      id: 1,
      name: 'Go on YouTube',
      duration: 2000,
      script: GO_ON_YOUTUBE_SCRIPT,
    },*/ {
        id: 2,
        name: 'Search YouTube',
        duration: 3000,
        script: SEARCH_YOUTUBE,
        args: [],
      }, {
        id: 3,
        name: 'Click first result',
        duration: 3000,
        script: CLICK_SEARCH_RESULT,
        args: [0],
      }, {
        id: 4,
        name: 'Watch next up video',
        //  repeat: 20,
        repeat: 2,
        duration: 30000,
        script: NEXT_VIDEO_SCRIPT,
      },
      {
        id: 5,
        name: 'Stop video',
        duration: 2000,
        script: STOP_VIDEO_SCRIPT,
      }, {
        id: 6,
        name: 'Go on YouTube',
        duration: 2000,
        script: GO_ON_YOUTUBE_SCRIPT,
      }],
  },
  {
    id: 2,
    name: 'Automatic Race Search on YouTube',
    controls: ['searchInput'],
    steps: [{
      id: 1,
      name: 'Go on YouTube',
      duration: 2000,
      script: GO_ON_YOUTUBE_SCRIPT,
    }, {
      id: 2,
      name: 'Search YouTube',
      duration: 3000,
      script: SEARCH_YOUTUBE,
      args: [],
    }, {
      id: 3,
      name: 'Click first result',
      duration: 3000,
      script: CLICK_SEARCH_RESULT,
      args: [0],
    }, {
      id: 4,
      name: 'Watch next up video',
      repeat: 20,
      duration: 5000,
      script: NEXT_VIDEO_SCRIPT,
    },
    {
      id: 5,
      name: 'Stop video',
      duration: 2000,
      script: STOP_VIDEO_SCRIPT,
    }, {
      id: 6,
      name: 'Go on YouTube',
      duration: 2000,
      script: GO_ON_YOUTUBE_SCRIPT,
    }],
  },
];

export function getInitialState() {
  let scenarios = fromJS(MANUAL_SCENARIOS);

  //   make the first scenario active by default
  scenarios = scenarios.map((scenario, i) => {
    return scenario.set('active', i === 0);
  });

  return scenarios;
}

export function getAutomaticScenarios() {
  const scenarios = fromJS(AUTOMATIC_SCENARIOS);
  return scenarios.map((s) => s.set('active', false));
}

export function changeScenario(state, scenarioId) {
  return state.map((scenario) => {
    return scenario.set('active', scenario.get('id') === scenarioId);
  });
}

export function changeScenarioParam(state, scenarioId, params = {}) {
  const { step, param, value } = params;

  //  find scenario
  const scenarioIndex = state.findIndex((s) => {
    return s.get('id') === scenarioId;
  });

  //  find step
  const stepIndex = state.getIn([scenarioIndex, 'steps']).findIndex((s) => {
    return s.get('id') === step;
  });

  //  update step
  return state
    .updateIn([scenarioIndex, 'steps', stepIndex], (s) => {
      return s.set(param, value);
    });
}

export function setTaskMode(state, taskMode) {
  if (taskMode === AUTOMATIC_MODE || taskMode === AUTOMATIC_MODE_RACE) {
    return getAutomaticScenarios();
  }

  //  manual mode
  return getInitialState();
}


export default function(state = getInitialState(), action) {
  switch (action.type) {
    case CHANGE_SCENARIO:
      let newState = changeScenario(state, action.scenarioId);

      //  are we changing value of a param as well
      if (action.params) {
        newState = changeScenarioParam(newState, action.scenarioId,
          action.params);
      }
      return newState;
    case CHANGE_SCENARIO_PARAM:
      return changeScenarioParam(state, action);
    case SET_TASK_MODE:
      return setTaskMode(state, action.mode);
    default:
      return state;
  }
}
