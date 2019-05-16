import axios from 'axios'
import {
  FETCH_IMAGES_BEFORE, FETCH_IMAGES_FAILURE, FETCH_IMAGES_SUCCESS,
} from '../actions'

export default filters => (dispatch, getState) => {

  const locale = getState().App.locale

  const query = [

  ]

  dispatch({
    type: FETCH_IMAGES_BEFORE,
    payload: {
      query
    }
  })

  axios.get(`${process.env.API_HOST}/api/v1/${locale}/images` + (query.length > 0 ? '?' + query.join('&') : ''))
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