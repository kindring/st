import React,{Component} from 'react';
import './topBar.css';
import closeSvg from './close.svg';
import maxSvg from './max.svg';
import minSvg from './min.svg';
import fullSvg from './full.svg';
import BarBtn from './BarBtn.jsx';

import winControl from '../ipc/winControl.js'

/**
 * 数据结构，
 */
let structure = [
    {
        id:3,
        svgs:[minSvg],//svg列表   切换svg使用，用于单击选项
        state:0,//默认的状态
        stateNumber:1,//状态数量
        title:['最小化窗口'],//提示标题
        eventHandel:['minWindow'],
        className:'btn close'
    },
    {
        id:2,
        svgs:[fullSvg,maxSvg],//svg列表   切换svg使用，用于单击选项
        state:0,//默认的状态
        stateNumber:2,//状态数量
        title:['最大化窗口','恢复窗口'],//提示标题
        eventHandel:['fullWindow','normalWindow'],
        className:'btn close'
    },
    {
        id:1,
        svgs:[closeSvg],//svg列表   切换svg使用，用于单击选项
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
        /**全屏状态,默认为未全屏 */
        this.state = {  fullFlag :full?true:false  }
        this.handelClick = this.handleClick.bind( this );
    };
    handleClick(e,b){
        e.preventDefault();
        /**阻止元素被选中 */
        e.returnValue = false;
        if(this.props.cb){
            this.props.cb(b)
        }
    };
    /** 用于事件通信，绑定制定窗口执行相应操作
     * 
     */
    ipcEvent(ev){
        let win = this.props.win||'main';
        winControl(win,ev)
        
    }
    render(){
        return (
            <div className="topBar">
                <div className="drag"></div>
                <div className="content">
                    <div className="title">{this.props.wintitle}</div>
                    <div className="control">
                        {
                            structure.map((item)=>{
                               return <BarBtn key={item.id} props={item} cb={this.ipcEvent}></BarBtn>
                            })
                        }


                    </div>
                </div>
            </div>
        );
    }
    
}


export default topBar;