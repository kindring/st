import { createStore, combineReducers } from 'redux'

import socket from './socket'
import win from './win'
const reduxers = combineReducers({
    socket: socket,
    win: win
})

let store = createStore(reduxers);
// console.log(store)
export default store