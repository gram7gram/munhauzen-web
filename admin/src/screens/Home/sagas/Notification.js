import {all, takeLatest} from 'redux-saga/effects'
import toastr from 'toastr'
import i18n from '../../../i18n'
import * as Actions from '../actions'

function alertSuccess() {
  toastr.success(i18n.t('placeholders.success'))
}

function alertError({payload}) {

  let msg = i18n.t('notifications.error_title')

  if (payload && payload.message) {
    msg = payload.message
  }

  toastr.error(msg)
}

export default function* sagas() {
  yield all([

    takeLatest([
      Actions.UPLOAD_SUCCESS,
      Actions.DOWNLOAD_SUCCESS,
    ], alertSuccess),

    takeLatest([
      Actions.UPLOAD_FAILURE,
      Actions.DOWNLOAD_FAILURE,
    ], alertError)
  ])
}
