// 用来导入协调两个窗口

import React,{ Component } from "react";



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
            <div className="Window">
                <div className="sidebar">
                    {this.state.small}
                </div>
                <div className="content"></div>
            </div>
        )
    }
}


export default window;