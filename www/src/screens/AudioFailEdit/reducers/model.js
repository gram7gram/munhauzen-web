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

const audio = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.audio !== undefined) {
        return action.payload.audio
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.audio || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const locale = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.locale !== undefined) {
        return action.payload.locale
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.locale || null
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

const duration = (prev = 0, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.duration !== undefined) {
        return action.payload.duration
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.duration || 0
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return 0
    default:
      return prev
  }
}

const isFailMunhauzen = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isFailMunhauzen !== undefined) {
        return action.payload.isFailMunhauzen
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isFailMunhauzen || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

const isFailDaughter = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isFailDaughter !== undefined) {
        return action.payload.isFailDaughter
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isFailDaughter || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

export default combineReducers({
  _id,
  audio,
  name,
  file,
  duration,
  locale,
  description,
  isFailMunhauzen,
  isFailDaughter,
});
