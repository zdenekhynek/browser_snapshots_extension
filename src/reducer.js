import { combineReducers } from 'redux';

import agent from './agent/reducer';
import auth from './auth/reducer';
import config from './config/reducer';
import errors from './errors/reducer';
import sessions from './sessions/reducer';
import snapshots from './snapshots/reducer';
import ui from './ui/reducer';

export default combineReducers({
  agent,
  auth,
  config,
  errors,
  sessions,
  snapshots,
  ui,
});
