import {combineReducers} from 'redux';
import * as Actions from "../actions";

const isLoading = (prev = false, action) => {
  switch (action.type) {
    case Actions.FETCH_IMAGES_SUCCESS:
    case Actions.FETCH_IMAGES_FAILURE:
      return false
    case Actions.FETCH_IMAGES_BEFORE:
      return true
    default:
      return prev
  }
}

const items = (prev = [], action) => {
  switch (action.type) {
    case Actions.REMOVE_IMAGE_BEFORE:
      return prev.filter(item => item._id !== action.payload.id)
    case Actions.FETCH_IMAGES_SUCCESS:
      return action.payload.items
    default:
      return prev
  }
}

const search = (prev = null, action) => {
  switch (action.type) {
    case Actions.CHANGE_FILTER:
      if (action.payload.search !== undefined)
        return action.payload.search

      return prev
    case Actions.RESET:
      return null
    default:
      return prev
  }
}

export default combineReducers({
  isLoading,
  search,
  items,
});
