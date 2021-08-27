/*
 * @Author: kindring
 * @Date: 2021-08-26 13:51:55
 * @LastEditTime: 2021-08-27 09:54:28
 * @LastEditors: Please set LastEditors
 * @Description: 存放资源文件
 * @FilePath: \st\js\ffmpeg\videoController.js
 */
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
let _ffmpegCommand;

let videoSourceInfos = [];
function videoStream(id, startTime, res) {
    startTime = startTime?startTime:0;
    startTime = parseInt(startTime);
    let videoSourceInfo = videoSourceInfos[id]
    if(!videoSourceInfo){return res.status(404)}
    if(videoSourceInfo.checkResult.videoCodecSupport && videoSourceInfo.checkResult.audioCodecSupport){
        // 直接读取本地文件
        res.type('mp4')
        let frs = fs.createReadStream(videoSourceInfo.videoSourcePath)
        frs.on('data',(data)=>{
            res.write(data)
        })
        frs.on('end',(data)=>{
            res.end(data)
        })
        frs.on('error',(error)=>{
            console.log(error)
            res.send(error.message)
        })
        return 
    }
    // 视频解码播放
    let videoCodec = videoSourceInfo.checkResult.videoCodecSupport ? 'copy' : 'libx264';
    let audioCodec = videoSourceInfo.checkResult.audioCodecSupport ? 'copy' : 'aac';
    killFfmpegCommand();
    let _ffmpeg = ffmpeg()
    _ffmpegCommand = _ffmpeg.input(videoSourceInfo.videoSourcePath)
        .nativeFramerate()
        .videoCodec(videoCodec)
        .audioCodec(audioCodec)
        .format('mp4')
        .seekInput(startTime)
        .outputOptions(
            '-movflags', 'frag_keyframe+empty_moov+faststart',
            '-g', '18')
        .on('progress', function (progress) {
            console.log('time: ' + progress.timemark);
        })
        .on('error', function (err) {
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function () {
            console.log('Processing finished !');
        })
    let videoStream = _ffmpegCommand.pipe();
    res.type('.mp4')
    videoStream.pipe(res);
}


function killFfmpegCommand() {
    if (_ffmpegCommand) {
        _ffmpegCommand.kill();
    }
}

function setVideoSourceInfo(item){
    videoSourceInfos.push(item)
    return videoSourceInfos.length - 1
}


module.exports = {
    setVideoSourceInfo,
    killFfmpegCommand,
    videoStream
}