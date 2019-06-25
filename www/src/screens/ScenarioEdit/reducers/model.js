import {combineReducers} from 'redux';
import uuid from 'uuid';
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

const action = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.action !== undefined) {
        return action.payload.action
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.action || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const isBegin = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.isBegin !== undefined) {
        return action.payload.isBegin
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.isBegin || false
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

const chapter = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.chapter !== undefined) {
        return action.payload.chapter
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.chapter || null
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

const interaction = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE:
      if (action.payload.interaction !== undefined) {
        return action.payload.interaction
      }

      return prev
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:
      return action.payload.interaction || null
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

const images = (prev = {}, action) => {
  let state
  switch (action.type) {
    case Actions.REMOVE_IMAGE:

      state = {...prev}

      delete state[action.payload.cid]

      return state

    case Actions.ADD_IMAGE:

      return {
        ...prev,
        [action.payload.cid]: action.payload
      }
    case Actions.CHANGE_IMAGE:

      const {cid} = action

      state = {...prev}

      if (state[cid] === undefined) {
        state[cid] = {cid}
      }

      state[cid] = {
        ...state[cid],
        ...action.payload
      }

      return state
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:

      if (action.payload.images !== undefined) {
        const items = action.payload.images.map(item => {
          item.cid = uuid()
          return item
        })

        return keyBy(items, 'cid')
      }

      return {}
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return {}
    default:
      return prev
  }
}

const audio = (prev = {}, action) => {
  let state, cid
  switch (action.type) {
    case Actions.REMOVE_AUDIO:

      state = {...prev}

      delete state[action.payload.cid]

      return state

    case Actions.ADD_AUDIO:

      return {
        ...prev,
        [action.payload.cid]: action.payload
      }

    case Actions.CHANGE_AUDIO:

      cid = action.cid

      state = {...prev}

      if (state[cid] === undefined) {
        state[cid] = {cid}
      }

      state[cid] = {
        ...state[cid],
        ...action.payload
      }

      return state
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:

      if (action.payload.audio !== undefined) {
        const items = action.payload.audio.map(item => {
          item.cid = uuid()
          return item
        })

        return keyBy(items, 'cid')
      }

      return {}
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return {}
    default:
      return prev
  }
}

const decisions = (prev = {}, action) => {
  let state, cid
  switch (action.type) {
    case Actions.REMOVE_DECISION:

      state = {...prev}

      delete state[action.payload.cid]

      return state

    case Actions.ADD_DECISION:

      return {
        ...prev,
        [action.payload.cid]: action.payload
      }

    case Actions.CHANGE_DECISION:

      cid = action.cid

      state = {...prev}

      if (state[cid] === undefined) {
        state[cid] = {cid}
      }

      state[cid] = {
        ...state[cid],
        ...action.payload
      }

      return state
    case Actions.SAVE_SUCCESS:
    case Actions.FETCH_ITEM_SUCCESS:

      if (action.payload.decisions !== undefined) {
        const items = action.payload.decisions.map(item => {
          item.cid = uuid()
          return item
        })

        return keyBy(items, 'cid')
      }

      return {}
    case Actions.FETCH_ITEM_BEFORE:
    case Actions.RESET:
      return {}
    default:
      return prev
  }
}

export default combineReducers({
  _id,
  isBegin,
  name,
  chapter,
  interaction,
  action,
  audio,
  images,
  decisions,
  translations,
});
