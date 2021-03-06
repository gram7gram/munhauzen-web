import axios from '../../../utils/request'
import {FETCH_ITEM_BEFORE, FETCH_ITEM_FAILURE, FETCH_ITEM_SUCCESS,} from '../actions'
import parameters from "../../../parameters";

export default id => (dispatch, getState) => {

  const locale = getState().App.locale

  dispatch({
    type: FETCH_ITEM_BEFORE,
    payload: {
      id
    }
  })

  axios(getState()).get(`${parameters.apiHost}/api/v1/${locale}/inventory/${id}`)
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
        payload: e.response.data
      })
    })
}