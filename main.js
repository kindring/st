/*
 * @Author: your name
 * @Date: 2021-08-25 16:38:01
 * @LastEditTime: 2021-08-26 16:38:07
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \st\main.js
 */
const electron = require('electron');
let { ipcMain } = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
// console.log(isDev)

let win = require('./js/test')
let ipc = require('./js/ipc')

let ipcRouter = require('./js/bridge')
let ffmpegServer = require('./js/ffmpeg/index')

let publicS = require('./publicS');
/**主窗口对象 */
let mainWindow;

// let win = require('./js/test')


function createWindow() {
    mainWindow = win({
        width: 900,
        resizable: false,
        webPreferences: {
            javascript: true,
            plugins: true,
            nodeIntegration: false, // 不集成 Nodejs
            webSecurity: false,
            preload: path.join(__dirname, './public/renderer.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
        },
    });
    console.log('---------');
    publicS.setMainWindow(mainWindow);
    ipc.windows['main'] = mainWindow;
    console.log(isDev ? 'http://127.0.0.1:3000' : `file://${path.join(__dirname, './build/index.html')}`);
    ipcMain.on('exitApp', (event, arg) => {
        mainWindow.close();
    });
    ipcMain.on('minApp', (event, arg) => {
        console.log('最小化窗口')
        mainWindow.minimize();
    });
    ipcMain.on('fullApp', (event, arg) => {
        mainWindow.maximize();
    });
    ipcMain.on('nomoreApp', (event, arg) => {
        mainWindow.unmaximize();
    });

    mainWindow.loadURL(isDev ? 'http://127.0.0.1:3000' : `file://${path.join(__dirname, './build/index.html')}`);
    mainWindow.openDevTools();

    console.log(isDev)
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

exports.mainWindow = mainWindow;