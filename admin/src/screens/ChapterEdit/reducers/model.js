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

const number = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.number !== undefined) {
        return action.payload.number
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      if (action.payload.number !== undefined)
        return action.payload.number
      return null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const chapterAudio = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.chapterAudio !== undefined) {
        return action.payload.chapterAudio
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      if (action.payload.chapterAudio !== undefined)
        return action.payload.chapterAudio
      return null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const icon = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.icon !== undefined) {
        return action.payload.icon
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.icon || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const description = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.description !== undefined) {
        return action.payload.description
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.description || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

export default combineReducers({
  _id,
  name,
  number,
  chapterAudio,
  icon,
  description
});
