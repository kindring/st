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

export default {
    maxWin,
    minWin,
    closeWin,
    noWin
}