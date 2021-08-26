/*
 * @Author: your name
 * @Date: 2021-08-26 13:48:49
 * @LastEditTime: 2021-08-26 17:58:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \st\js\server\index.js
 */

const express = require('express')
let {videoStream} = require('../ffmpeg/videoController')

let app = express();

app.get('/video/:id',(req,res)=>{
    videoStream(req.params.id,req.startTime,res)
})
app.use((req,res)=>{
    res.send('ok')
})

app.listen(5050,()=>{
    console.log('videoServer is running')
})