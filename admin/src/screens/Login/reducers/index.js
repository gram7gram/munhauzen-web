import {combineReducers} from 'redux';
import * as Actions from "../actions";

const isLoading = (prev = false, action) => {
  switch (action.type) {
    case Actions.LOGIN_CHECK_BEFORE:
      return true
    case Actions.LOGIN_CHECK_SUCCESS:
    case Actions.LOGIN_CHECK_FAILURE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

const isError = (prev = false, action) => {
  switch (action.type) {
    case Actions.RESET:
    case Actions.LOGIN_CHECK_SUCCESS:
    case Actions.LOGIN_CHECK_BEFORE:
      return false
    case Actions.LOGIN_CHECK_FAILURE:
      return true
    default:
      return prev
  }
}

const password = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.password !== undefined) {
        return action.payload.password
      }

      return prev
    case Actions.RESET:
    case Actions.LOGIN_CHECK_SUCCESS:
      return null
    default:
      return prev
  }
}

export default combineReducers({
  isLoading,
  isError,
  password,
});
