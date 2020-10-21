import { combineReducers } from 'redux'
import reducer from './reducer'

import socket from './socket'
const store = combineReducers({
    socket,
    ipc
})

export default store