/*
 * @Author: your name
 * @Date: 2021-08-25 16:38:01
 * @LastEditTime: 2021-08-26 15:34:48
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \st\src\store\index.js
 */
import { createStore, combineReducers } from 'redux'

import socket from './socket'
import win from './win'
import video from './video'

const reduxers = combineReducers({
    socket: socket,
    win: win,
    video: video
})

let store = createStore(reduxers);
// console.log(store)
//对其进行二次封装,将一些dispatch的操作拿出来

export default store