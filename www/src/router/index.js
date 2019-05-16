import React from 'react';
import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom';

import * as Pages from './Pages';

import Home from '../screens/Home';
import Images from '../screens/Images';

export function createRouter() {
  return <BrowserRouter>
    <Switch>

      <Route exact path={Pages.HOME} component={Home}/>
      <Route exact path={Pages.IMAGES} component={Images}/>
      <Redirect path="*" to={Pages.HOME}/>

    </Switch>
  </BrowserRouter>
}