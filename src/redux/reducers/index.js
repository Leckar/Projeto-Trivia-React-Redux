import { combineReducers } from 'redux';
import apiReducer from './apiReducer';
import player from './player';

const rootReducer = combineReducers({ apiReducer, player });

export default rootReducer;
