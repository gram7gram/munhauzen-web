import {all, fork} from 'redux-saga/effects';

import Fetch from './Fetch'
import Notification from './Notification'

export default function* root() {
  yield all([
    fork(Fetch),
    fork(Notification),
  ])
}
