import {all, fork} from 'redux-saga/effects';

import Download from './Download'
import Notification from './Notification'

export default function* root() {
  yield all([
    fork(Download),
    fork(Notification),
  ])
}
