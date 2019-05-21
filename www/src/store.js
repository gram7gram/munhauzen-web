import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'

import sagas from './sagas'
import reducers from './reducers'

const sagaMiddleware = createSagaMiddleware()

let middleware = [promise, thunk, sagaMiddleware]
let composeEnhancers = compose

if (process.env.NODE_ENV !== 'production') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

const initial = {
  App: {
    locale: 'ru',
    locales: ['ru', 'en', 'ua']
  }
}

const store = createStore(reducers, initial, composeEnhancers(
  applyMiddleware(...middleware)
))

sagaMiddleware.run(sagas)

export default store
