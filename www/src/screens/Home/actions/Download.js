import axios from 'axios'
import * as Actions from '../actions'
import parameters from "../../../parameters";

export default () => (dispatch) => {

  dispatch({
    type: Actions.DOWNLOAD_BEFORE,
  })

  axios.get(`${parameters.apiHost}/api/v1/export`)
    .then(({data}) => {

      dispatch({
        type: Actions.DOWNLOAD_SUCCESS,
        payload: data
      })

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: Actions.DOWNLOAD_FAILURE,
        payload: e.response.data
      })
    })
}