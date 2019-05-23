import {all, fork} from 'redux-saga/effects';

import Validation from './Validation'

export default function* root() {
  yield all([
    fork(Validation)
  ])
}
