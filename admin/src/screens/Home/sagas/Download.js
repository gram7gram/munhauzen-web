import {all, takeLatest, put} from 'redux-saga/effects'
import * as Actions from '../actions'
import Download from '../actions/Download'

function* startDownload() {
  yield put(Download())
}

export default function* sagas() {
  yield all([

    takeLatest([
      Actions.UPLOAD_SUCCESS,
    ], startDownload)
  ])
}
