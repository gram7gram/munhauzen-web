import axios from 'axios'
import {FETCH_ITEMS_BEFORE, FETCH_ITEMS_FAILURE, FETCH_ITEMS_SUCCESS,} from '../actions'
import parameters from '../../../parameters'

export default filters => (dispatch) => {

  const query = []

  dispatch({
    type: FETCH_ITEMS_BEFORE,
    payload: {
      query
    }
  })

  axios.get(`${parameters.apiHost}/api/v1/audio-fails` + (query.length > 0 ? '?' + query.join('&') : ''))
    .then(({data}) => {

      dispatch({
        type: FETCH_ITEMS_SUCCESS,
        payload: data
      })

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: FETCH_ITEMS_FAILURE,
        payload: e.message
      })
    })
}