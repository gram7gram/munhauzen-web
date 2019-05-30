import axios from 'axios'
import * as Actions from '../actions'
import parameters from "../../../parameters";

export default (model, callback) => (dispatch) => {

  dispatch({
    type: Actions.REMOVE_ITEM_BEFORE,
  })

  axios.delete(`${parameters.apiHost}/api/v1/audio-fails/${model._id}`)
    .then(() => {

      dispatch({
        type: Actions.REMOVE_ITEM_SUCCESS,
      })

      if (callback) {
        callback()
      }

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: Actions.REMOVE_ITEM_FAILURE,
        payload: e.response.data
      })
    })
}