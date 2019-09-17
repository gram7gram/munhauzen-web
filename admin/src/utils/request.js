import axios from 'axios'

export default (state) => {
  
  return axios.create({
    headers: {
      common: {
        Authorization: state.App.token
      }
    }
  })

}