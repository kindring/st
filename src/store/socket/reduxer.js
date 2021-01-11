import types from './types'
let { ipcRenderer } = window.electron;
const defaultState = {
    auto_remove_space: false, //自动删除空格
    hex_model: false, //16发送
    main_sid: null, //主要的连接id
    sockets: [], //所有连接的数组
    nowSocketData: {
        protocol: 'tcp', //连接协议
        model: 'server', //连接模式
        remoteAddress: '', //服务端地址
        remotePort: '', //服务端端口
        localPort: '', //本地端口
    }, //当前的连接信息
}

export default (state = defaultState, action) => {
    let stateCopy = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case types.CHANGE_HEX_MODEL: //修改发送模式 16进制模式和非16进制模式
            stateCopy.hex_model = !stateCopy.hex_model
            break;
        case types.CHANGE_REMOVE_SPACE: //修改自动移除空格模式
            stateCopy.auto_remove_space = !stateCopy.auto_remove_space
            break;
        case types.set_main_socket: //设置主要的通信连接数据
            console.log('设置')
            console.log(action)
            console.log(stateCopy)
            stateCopy.main_sid = action.sid
            break;
        case types.save_socket: // 添加socket的数据
            stateCopy.sockets.push(action.socket)
            break;
        case types.set_msg: //设置某个socket连接的数据
            let socket = stateCopy.sockets.find(item => item.sid == action.obj.sid)
            if (socket) {
                socket.messages.push(
                    action.obj
                )
            }
            break;
        case types.save_now_datas: //修改当前存储的数据
            stateCopy.nowSocketData = action.data;
            break;
        default:
            return stateCopy
            break;
    }
    return stateCopy
}