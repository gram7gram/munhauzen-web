import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import Cookies from 'js-cookie'
import {routerMiddleware} from 'connected-react-router'
import {createBrowserHistory} from 'history'

import sagas from './sagas'
import reducers from './reducers'
import LoginCheck from './screens/Login/actions/LoginCheck'

export const history = createBrowserHistory()

const sagaMiddleware = createSagaMiddleware()

let middleware = [promise, thunk, sagaMiddleware, routerMiddleware(history)]
let composeEnhancers = compose

if (process.env.NODE_ENV !== 'production') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

let token = localStorage.getItem('token')
if (!token) {
  token = null
}

let locale = Cookies.get('locale')

const locales = ['ru', 'en', 'ua']

if (locales.indexOf(locale) === -1) {
  locale = 'en'
}

const initial = {
  App: {
    isAuthenticated: false,
    isLoadingVisible: !!token,
    token,
    locale,
    locales
  }
}

export default () => {

  const store = createStore(
    reducers(history),
    initial,
    composeEnhancers(
      applyMiddleware(...middleware)
    )
  )

  sagaMiddleware.run(sagas)

  if (token) {
    store.dispatch(LoginCheck({token}))
  }

  return store
}
