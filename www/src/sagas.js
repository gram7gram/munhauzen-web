import {all, fork} from 'redux-saga/effects';

import Home from './screens/Home/sagas';
import Images from './screens/Images/sagas';
import ImageEdit from './screens/ImageEdit/sagas';

export default function* root() {
  yield all([
    fork(Home),
    fork(Images),
    fork(ImageEdit),
  ]);
}
