import axios from 'axios'
import * as Actions from '../actions'
import parameters from "../../../parameters";

export default file => (dispatch, getState) => {

  const locale = getState().App.locale

  dispatch({
    type: Actions.UPLOAD_BEFORE,
  })

  const data = new FormData()
  data.append('import', file)

  axios.post(`${parameters.apiHost}/api/v1/${locale}/import`, data)
    .then(({data}) => {

      dispatch({
        type: Actions.UPLOAD_SUCCESS,
        payload: data
      })

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: Actions.UPLOAD_FAILURE,
        payload: e.response.data
      })
    })
}