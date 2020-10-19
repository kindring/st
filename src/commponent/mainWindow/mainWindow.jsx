import React from 'react'
import mainWindowCss from './mainWindow.css'
import LeftBar from '../leftBar'



let arr = [
    {
        id:1,
        name:'TcpServer',
    },
    {
        id:2,
        name:'TcpClient'
    },
    {
        id:3,
        name:'UdpServer'
    },
    {
        id:4,
        name:'UdpClient'
    },
]
function mainWindow(){
    return (
        <div className="mainWindow">
            <div className="sideBar">
                <LeftBar arr={arr}/>
            </div>
            <div className="content"></div>
        </div>
    )
}

export default mainWindow