let { ipcMain } = require('electron')

let ipcRouter = require('../ipcRouter/index')
    // 数据导航
ipcMain.on('create-udp', (event, arg) => {
    ipcRouter.createUdp(event, arg.remoteAddress, arg.remotePort, arg.localPort, arg.type, arg.eventId)
})
console.log(ipcRouter.udpSend)
ipcMain.on('udp-enum', ipcRouter.udpSend)
ipcMain.on('create-tcp', (event, arg) => {
    ipcRouter.createTcp(event, arg)
})


// module.exports = ipcMain;