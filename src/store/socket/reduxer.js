import types from './types'
let { ipcRenderer } = window.electron;
const defaultState = {
    auto_remove_space: false, //自动删除空格
    hex_model: false, //16发送
    main_socket: null, //当前主要活动的链接id
    sockets: [] //所有连接的数组
}

export default (state = defaultState, action) => {
    let stateCopy = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case types.CHANGE_HEX_MODEL:
            stateCopy.hex_model = !stateCopy.hex_model
            break;
        case types.CHANGE_REMOVE_SPACE:
            stateCopy.auto_remove_space = !stateCopy.auto_remove_space
            break;
        case types.set_main_socket:
            console.log(action)
            console.log(stateCopy)
            stateCopy.main_socket = action.id
            break;
        case types.add_socket:
            //设置sockets数组12
            stateCopy.sockets.push(action.socket)
            break;
        case types.set_msg:
            let socket = stateCopy.sockets.find(item => item.id == action.obj.id)
            if (socket) {
                socket.messages.push(
                    action.obj
                )
            }
            break;
        default:
            return stateCopy
            break;
    }
    return stateCopy
}