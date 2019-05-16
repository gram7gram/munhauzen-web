import {combineReducers} from 'redux';
import * as Actions from "../actions";
import model from "./model";

const isLoading = (prev = false, action) => {
  switch (action.type) {
    case Actions.FETCH_IMAGE_SUCCESS:
    case Actions.FETCH_IMAGE_FAILURE:
      return false
    case Actions.FETCH_IMAGE_BEFORE:
      return true
    default:
      return prev
  }
}

export default combineReducers({
  isLoading,
  model
});
