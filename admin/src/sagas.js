import {all, fork} from 'redux-saga/effects';

import Home from './screens/Home/sagas';
import Images from './screens/Images/sagas';
import ImageEdit from './screens/ImageEdit/sagas';
import Audio from './screens/Audio/sagas';
import AudioEdit from './screens/AudioEdit/sagas';
import Inventory from './screens/Inventory/sagas';
import InventoryEdit from './screens/InventoryEdit/sagas';
import Scenario from './screens/Scenario/sagas';
import ScenarioEdit from './screens/ScenarioEdit/sagas';
import AudioFail from './screens/AudioFail/sagas';
import AudioFailEdit from './screens/AudioFailEdit/sagas';
import Chapter from './screens/Chapter/sagas';
import ChapterEdit from './screens/ChapterEdit/sagas';
import Login from './screens/Login/sagas';

export default function* root() {
  yield all([
    fork(Home),
    fork(Login),
    fork(Images),
    fork(ImageEdit),
    fork(AudioFail),
    fork(AudioFailEdit),
    fork(Audio),
    fork(AudioEdit),
    fork(Inventory),
    fork(InventoryEdit),
    fork(Scenario),
    fork(ScenarioEdit),
    fork(Chapter),
    fork(ChapterEdit),
  ]);
}
