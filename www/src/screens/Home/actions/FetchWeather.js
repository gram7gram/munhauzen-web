import axios from 'axios'
import {LOAD_WEATHER_BEFORE, LOAD_WEATHER_FAILURE, LOAD_WEATHER_SUCCESS} from '../actions'

const parseResults = (data, temp, humidity) => {


}

export default filters => dispatch => {


  const query = [
    'APPID=a3711a53c8810ffe022e4c4663109722',
    'cluster=no',
    'units=metric',
    'bbox=-180,-90,180,90,10',
  ]

  const temp = filters.sex === 'male' ? 21 : 22
  const humidity = 50

  dispatch({
    type: LOAD_WEATHER_BEFORE,
    payload: {
      temp,
      humidity
    }
  })

  axios.get('https://api.openweathermap.org/data/2.5/box/city' + (query.length > 0 ? '?' + query.join('&') : ''))
    .then(({data}) => {

      dispatch({
        type: LOAD_WEATHER_SUCCESS,
        payload: parseResults(data, temp, humidity)
      })

    })
    .catch(e => {
      if (!e.response) {
        console.log(e);
        return
      }

      dispatch({
        type: LOAD_WEATHER_FAILURE,
        payload: e.message
      })
    })
}