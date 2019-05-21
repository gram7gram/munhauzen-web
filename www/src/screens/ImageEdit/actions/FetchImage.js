import axios from 'axios'
import {
  FETCH_IMAGE_BEFORE, FETCH_IMAGE_FAILURE, FETCH_IMAGE_SUCCESS,
} from '../actions'
import parameters from "../../../parameters";

export default id => (dispatch) => {

  dispatch({
    type: FETCH_IMAGE_BEFORE,
    payload: {
      id
    }
  })

  axios.get(`${parameters.apiHost}/api/v1/images/${id}`)
    .then(({data}) => {

      dispatch({
        type: FETCH_IMAGE_SUCCESS,
        payload: data
      })

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: FETCH_IMAGE_FAILURE,
        payload: e.message
      })
    })
}