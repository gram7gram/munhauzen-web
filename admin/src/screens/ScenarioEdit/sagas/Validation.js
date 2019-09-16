import {all, put, select, takeLatest, throttle} from 'redux-saga/effects'
import * as Actions from '../actions'
import Validate from '../actions/Validate'

function* requestValidation() {
  yield put({
    type: Actions.VALIDATION_REQUEST
  })
}

function* runValidation() {
  const {model} = yield select(store => store.ScenarioEdit)

  yield put(Validate(model))
}

export default function* sagas() {
  yield all([

    throttle(400, [
      Actions.CHANGE,
      Actions.CHANGE_DECISION,
      Actions.CHANGE_IMAGE,
      Actions.CHANGE_AUDIO,
      Actions.REMOVE_AUDIO,
      Actions.REMOVE_IMAGE,
      Actions.REMOVE_DECISION,
      Actions.ADD_IMAGE,
      Actions.ADD_AUDIO,
      Actions.ADD_DECISION,
      Actions.FETCH_ITEM_SUCCESS,
    ], requestValidation),

    takeLatest(Actions.VALIDATION_REQUEST, runValidation)
  ])
}
