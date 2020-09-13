// 用来导入协调两个窗口

import React,{ Component } from "react";
import './window.css'

//侧边栏处的设置
import sideBarSetting from '../../router/sideBarSetting'
import HomePage from '../shows/home.jsx'

/**所有的btn列表，用来一次性渲染 */
let sidebarBtn = sideBarSetting.btns;
//绑定函数方法,点击事件?

/** 此模块设置为两个大的板块,为侧边条控制板块和对应的窗口模块 */
class window extends Component{
    constructor(props){
        super(props);
        this.state={
            //窗口状态
            small:true
        }
    }
    render(){
        return (
            <div className="window">

                <div className="sidebar ">
                    <ul className="ul scorllbar">
                        {
                            sidebarBtn.map((item)=>{
                               return <li className="iconBtn" title={item.title} key={item.id}>
                                   <img src={item.svg} alt="" className="svg"/>
                               </li>
                            })
                        }
                    </ul>
                </div>

                <div className="content">
                    <HomePage></HomePage>
                </div>
                
            </div>
        )
    }
}


export default window;