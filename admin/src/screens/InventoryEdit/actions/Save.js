import axios from '../../../utils/request'
import * as Actions from '../actions'
import parameters from "../../../parameters";

const parseBeforeSubmit = model => {

  const data = {...model}

  delete data._id

  return data
}

export default model => (dispatch, getState) => {

  const locale = getState().App.locale

  const data = parseBeforeSubmit(model)

  dispatch({
    type: Actions.SAVE_BEFORE,
  })

  let promise
  if (model._id) {
    promise = axios(getState()).put(`${parameters.apiHost}/api/v1/${locale}/inventory/${model._id}`, data)
  } else {
    promise = axios(getState()).post(`${parameters.apiHost}/api/v1/${locale}/inventory`, data)
  }

  promise
    .then(({data}) => {

      dispatch({
        type: Actions.SAVE_SUCCESS,
        payload: data
      })

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: Actions.SAVE_FAILURE,
        payload: e.response.data
      })
    })
}