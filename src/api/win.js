/*
 * @Author: your name
 * @Date: 2021-08-25 16:38:01
 * @LastEditTime: 2021-08-26 14:58:20
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \st\src\api\win.js
 */
// 控制窗口的api
let { ipcRenderer } = window.electron;

function maxWin() {
    ipcRenderer.send('fullApp')
}

function minWin() {
    ipcRenderer.send('minApp')
}

function noWin() {
    ipcRenderer.send('nomoreApp')
}

function closeWin() {
    ipcRenderer.send('exitApp')
}

function openSelect(){
    ipcRenderer.send('openSelect')
}

export default {
    maxWin,
    minWin,
    closeWin,
    noWin,
    openSelect
}