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
    console.log(stateCopy)
    switch (action.type) {
        case types.CHANGE_HEX_MODEL:
            stateCopy.hex_model = !stateCopy.hex_model
            break;
        case types.CHANGE_REMOVE_SPACE:
            stateCopy.auto_remove_space = !stateCopy.auto_remove_space
            break;
        default:
            return stateCopy
            break;
    }
    return stateCopy
}