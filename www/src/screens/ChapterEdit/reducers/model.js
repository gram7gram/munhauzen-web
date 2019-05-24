import {combineReducers} from 'redux';
import * as Actions from "../actions";
import keyBy from "lodash/keyBy";

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
      return action.payload.translations !== undefined
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
  icon,
  translations
});
