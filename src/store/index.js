import { createStore, combineReducers } from 'redux'

import socket from './socket'
import win from './win'
const reduxers = combineReducers({
    socket: socket,
    win: win
})
let store = createStore(reduxers);
export default store