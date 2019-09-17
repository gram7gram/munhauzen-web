import axios from '../../../utils/request'
import * as Actions from '../actions'
import parameters from "../../../parameters";

export default data => (dispatch, getState) => {

  const locale = getState().App.locale

  dispatch({
    type: Actions.LOGIN_CHECK_BEFORE,
  })

  axios(getState()).post(`${parameters.apiHost}/api/v1/${locale}/login-check`, data)
    .then(({data}) => {

      dispatch({
        type: Actions.LOGIN_CHECK_SUCCESS,
        payload: data
      })

    })
    .catch(e => {

      let payload = {}

      if (e.response) {
        payload = e.response.data
      } else {
        console.error(e);
      }

      dispatch({
        type: Actions.LOGIN_CHECK_FAILURE,
        payload
      })
    })
}