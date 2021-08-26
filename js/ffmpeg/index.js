/*
 * @Author: kindring
 * @Date: 2021-08-26 10:42:20
 * @LastEditTime: 2021-08-26 17:55:30
 * @LastEditors: Please set LastEditors
 * @Description: 解码ffmpeg
 * @FilePath: \st\js\ffmpeg\index.js
 */
 const electron = require('electron')
 const { ipcMain } = electron;
 const {videoSupport} = require('./ffmpeg_halper')
const handel = require('../promiseHelper')
const {setVideoSourceInfo,killFfmpegCommand} = require('./videoController')
const publicS = require('../../publicS');
let isRendererReady = false;

// 创建http服务
const streamServer = require('../server/index')
// 主窗口进程
let mainWindow ;
setTimeout(()=>{
    mainWindow = publicS.getMainwindow()
},2000)
let baseUrl = 'http://localhost:5050/video/'

ipcMain.on('openSelect',()=>{
    console.log('openSelect');
    electron.dialog.showOpenDialog({
        properties: ['openFile'],
        // filters: [
        //     {name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'rmvb', 'flv', 'ogv','webm', '3gp', 'mov']},
        // ]
    }).then ((result) => {
        console.log(result);
        let canceled = result.canceled;
        let filePaths = result.filePaths;
        if (!canceled && mainWindow && filePaths.length > 0) {
            console.log('select file')
            createVideoStream(filePaths[0])
        }
    });
})
ipcMain.once("ipcRendererReady", (event, args) => {
    isRendererReady = true;
})
async function createVideoStream(videoPath){
    let [checkError,checkResult] = await handel(videoSupport(videoPath))
    console.log(checkResult);
    if(checkError){return ErrorLogHandel(checkError,'videoPathError检查视频路径错误')}
    console.log('pass ok')
    // 格式可以被web支持前端直接访问路径
    if(checkResult.videoCodecSupport && checkResult.audioCodecSupport){
        let playParams = {};
            playParams.type = "native";
            playParams.videoSource = videoPath;
        console.log('fileSelected')
        if (isRendererReady) {
            console.log("fileSelected=", playParams)
            mainWindow.webContents.send('fileSelected', playParams);
        } else {
        }
    }
    if(!checkResult.videoCodecSupport || !checkResult.audioCodecSupport){
        let id = setVideoSourceInfo({ videoSourcePath: videoPath, checkResult: checkResult })
        console.log("createVideoServer success")
        let playParams = new Object(null)
        playParams.type = "stream"
        playParams.videoSource = baseUrl+`${id}?startTime=0`
        playParams.duration = checkResult.duration
        if (isRendererReady) {
            console.log("fileSelected=", playParams)
            mainWindow.webContents.send('fileSelected', playParams)
        } else {
        }
    }
}

function ErrorLogHandel(err,descript){
    console.log(descript);
    console.error(err);
    console.log('\n\n');
}

module.exports = {
    createVideoStream
}