import React from 'react';
import {render} from 'react-dom';

import {Provider} from 'react-redux';

import configureStore, {history} from './store';

import {ConnectedRouter} from 'connected-react-router'
import {createRouter} from './router';

import 'font-awesome/css/font-awesome.min.css';
import './styles/index.scss';

const rootElement = document.getElementById('root');

try {
  const store = configureStore()

  const App = <Provider store={store}>
    <ConnectedRouter history={history}>
      {createRouter(store)}
    </ConnectedRouter>
  </Provider>

  render(App, rootElement);

} catch (e) {
  console.error(e)

  window.location.reload()
}
