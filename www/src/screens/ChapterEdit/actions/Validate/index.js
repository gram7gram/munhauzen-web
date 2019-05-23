import validate from './Action'
import {VALIDATION_FAILURE, VALIDATION_SUCCESS} from '../../actions'

export default (model) => dispatch => {
  const validator = validate(model)

  if (validator.count === 0) {
    dispatch({
      type: VALIDATION_SUCCESS
    })
  } else {
    dispatch({
      type: VALIDATION_FAILURE,
      payload: validator
    })
  }

  return validator
}