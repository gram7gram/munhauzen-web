import axios from 'axios'
import * as Actions from '../actions'
import parameters from "../../../parameters";
import objectValues from "../../../utils/objectValues";

const parseBeforeSubmit = model => {

  const data = {...model}

  delete data._id

  data.translations = objectValues(data.translations)

  return data
}

export default model => (dispatch) => {

  const data = parseBeforeSubmit(model)

  dispatch({
    type: Actions.SAVE_IMAGE_BEFORE,
  })

  let promise
  if (model._id) {
    promise = axios.put(`${parameters.apiHost}/api/v1/images/${model._id}`, data)
  } else {
    promise = axios.post(`${parameters.apiHost}/api/v1/images`, data)
  }

  promise
    .then(({data}) => {

      dispatch({
        type: Actions.SAVE_IMAGE_SUCCESS,
        payload: data
      })

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: Actions.SAVE_IMAGE_FAILURE,
        payload: e.response.data
      })
    })
}