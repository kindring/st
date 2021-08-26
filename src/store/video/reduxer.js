/*
 * @Author: your name
 * @Date: 2021-08-26 15:30:19
 * @LastEditTime: 2021-08-26 17:42:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \st\src\store\video\reduxer.js
 */
import types from './types'
import deepClone from '../deepClone'
let { ipcRenderer } = window.electron;
const defaultState = {
    video_info: {
        type: 'stream',
        videoSource: '',
        duration: '0'
    }, // 视频信息
}

export default (state = defaultState, action) => {
    let stateCopy = deepClone(state);
    switch (action.type) {
        case types.set_video_info: //存储video数据
            console.log(stateCopy.video_info)
             stateCopy.video_info = action.playParams
            break;
        default:
            return stateCopy
            break;
    }
    return stateCopy
}