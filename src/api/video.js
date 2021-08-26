/*
 * @Author: kindring
 * @Date: 2021-08-26 15:42:06
 * @LastEditTime: 2021-08-26 17:18:50
 * @LastEditors: Please set LastEditors
 * @Description: 编写video解码播放
 * @FilePath: \st\src\api\video.js
 */
import store from '../store/index';
import tys from '../store/types.js';
let { ipcRenderer } = window.electron;



function Ready() {
    ipcRenderer.send('ipcRendererReady')
    console.log('Ready')
    
}
ipcRenderer.on('fileSelected', (e, playParams) => {
    console.log('fileSelected')
    console.log(playParams);
    store.dispatch({
        type: tys.video.set_video_info,
        playParams: playParams
    });
})

function openSelect(){
    console.log('openSelect')
    ipcRenderer.send('openSelect')
}

export default {
    openSelect,
    Ready
};