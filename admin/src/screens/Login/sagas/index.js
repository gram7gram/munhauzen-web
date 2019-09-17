import {all, fork} from 'redux-saga/effects';

import Login from './Login'

export default function* root() {
  yield all([
    fork(Login)
  ])
}
