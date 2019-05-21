import {combineReducers} from 'redux';
import * as Actions from "../actions";
import model from "./model";
import objectValues from "../../../utils/objectValues";

const isLoading = (prev = false, action) => {
  switch (action.type) {
    case Actions.SAVE_IMAGE_FAILURE:
    case Actions.SAVE_IMAGE_SUCCESS:
    case Actions.FETCH_IMAGE_SUCCESS:
    case Actions.FETCH_IMAGE_FAILURE:
      return false
    case Actions.SAVE_IMAGE_BEFORE:
    case Actions.FETCH_IMAGE_BEFORE:
      return true
    default:
      return prev
  }
}

const isValid = (prev = false, action) => {
  switch (action.type) {
    case Actions.VALIDATION_SUCCESS:
      return true
    case Actions.VALIDATION_FAILURE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

const validator = (prev = {}, action) => {
  switch (action.type) {
    case Actions.VALIDATION_FAILURE:
      return action.payload
    case Actions.VALIDATION_SUCCESS:
    case Actions.RESET:
      return {}
    default:
      return prev
  }
}

const serverErrors = (prev = [], action) => {
  switch (action.type) {
    case Actions.FETCH_IMAGE_FAILURE:
    case Actions.SAVE_IMAGE_FAILURE:
    case Actions.REMOVE_IMAGE_FAILURE:

      if (action.payload.errors) {
        return objectValues(action.payload.errors).map(error => error.message)
      }

      return [
        action.payload.message
      ]
    case Actions.REMOVE_IMAGE_BEFORE:
    case Actions.FETCH_IMAGE_BEFORE:
    case Actions.SAVE_IMAGE_BEFORE:
    case Actions.RESET:
      return []
    default:
      return prev
  }
}

const translationTab = (prev = null, action) => {
  switch (action.type) {
    case Actions.SET_TRANSLATION_TAB:
      return action.payload
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

export default combineReducers({
  isLoading,
  serverErrors,
  isValid,
  validator,
  translationTab,
  model
});
