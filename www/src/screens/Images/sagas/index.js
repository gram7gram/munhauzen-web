import {all, throttle, put} from 'redux-saga/effects';
import FetchImages from "../actions/FetchImages";

import {FETCH_IMAGES_REQUEST} from "../actions";

function* fetchItems() {
  yield put(FetchImages())
}

export default function* root() {
  yield all([

    throttle(300, FETCH_IMAGES_REQUEST, fetchItems)

  ])
}
