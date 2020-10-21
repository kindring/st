import React from 'react'
import mainWindowCss from './mainWindow.css'
import LeftBar from '../leftBar'
import TC from '../tcpClientPage'
import store from '../../store/index.js'

console.log(store.getState())
// console.log(electron)
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
            <div className="content">
                <TC/>
            </div>
        </div>
    )
}

export default mainWindow