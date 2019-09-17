import * as Actions from '../actions'

export default () => (dispatch) => {

  localStorage.removeItem('token')

  dispatch({
    type: Actions.LOGOUT,
  })
}