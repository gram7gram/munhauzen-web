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

const isStatue = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isStatue !== undefined) {
        return action.payload.isStatue
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isStatue || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

const isMenu = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isMenu !== undefined) {
        return action.payload.isMenu
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isMenu || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

const relatedScenario = (prev = [], action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.relatedScenario !== undefined) {
        return action.payload.relatedScenario
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.relatedScenario || []
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return []
    default:
      return prev
  }
}

const relatedInventory = (prev = [], action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.relatedInventory !== undefined) {
        return action.payload.relatedInventory
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.relatedInventory || []
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return []
    default:
      return prev
  }
}

const statueImage = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.statueImage !== undefined) {
        return action.payload.statueImage
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.statueImage || null
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
  isStatue,
  isMenu,
  description,
  relatedInventory,
  relatedScenario,
  statueImage,
});
