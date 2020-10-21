const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
// console.log(isDev)

let win = require('./js/test')
let ipc = require('./js/ipc')
let ipcRouter = require('./bridge')

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
    ipc.windows['main'] = mainWindow;
    console.log(isDev ? 'http://127.0.0.1:3000' : `file://${path.join(__dirname, './build/index.html')}`);

    // mainWindow.loadFile(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './build/index.html')}`)
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



// mainWindow = win({
//   width: 800,
//   height: 600,
//   backgroundColor:'#00FFFFFF',
//   frame:false,
//   // autoHideMenuBar:true,
//   // transparent:true
//   openDevTools: true,
//   nodeIntegration:false,
//   preload: path.join(__dirname, './public/renderer.js')
// },{
//   mod:'loadURL',
//   path:isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './build/index.html')}`
// });