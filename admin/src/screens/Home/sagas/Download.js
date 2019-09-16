import {all, takeLatest} from 'redux-saga/effects'
import downloadFile from '../../../utils/downloadFile'
import * as Actions from '../actions'

function download({payload}) {
  downloadFile(payload.url)
}

export default function* sagas() {
  yield all([

    takeLatest([
      Actions.DOWNLOAD_SUCCESS,
    ], download)
  ])
}
