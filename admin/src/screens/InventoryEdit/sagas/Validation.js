import {all, put, select, takeLatest, throttle} from 'redux-saga/effects'
import {CHANGE, FETCH_ITEM_SUCCESS, VALIDATION_REQUEST} from '../actions'
import Validate from '../actions/Validate'

function* requestValidation() {
  yield put({
    type: VALIDATION_REQUEST
  })
}

function* runValidation() {
  const {model} = yield select(store => store.InventoryEdit)

  yield put(Validate(model))
}

export default function* sagas() {
  yield all([

    throttle(400, [
      CHANGE,
      FETCH_ITEM_SUCCESS,
    ], requestValidation),

    takeLatest([
      VALIDATION_REQUEST,
    ], runValidation)
  ])
}
