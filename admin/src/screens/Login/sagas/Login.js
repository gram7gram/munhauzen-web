import {all, takeLatest, select, put} from 'redux-saga/effects'
import {replace} from 'connected-react-router'
import * as Actions from '../actions'
import * as Pages from '../../../router/Pages'

function* saveToken({payload}) {

  localStorage.setItem('token', payload.token)

  const locale = yield select(store => store.App.locale)

  yield put(replace(Pages.HOME.replace(':locale', locale)))
}

function* removeToken() {

  localStorage.removeItem('token')

  const locale = yield select(store => store.App.locale)

  yield put(replace(Pages.LOGIN.replace(':locale', locale)))
}

export default function* sagas() {
  yield all([

    takeLatest([
      Actions.LOGIN_CHECK_SUCCESS,
    ], saveToken),

    takeLatest([
      Actions.LOGIN_CHECK_FAILURE,
    ], removeToken)
  ])
}
