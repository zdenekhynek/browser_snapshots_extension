import { combineReducers } from 'redux';

import agents from './agents/reducer';
import auth from './auth/reducer';
import config from './config/reducer';
import errors from './errors/reducer';
import scenarios from './scenarios/reducer';
import sessions from './sessions/reducer';
import snapshots from './snapshots/reducer';
import tasks from './tasks/reducer';
import ui from './ui/reducer';

export default combineReducers({
  agents,
  auth,
  config,
  errors,
  scenarios,
  tasks,
  sessions,
  snapshots,
  ui,
});
