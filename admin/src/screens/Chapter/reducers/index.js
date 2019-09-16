import {combineReducers} from 'redux';
import * as Actions from "../actions";

const isLoading = (prev = false, action) => {
  switch (action.type) {
    case Actions.FETCH_ITEMS_SUCCESS:
    case Actions.FETCH_ITEMS_FAILURE:
      return false
    case Actions.FETCH_ITEMS_BEFORE:
      return true
    default:
      return prev
  }
}

const items = (prev = [], action) => {
  switch (action.type) {
    case Actions.REMOVE_ITEM_BEFORE:
      return prev.filter(item => item._id !== action.payload.id)
    case Actions.FETCH_ITEMS_SUCCESS:
      return action.payload.items
    default:
      return prev
  }
}

const search = (prev = '', action) => {
  switch (action.type) {
    case Actions.CHANGE_FILTER:
      if (action.payload.search !== undefined)
        return action.payload.search

      return prev
    case Actions.RESET:
      return ''
    default:
      return prev
  }
}

const isMenu = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE_FILTER:
      if (action.payload.isMenu !== undefined)
        return action.payload.isMenu

      return prev
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

const isStatue = (prev = false, action) => {
  switch (action.type) {
    case Actions.CHANGE_FILTER:
      if (action.payload.isStatue !== undefined)
        return action.payload.isStatue

      return prev
    case Actions.RESET:
      return false
    default:
      return prev
  }
}

export default combineReducers({
  isLoading,
  items,
  search,
  isMenu,
  isStatue,
});
