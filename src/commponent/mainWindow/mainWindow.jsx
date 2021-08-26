import React,{useState} from 'react'
import mainWindowCss from './mainWindow.css'
import LeftBar from '../leftBar'
import TC from '../tcpClientPage'
import store from '../../store/index.js'
import Calculator from '../page/calculator';

import Video from '../page/VideoPlay/VideoPlay';
// console.log(store.getState())
// console.log(electron)



function MainWindow(){
    let [page,setPage] = useState(2);
    let arr = [
        {
            id:1,
            name:'socket工具',
            cb(){
                setPage(1)
            }
        },
        {
            id:2,
            name:'新网关计算器',
            cb(){
                setPage(2)
            }
        },
        {
            id:3,
            name:'测试ffmpeg',
            cb(){
                setPage(3)
            }
        }
    ]
    let renderComponent =()=>{
        switch (page) {
          case 1: return <TC/>
          case 2: return <Calculator/>
          case 3: return <Video/>
          default: return <TC/>
        }
    }
    return (
        <div className="mainWindow">
            <div className="sideBar">
                <LeftBar arr={arr}/>
            </div>
            <div className="content">
                {/* <TC/> */}
                {
                    renderComponent()
                }
            </div>
        </div>
    )
}

export default MainWindow