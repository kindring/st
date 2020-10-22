import types from './types'
const defaultState = {
    auto_remove_space: false, //自动删除空格
    hex_model: false, //16发送
    main_socket: null //当前主要活动的链接
}

export default (state = defaultState, action) => {

    switch (action.type) {
        case types.CHANGE_HEX_MODEL:
            state.hex_model = !state.hex_model
            break;
        case types.CHANGE_REMOVE_SPACE:
            state.auto_remove_space = !state.auto_remove_space
            break;
        default:
            break;
    }
    return state
}