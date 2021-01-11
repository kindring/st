import React,{ useState ,useRef} from 'react'
import {connect,useSelector,useDispatch } from 'react-redux'
import css from './tcpClientPage.css'
import api from '../api/index'
import SwitchBtn from './btnBox/switchBtn'
let obj = {
    type:'udp',
    module:'client',
    address:'',
    port:'',
    localport:'12345'
}
let sockets = []


function TcpClientPage(props){
    /** redux仓库的对象 */
    let state = useSelector(state=>state)
    let socket = state.socket;
    let dispatch = useDispatch();
    console.log(socket.nowSocketData);
    /** ref对象 */
    let protocolRef = useRef(null);
    let modelRef = useRef(null);
    let data = {...socket.nowSocketData};
    let [protocol,setProtocol] = useState(socket.nowSocketData.protocol);
    let [model,setModel] = useState(socket.nowSocketData.model);
    let [remoteAddress,setRemoteAddress] = useState(socket.nowSocketData.remoteAddress);
    let [remotePort,setRemotePort] = useState(socket.nowSocketData.remotePort);
    let [localPort,setLocalPort] = useState(socket.nowSocketData.localPort);
    console.log(data);
    /** 用来操作本地数据,save方法用来存储 */
    let map = {
        remoteAddress:{
            save(str){
                setRemoteAddress(str);
            },
            check(str){
                let reg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g;
                console.log( reg.test(str))
                return !reg.test(str)
            }
        },
        remotePort:{
            save(str){
                setRemotePort(str);
                dispatch({
                    type: 'SAVE_NOW_DATA',
                    data:{
                            protocol, //连接协议
                            model, //连接模式
                            remoteAddress, //服务端地址
                            remotePort, //服务端端口
                            localPort
                        }
                    }
                );
            },
            check(str){ 
                return str > 0 && str < 65536 
            }
        },
        localport:{
            save(str){
                setLocalPort(str);
                dispatch({
                    type: 'SAVE_NOW_DATA',
                    data:{
                            protocol, //连接协议
                            model, //连接模式
                            remoteAddress, //服务端地址
                            remotePort, //服务端端口
                            localPort
                        }
                    }
                );
            },
            check(str){ 
                return str > 0 && str < 65536 
            }
        },
        protocol:{
            save(value){
                setProtocol(value);
                dispatch({
                    type: 'SAVE_NOW_DATA',
                    data:{
                            protocol, //连接协议
                            model, //连接模式
                            remoteAddress, //服务端地址
                            remotePort, //服务端端口
                            localPort
                        }
                    }
                );
            }
        },
        model:{
            save(value){
                setModel(value);
                dispatch({
                    type: 'SAVE_NOW_DATA',
                    data:{
                            protocol, //连接协议
                            model, //连接模式
                            remoteAddress, //服务端地址
                            remotePort, //服务端端口
                            localPort
                        }
                    }
                );
            }
        }
    }
    console.log('abc');
    /** 数据对象 */
    let [msg,setMsg] = useState('默认字符串');
    
    /** 尝试创建新连接 */
    function tryConnect(){
        //查看选择的协议和模式那些
        // 直接调用api来尝试连接
        api.socket.tryConnect({...data});
    }
    
    return (
        <div className="tc">
            <div className="config-box">
                <div className="connect">
                    <div className="row">
                        <div className="check" >
                            <span onClick={protocolClickHandel}>连接协议</span>
                            <SwitchBtn 
                                ref={protocolRef} 
                                value1="tcp" 
                                value2="udp" 
                                OnChange={value=>checkChnageHandel('protocol',value)}
                            />
                        </div>
                        <div className="check">
                            <span onClick={modelClickHandel}>运行模式</span>
                            <SwitchBtn 
                            ref={modelRef} 
                            value1="server" 
                            value2="client" 
                            OnChange={value=>checkChnageHandel('model',value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="address-box i">
                            <input 
                            type="text" 
                            className="input" 
                            placeholder="远程主机的ip地址" 
                            value={remoteAddress}
                            onChange={(e)=>{changeStateHandel(e,'remoteAddress')}}
                            onBlur={(e)=>{changeStateHandel(e,'localport')}} 
                            />
                        </div>
                        <div className="port-box i">
                            <input 
                            type="text" 
                            className="input"
                            placeholder="端口号" 
                            value={remotePort}
                            onChange={(e)=>{changeStateHandel(e,'remotePort')}}
                            onBlur={(e)=>{changeStateHandel(e,'localport')}} 
                            />
                        </div>
                    </div>
                    <div className="row">
                        本地端口监听:
                        <input 
                        type="text" 
                        className="input"  
                        value={localPort}
                        onChange={(e)=>{changeStateHandel(e,'localport')}} 
                        onBlur={(e)=>{changeStateHandel(e,'localport')}} 
                        />
                    </div>
                    <div className="row row-btns">
                        <div className="con-btn state">
                            
                        </div>
                        <div 
                        className="con-btn connect-btn" 
                        onClick={tryConnect}
                        >
                            连接
                        </div>
                        <div 
                        className="con-btn close-btn"
                        >
                            断开
                        </div>
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
                        {/* 当前连接对象的基本信息 */}
                        <div className="information">
                            <div className="chunk">
                                本机ip端口  192.168.1.128:60000
                            </div>
                            <div className="chunk">
                                <span>连接的客户端信息</span>
                                <div className="connects">
                                    <div className="connect">
                                        <div className="ip">127.0.0.1</div>
                                        <div className="address">3555</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <textarea name="request" id="" cols="30" rows="10" className="request-input" onBlur={e=>{ setMsg(e.target.value)}}></textarea>
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
    function protocolClickHandel(){
        if(protocolRef.current.click){
            protocolRef.current.click()
        }
    }
    function modelClickHandel(){
        if(modelRef.current.click){
            modelRef.current.click();
        }
    }
    /** 保存连接协议模式数据 */
    function checkChnageHandel(item,value){
        map[item].save(value);
        dispatch({
            type: 'SAVE_NOW_DATA',
            data:{
                    protocol, //连接协议
                    model, //连接模式
                    remoteAddress, //服务端地址
                    remotePort, //服务端端口
                    localPort
                }
            }
        );
    }
    /** 用来监听数值修改事件,并且自动保存数据 */
    function changeStateHandel(e,name){
        e.preventDefault();
        let value = e.target.value;
        if(!map[name].check(value)){
            return console.log('不正确的数值')
        }
        console.log('----------');
        console.log(value);
        //存储当前的state
        map[name].save(value);
        //延迟修改数据
        dispatch({
            type: 'SAVE_NOW_DATA',
            data:{
                    protocol, //连接协议
                    model, //连接模式
                    remoteAddress, //服务端地址
                    remotePort, //服务端端口
                    localPort
                }
            }
        );
    }   
    /** 修改数据发送模式 16进制和空格模式 */
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
    /** 用于发送数据 */
    function sendMsg(){
        //检查是否有socket对象
        if(sockets.length < 0){
            return alert('请先创建连接')
        }
        //获取对象
        api.socket.send(msg);
        
    }
}

export default TcpClientPage