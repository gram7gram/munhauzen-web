import axios from 'axios'
import {
  FETCH_IMAGE_BEFORE, FETCH_IMAGE_FAILURE, FETCH_IMAGE_SUCCESS,
} from '../actions'

export default id => (dispatch, getState) => {

  const locale = getState().App.locale

  dispatch({
    type: FETCH_IMAGE_BEFORE,
    payload: {
      id
    }
  })

  axios.get(`${process.env.API_HOST}/api/v1/${locale}/images/${id}`)
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