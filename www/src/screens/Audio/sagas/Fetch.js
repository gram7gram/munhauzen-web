import {all, put, throttle} from 'redux-saga/effects';
import Fetch from "../actions/Fetch";

import {FETCH_ITEMS_REQUEST} from "../actions";

function* fetchItems() {
  yield put(Fetch())
}

export default function* root() {
  yield all([

    throttle(300, FETCH_ITEMS_REQUEST, fetchItems)

  ])
}
