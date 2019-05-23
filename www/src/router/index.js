import React from 'react';
import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom';

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

export function createRouter() {
  return <BrowserRouter>

    <Navigation/>

    <Switch>

      <Route exact path={Pages.HOME} component={Home}/>

      <Route exact path={Pages.AUDIO_FAILS} component={AudioFail}/>
      <Route exact path={Pages.AUDIO_FAILS_CREATE} component={AudioFailEdit}/>
      <Route path={Pages.AUDIO_FAILS_EDIT} component={AudioFailEdit}/>

      <Route exact path={Pages.AUDIO} component={Audio}/>
      <Route exact path={Pages.AUDIO_CREATE} component={AudioEdit}/>
      <Route path={Pages.AUDIO_EDIT} component={AudioEdit}/>

      <Route exact path={Pages.AUDIO} component={Audio}/>
      <Route exact path={Pages.AUDIO_CREATE} component={AudioEdit}/>
      <Route path={Pages.AUDIO_EDIT} component={AudioEdit}/>

      <Route exact path={Pages.INVENTORY} component={Inventory}/>
      <Route exact path={Pages.INVENTORY_CREATE} component={InventoryEdit}/>
      <Route path={Pages.INVENTORY_EDIT} component={InventoryEdit}/>

      <Route exact path={Pages.SCENARIO} component={Scenario}/>
      <Route exact path={Pages.SCENARIO_CREATE} component={ScenarioEdit}/>
      <Route path={Pages.SCENARIO_EDIT} component={ScenarioEdit}/>

      <Route exact path={Pages.IMAGES} component={Images}/>
      <Route exact path={Pages.IMAGE_CREATE} component={ImageEdit}/>
      <Route path={Pages.IMAGE_EDIT} component={ImageEdit}/>

      <Redirect path="*" to={Pages.HOME}/>

    </Switch>
  </BrowserRouter>
}