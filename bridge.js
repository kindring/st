let { ipcMain } = require('electron')

let ipcRouter = require('./ipcRouter/index')
    // 数据导航
ipcMain.on('create-udp', (event, arg) => {
    console.log('tag', '')
    ipcRouter.createUdpClient(event, arg.remoteAddress, arg.remotePort, arg.localPort, arg.eventId)
})
console.log(ipcRouter.udpSend)
ipcMain.on('udp-enum', ipcRouter.udpSend)

// module.exports = ipcMain;