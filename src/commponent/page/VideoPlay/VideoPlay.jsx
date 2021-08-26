import React,{ useState ,useRef} from 'react'
import {connect,useSelector,useDispatch } from 'react-redux'
import api from '../../../api/index'


function VideoPlay(props){
    api.video.Ready()
    
    
    let state = useSelector(state=>state)
    let video = state.video;
    console.log('初始化')
    console.log(state)
    console.log(state.video)
    // let [video_info] = useState(video.video_info);
    let type = video.video_info.type;
    let duration =video.video_info.duration;
    let videoSource = video.video_info.videoSource;
    const refVideo = useRef(null);
    if(videoSource){
        refVideo.current.play()
    }
    return (
        <div className="tc">
            <div className="btn" onClick={selectFile}>
                选择文件22
            </div>
            <br />
            类型:{type} 影片时间:{duration}
            <video width="600" ref={refVideo}>
                <source src={videoSource}></source>
            </video>
        </div>
    )
    function selectFile(){
        console.log('123')
        api.video.openSelect()
    }
}


export default VideoPlay