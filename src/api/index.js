/*
 * @Author: your name
 * @Date: 2021-08-25 16:38:01
 * @LastEditTime: 2021-08-26 16:10:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \st\src\api\index.js
 */
// 将dispatch 封装起来
import socket from './socket'
import win from './win'
import video from './video'

export default {
    socket,
    win,
    video
}