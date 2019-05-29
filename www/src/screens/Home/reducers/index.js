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
    case Action.DOWNLOAD_BEFORE:
      return true
    case Action.DOWNLOAD_SUCCESS:
    case Action.DOWNLOAD_FAILURE:
      return false
    default:
      return prev
  }
}

const uploadResult = (prev = null, action) => {
  switch (action.type) {
    case Action.UPLOAD_BEFORE:
      return null
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

      return null
    default:
      return prev
  }
}

const downloadResult = (prev = null, action) => {
  switch (action.type) {
    case Action.DOWNLOAD_BEFORE:
      return null
    case Action.DOWNLOAD_SUCCESS:
      return action.payload

    case Action.DOWNLOAD_FAILURE:

      if (action.payload.message !== undefined) {
        return [
          action.payload.message
        ]
      }

      return null
    default:
      return prev
  }
}


export default combineReducers({
  uploadResult,
  downloadResult,
  isUploading,
  isDownloading,
});
