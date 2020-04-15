import tagNav from './tagNav';
import userManage from './user';
import { combineReducers } from 'redux';

const reducers = combineReducers({ tagNav, userManage });
export default reducers;