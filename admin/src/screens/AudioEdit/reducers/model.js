import {combineReducers} from 'redux';
import * as Actions from "../actions";

const _id = (prev = null, action) => {
  switch (action.type) {
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload._id
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const name = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.name !== undefined) {
        return action.payload.name
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.name || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const file = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.file !== undefined) {
        return action.payload.file
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.file || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const duration = (prev = 0, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.duration !== undefined) {
        return action.payload.duration
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.duration || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return 0
    default:
      return prev
  }
}

export default combineReducers({
  _id,
  name,
  file,
  duration,
});
