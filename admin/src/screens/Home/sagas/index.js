import {all, fork} from 'redux-saga/effects';

import Notification from './Notification'

export default function* root() {
  yield all([
    fork(Notification),
  ])
}
