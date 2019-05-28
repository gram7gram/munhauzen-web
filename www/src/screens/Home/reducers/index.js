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

const serverResult = (prev = [], action) => {
  switch (action.type) {
    case Action.UPLOAD_BEFORE:
      return []
    case Action.UPLOAD_SUCCESS:
      return action.payload.result
    case Action.UPLOAD_FAILURE:

      if (action.payload.message !== undefined) {
        return [
          action.payload.message
        ]
      }

      if (action.payload.result !== undefined) {
        return action.payload.result
      }

      return []
    default:
      return prev
  }
}


export default combineReducers({
  serverResult,
  isUploading,
  isDownloading,
});
