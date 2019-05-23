import axios from 'axios'
import {
  FETCH_ITEM_BEFORE, FETCH_ITEM_FAILURE, FETCH_ITEM_SUCCESS,
} from '../actions'
import parameters from "../../../parameters";

export default id => (dispatch) => {

  dispatch({
    type: FETCH_ITEM_BEFORE,
    payload: {
      id
    }
  })

  axios.get(`${parameters.apiHost}/api/v1/scenario/${id}`)
    .then(({data}) => {

      dispatch({
        type: FETCH_ITEM_SUCCESS,
        payload: data
      })

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: FETCH_ITEM_FAILURE,
        payload: e.message
      })
    })
}