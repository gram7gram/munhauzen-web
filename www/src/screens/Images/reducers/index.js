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
    case Actions.FETCH_IMAGES_SUCCESS:
      return action.payload.items
    default:
      return prev
  }
}


export default combineReducers({
  isLoading,
  items
});
