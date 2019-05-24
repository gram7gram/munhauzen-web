import React from 'react';
import {render} from 'react-dom';

import {Provider} from 'react-redux';

import store from './store';

import {createRouter} from './router';

import 'font-awesome/css/font-awesome.min.css';
import './styles/index.scss';

const rootElement = document.getElementById('root');

render(<Provider store={store}>
  {createRouter()}
</Provider>, rootElement);
