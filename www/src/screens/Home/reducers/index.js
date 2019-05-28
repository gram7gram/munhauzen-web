import {combineReducers} from 'redux';
import * as Action from '../actions';

const isUploading = (prev = false, action) => {
  switch (action.type) {
    case Action.UPLOAD_BEFORE:
      return true
    case Action.UPLOAD_SUCCESS:
    case Action.UPLOAD_FAILURE:
      return false
    default:
      return prev
  }
}
const isDownloading = (prev = false, action) => {
  switch (action.type) {
    default:
      return prev
  }
}


export default combineReducers({
  isUploading,
  isDownloading,
});
