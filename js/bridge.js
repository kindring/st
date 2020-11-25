let { ipcMain } = require('electron')

let ipcRouter = require('../ipcRouter/index')
    // 数据导航


ipcMain.on('create-socket', (event, arg) => {
        console.log('88888888888888888888')
        ipcRouter.createSocket(event, arg)
    })
    // module.exports = ipcMain;