import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router'

import App from './App';
import Home from '../screens/Home/reducers';
import Images from '../screens/Images/reducers';
import ImageEdit from '../screens/ImageEdit/reducers';
import Audio from '../screens/Audio/reducers';
import AudioEdit from '../screens/AudioEdit/reducers';
import AudioFail from '../screens/AudioFail/reducers';
import AudioFailEdit from '../screens/AudioFailEdit/reducers';
import Inventory from '../screens/Inventory/reducers';
import InventoryEdit from '../screens/InventoryEdit/reducers';
import Scenario from '../screens/Scenario/reducers';
import ScenarioEdit from '../screens/ScenarioEdit/reducers';
import Chapter from '../screens/Chapter/reducers';
import ChapterEdit from '../screens/ChapterEdit/reducers';
import Login from '../screens/Login/reducers';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  App,
  Login,
  Home,
  Images,
  ImageEdit,
  Audio,
  AudioEdit,
  AudioFail,
  AudioFailEdit,
  Inventory,
  InventoryEdit,
  Scenario,
  ScenarioEdit,
  Chapter,
  ChapterEdit,
});

export default createRootReducer