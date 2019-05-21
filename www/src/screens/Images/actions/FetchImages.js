import axios from 'axios'
import {
  FETCH_IMAGES_BEFORE, FETCH_IMAGES_FAILURE, FETCH_IMAGES_SUCCESS,
} from '../actions'
import parameters from '../../../parameters'

export default filters => (dispatch) => {

  const query = [

  ]

  dispatch({
    type: FETCH_IMAGES_BEFORE,
    payload: {
      query
    }
  })

  axios.get(`${parameters.apiHost}/api/v1/images` + (query.length > 0 ? '?' + query.join('&') : ''))
    .then(({data}) => {

      dispatch({
        type: FETCH_IMAGES_SUCCESS,
        payload: data
      })

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: FETCH_IMAGES_FAILURE,
        payload: e.message
      })
    })
}