import React,{ useState } from 'react'
import {connect,useSelector,useDispatch } from 'react-redux'
import css from './tcpClientPage.css'

let obj = {
    type:'udp',
    module:'client',
    address:'',
    port:'',
    localport:'12345'
}
let sockets = []
ipcRenderer.on('udpClient-created',(event,id)=>{
    console.log('连接成功,可以发送消息了',id)
    sockets.push({
        id,
        type:'udp',
        model:'client'
    })

});
ipcRenderer.on('udpClient-msg',(event,arg)=>{
    console.log('接受到数据:'+arg)
})

function TcpClientPage(props){
    
    let state = useSelector(state=>state)
    let socket = state.socket;
    let dispatch = useDispatch()
    let map = {
        address:{
            save(str){
                obj.address = str;
            },
            check(str){
                let reg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g;
                console.log( reg.test(str))
                return !reg.test(str)
            }
        },
        port:{
            save(str){
                obj.port = str;
            },
            check(str){ 
                return str > 0 && str < 65536 
            }
        },
        localport:{
            save(str){
                obj.localport = str;
            },
            check(str){ 
                return str > 0 && str < 65536 
            }
        }
    }
    let msg = '默认字符串'
    // 改变数值的事件
    function changeStateHandel(e,name){
        e.preventDefault();
        let value = e.target.value;
        if(!map[name].check(value)){
            return console.log('不正确的数值')
        }
        //存储当前的state
        map[name].save(value)
    }
    // 点击事件绑定
    function handelClick(){
        console.log(obj)
        if(!obj.address||!obj.port||!obj.localport){
            return console.log('拒绝连接,需要详细的数据')
        }
        //尝试进行连接
        ipcRenderer.send('udpCreate',{
            remoteAddress:obj.address, 
            remotePort:obj.port, 
            localPort:obj.localport
        });

    }
    function sendMsg(){
        //检查是否有socket对象
        if(sockets.length < 0){
            return alert('请先创建连接')
        }
        
        //获取对象
        let idArr = sockets.forEach(item=>{ 
            console.log(item.id)
            ipcRenderer.send('udp-enum',{
                id:item.id,
                msg:msg
            });
        })
        
    }
    //修改模式
    function modelChangeHandel(e,model){
        switch (model) {
            case 'hex':
                dispatch({
                    type:'CHANGE_HEX_MODEL'
                })
                break;
            case 'space':
                dispatch({
                    type:'CHANGE_REMOVE_SPACE'
                })
                break;
            default:
                break;
        }
        
    }
    return (
        <div className="tc">
            <div className="config-box">
                <div className="connect">
                    <div className="row">
                        <div className="address-box i">
                            <input type="text" className="input" onBlur={(e)=>{changeStateHandel(e,'address')}}/>
                        </div>
                        <div className="port-box i">
                            <input type="text" className="input"  onBlur={(e)=>{changeStateHandel(e,'port')}}/>
                        </div>
                    </div>
                    <div className="row">
                        本地断开监听:<input type="text" className="input"  onBlur={(e)=>{changeStateHandel(e,'localport')}}/>
                    </div>
                    <div className="row row-btns">
                        <div className="con-btn state">
                            
                        </div>
                        <div className="con-btn connect-btn" onClick={handelClick}>连接</div>
                        <div className="con-btn close-btn">断开</div>
                    </div>
                        
                </div>
                <div className="quick-config">
                    <div className="nav">
                        <div className="tips-text">快捷配置</div>
                        <div className="control-btn">
                            <div className="add-quick-config btn">新增</div>
                            <div className="remove-quick-config btn">删除选中项</div>
                        </div>
                    </div>
                    <div className="quick-config-lists">
                        <div className="quick-config-item">
                            <div className="tips">
                                <div className="name">网关模块</div>
                                <div className="descript">
                                    <div className="address">
                                        <div className="config">
                                            192.168.1.35
                                        </div>
                                    </div>
                                    <div className="port">
                                        <div className="config">
                                            :35888
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="control">
                                <div className="edit-btn">编辑</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="msg-box">
                {/* 可以在此处进行创建文件夹,用来将一些指令进行分组 */}
                <div className="task">
                    <div className="nav">
                        <div className="tips-text">快捷任务列表</div>
                        <div className="control-btn">
                            <div className="add-btn btn">新增指令</div>
                            <div className="add-group-btn btn">新增分组</div>
                            <div className="dis-btn btn">禁用指令</div>
                            <div className="remove-btn btn">删除选中的指令或者分组</div>
                        </div>
                    </div>
                    <div className="msg-task-list">
                        {/* 用于存放需要依次发送的任务列表,比如需要进行延时发送时的操作 */}
                        <div className="task-item">
                            <div className="state">
                                是否参加任务 参加/不参加
                            </div>
                            <div className="lay-time">
                                等待时间 1000ms
                                {/* 执行当前任务时的延迟开始时间 */}
                            </div>
                            {/* <div className="type">
                                联合指令 单独指令
                            </div> */}
                            <div className="task-name">
                                顺序调用指令
                            </div>
                            <div className="run-model">
                                <div className="model time-model">
                                    任务执行模式,执行当前任务组时强行等待内部任务进行执行,
                                    在内部任务全部执行完毕之后在进行下一个任务
                                </div>
                            </div>
                            <div className="control">
                                <div className="bg-color"></div>
                                <div className="more-task-btn"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bridge">
                    <div className="response">
                        <div className="line"></div>
                    </div>
                    <div className="request">
                        <textarea name="request" id="" cols="30" rows="10" className="request-input" onBlur={e=>{msg = e.target.value}}></textarea>
                    </div>
                    <div className="control">
                        <div 
                            className="btn hex-btn"
                            onClick={(e)=>{
                                modelChangeHandel(e,'hex')
                            }}
                        >
                            16进制模式
                            {
                                // state.socket.hex_model?'开启':'关闭'
                            }
                        </div>
                        <div
                            className="btn auto-remove-space"
                            onClick={(e)=>{
                                modelChangeHandel(e,'space')
                            }}
                        >
                            自动删除空格
                        {
                                socket.auto_remove_space?'开启':'关闭'
                            
                            }
                        </div>
                        <div className="btn send-btn" onClick={sendMsg}>发送</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TcpClientPage