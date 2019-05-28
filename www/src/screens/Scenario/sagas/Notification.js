import {all, takeLatest} from 'redux-saga/effects'
import toastr from 'toastr'
import i18n from '../../../i18n'
import * as Actions from '../actions'

function alertSuccess() {
  toastr.success(i18n.t('notifications.success_title'))
}

function alertError() {
  toastr.error(i18n.t('notifications.error_title'))
}

export default function* sagas() {
  yield all([

    takeLatest([
      Actions.REMOVE_ITEM_SUCCESS
    ], alertSuccess),

    takeLatest([
      Actions.REMOVE_ITEM_FAILURE,
      Actions.FETCH_ITEMS_FAILURE,
    ], alertError)
  ])
}
