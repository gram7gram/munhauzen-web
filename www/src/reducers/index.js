import {combineReducers} from 'redux';

import App from './App';
import Home from '../screens/Home/reducers';
import Images from '../screens/Images/reducers';
import ImageEdit from '../screens/ImageEdit/reducers';

export default combineReducers({
  App,
  Home,
  Images,
  ImageEdit,
});
