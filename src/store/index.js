import { createStore } from 'redux';
import reducer from './reducers';

const store = createStore(reducer);
store.subscribe(() => console.log('store变化', store.getState()))
export default store;
