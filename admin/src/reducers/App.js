import {combineReducers} from 'redux';

const locale = (prev = null, action) => prev

const locales = (prev = [], action) => prev

export default combineReducers({
  locale,
  locales,
});
