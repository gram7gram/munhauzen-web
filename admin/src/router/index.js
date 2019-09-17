import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import * as Pages from './Pages';

import Navigation from '../components/Navigation';

import Home from '../screens/Home';
import Images from '../screens/Images';
import ImageEdit from '../screens/ImageEdit';
import AudioFail from '../screens/AudioFail';
import AudioFailEdit from '../screens/AudioFailEdit';
import Audio from '../screens/Audio';
import AudioEdit from '../screens/AudioEdit';
import Inventory from '../screens/Inventory';
import InventoryEdit from '../screens/InventoryEdit';
import Scenario from '../screens/Scenario';
import ScenarioEdit from '../screens/ScenarioEdit';
import Chapter from '../screens/Chapter';
import ChapterEdit from '../screens/ChapterEdit';
import Login from '../screens/Login';
import Loading from '../screens/Loading';

export function createRouter(store) {

  const InitialRoute = ({component: Component, ...rest}) => {

    const appState = store.getState().App

    if (appState.isLoadingVisible) {
      return <Route {...rest} render={() => (
        <Loading/>
      )}/>
    }

    return <Route {...rest} render={(props) => (
      <Component {...props}/>
    )}/>
  }

  const PrivateRoute = ({component: Component, ...rest}) => {

    const appState = store.getState().App

    if (appState.isLoadingVisible) {
      return <Route {...rest} render={() => (
        <Loading/>
      )}/>
    }

    if (appState.isAuthenticated === true) {
      return <Route {...rest} render={(props) => (
        <Component {...props}/>
      )}/>
    }

    return <Redirect to={Pages.LOGIN.replace(':locale', appState.locale)}/>
  }

  return <div>

    <Navigation/>

    <Switch>
      <InitialRoute exact path={Pages.LOGIN} component={Login}/>

      <PrivateRoute exact path={Pages.HOME} component={Home}/>

      <PrivateRoute exact path={Pages.CHAPTERS} component={Chapter}/>
      <PrivateRoute exact path={Pages.CHAPTER_CREATE} component={ChapterEdit}/>
      <PrivateRoute path={Pages.CHAPTER_EDIT} component={ChapterEdit}/>

      <PrivateRoute exact path={Pages.AUDIO_FAILS} component={AudioFail}/>
      <PrivateRoute exact path={Pages.AUDIO_FAILS_CREATE} component={AudioFailEdit}/>
      <PrivateRoute path={Pages.AUDIO_FAILS_EDIT} component={AudioFailEdit}/>

      <PrivateRoute exact path={Pages.AUDIO} component={Audio}/>
      <PrivateRoute exact path={Pages.AUDIO_CREATE} component={AudioEdit}/>
      <PrivateRoute path={Pages.AUDIO_EDIT} component={AudioEdit}/>

      <PrivateRoute exact path={Pages.AUDIO} component={Audio}/>
      <PrivateRoute exact path={Pages.AUDIO_CREATE} component={AudioEdit}/>
      <PrivateRoute path={Pages.AUDIO_EDIT} component={AudioEdit}/>

      <PrivateRoute exact path={Pages.INVENTORY} component={Inventory}/>
      <PrivateRoute exact path={Pages.INVENTORY_CREATE} component={InventoryEdit}/>
      <PrivateRoute path={Pages.INVENTORY_EDIT} component={InventoryEdit}/>

      <PrivateRoute exact path={Pages.SCENARIO} component={Scenario}/>
      <PrivateRoute exact path={Pages.SCENARIO_CREATE} component={ScenarioEdit}/>
      <PrivateRoute path={Pages.SCENARIO_EDIT} component={ScenarioEdit}/>

      <PrivateRoute exact path={Pages.IMAGES} component={Images}/>
      <PrivateRoute exact path={Pages.IMAGE_CREATE} component={ImageEdit}/>
      <PrivateRoute path={Pages.IMAGE_EDIT} component={ImageEdit}/>

      <Redirect path="*" to={Pages.HOME.replace(':locale', 'en')}/>

    </Switch>
  </div>
}