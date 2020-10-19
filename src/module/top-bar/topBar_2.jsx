// 新式的顶部控制栏，只分为左右两边的控制

import React,{Component} from 'react';
import './topBar.css';
// import closeSvg from './close.svg';
// import maxSvg from './max.svg';
// import minSvg from './min.svg';
// import fullSvg from './full.svg';
// import BarBtn from './BarBtn.jsx';


import winControl from '../ipc/winControl.js'

/**
 * 数据结构，
 */
let structure = [
    {
        id:3,
        state:0,//默认的状态
        stateNumber:1,//状态数量
        title:['最小化窗口'],//提示标题
        eventHandel:['minWindow'],
        className:'btn close'
    },
    {
        id:2,
        state:0,//默认的状态
        stateNumber:2,//状态数量
        title:['最大化窗口','恢复窗口'],//提示标题
        eventHandel:['fullWindow','normalWindow'],
        className:'btn close'
    },
    {
        id:1,
        state:0,//默认的状态
        stateNumber:1,//状态数量
        title:['关闭窗口'],//提示标题
        eventHandel:['closeWindow'],
        className:'btn close'
    },
]

class topBar extends Component{
    constructor(props,full){
        super(props);
        this.state = { fullFlag : full?true:false}
        this.handelClick = this.handelClick.bind( this );
    }
    /** 绑定点击事件 */
    handelClick(e,b)
    {
        /** 阻止默认点击事件 */
        e.preventDefault();
        /** 阻止元素被选中 */
        e.returnValue = false;
        /** 阻止冒泡事件捕获 */
        e.stopPropagation();
        if(this.props.cb){
            this.props.cb(b)
        }
    }
    /** 用于事件通信，绑定制定窗口执行相应操作
     */
    ipcEvent(ev){
        let win = this.props.win||'main';
        winControl(win,ev)
        
    }

    render(){
        return (
            <div className="topBar">
                <div className="control">
                    <div className="drag">
                        
                    </div>
                    <div className="btns">
                        {
                            structure.map((item)=>{
                                return <BarBtn key={item.id} props={item} cb={this.ipcEvent}></BarBtn>
                             })
                        }
                    </div>
                </div>
            </div>
        )
    }
}