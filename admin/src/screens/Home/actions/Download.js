import axios from '../../../utils/request'
import * as Actions from '../actions'
import parameters from "../../../parameters";

export default () => (dispatch, getState) => {

  const locale = getState().App.locale

  dispatch({
    type: Actions.DOWNLOAD_BEFORE,
  })

  axios(getState()).get(`${parameters.apiHost}/api/v1/${locale}/export`)
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