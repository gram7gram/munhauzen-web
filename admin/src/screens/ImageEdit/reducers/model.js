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

const type = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.type !== undefined) {
        return action.payload.type
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.type || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const relatedStatue = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.relatedStatue !== undefined) {
        return action.payload.relatedStatue
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.relatedStatue || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const relatedScenario = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.relatedScenario !== undefined) {
        return action.payload.relatedScenario
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.relatedScenario || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const isHiddenFromGallery = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isHiddenFromGallery !== undefined) {
        return action.payload.isHiddenFromGallery
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isHiddenFromGallery || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
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
  file,
  type,
  isHiddenFromGallery,
  description,
  relatedStatue,
  relatedScenario,
});
