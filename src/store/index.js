import { createStore, combineReducers } from 'redux'

import socket from './socket'
import win from './win'
const reduxers = combineReducers({
    socket: socket,
    win: win
})

let store = createStore(reduxers);
// console.log(store)
//对其进行二次封装,将一些dispatch的操作拿出来

export default store