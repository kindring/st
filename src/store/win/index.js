// socket相关的数据仓库
import { createStore } from 'redux'

import reduxer from './reduxer';

const store = combineReducers({
    socket,
    ipc
})

export default store