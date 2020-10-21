let { ipcMain } = require('electron')

let ipcRouter = require('./ipcRouter/index')
    // 数据导航
ipcMain.on('udpCreate', (event, arg) => {
    ipcRouter.createUdpClient(event, arg.remoteAddress, arg.remotePort, arg.localPort)
})
console.log(ipcRouter.udpSend)
ipcMain.on('udp-enum', ipcRouter.udpSend)

// module.exports = ipcMain;