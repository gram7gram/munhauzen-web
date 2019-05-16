import {combineReducers} from 'redux';
import * as Actions from "../actions";

const isLoading = (prev = false, action) => {
  switch (action.type) {
    default:
      return prev
  }
}


export default combineReducers({
  isLoading,
});
