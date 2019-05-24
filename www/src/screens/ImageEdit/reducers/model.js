import {combineReducers} from 'redux';
import keyBy from 'lodash/keyBy';
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

const isAnimation = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isAnimation !== undefined) {
        return action.payload.isAnimation
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isAnimation || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

const isForbidden = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isForbidden !== undefined) {
        return action.payload.isForbidden
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isForbidden || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

const isBonus = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isBonus !== undefined) {
        return action.payload.isBonus
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isBonus || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}
const isSuperBonus = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isSuperBonus !== undefined) {
        return action.payload.isSuperBonus
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isSuperBonus || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}


const translations = (prev = {}, action) => {
  switch (action.type) {
    case Actions.CHANGE_TRANSLATION:

      const {locale} = action

      const state = {...prev}

      if (state[locale] === undefined) {
        state[locale] = {locale}
      }

      state[locale] = {
        ...state[locale],
        ...action.payload
      }

      return state
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.translations
        ? keyBy(action.payload.translations, 'locale')
        : {}

    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return {}
    default:
      return prev
  }
}

export default combineReducers({
  _id,
  name,
  file,
  type,
  isAnimation,
  isForbidden,
  isBonus,
  isSuperBonus,
  translations,
});