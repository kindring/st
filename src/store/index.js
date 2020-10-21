import { combineReducers } from 'redux'

import socket from './socket'
import win from './win'
const store = combineReducers({
    socket,
    win
})

export default store