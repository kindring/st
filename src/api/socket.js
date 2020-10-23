import store from '../store/index';
let { ipcRenderer } = window.electron;

console.log(store)
    //创建socket服务等操作异步
let state = store.getState();
/** socket异步创建的事件id */
let eventId = 1;

function createUdpClient(remoteAddress, remotePort, localPort) {
    console.log(arguments)
        //使用ipc进行数据获取
    ipcRenderer.send('create-udp', {
        remoteAddress: remoteAddress,
        remotePort: remotePort,
        localPort: localPort,
        type: 'client',
        eventId: eventId
    });
    ipcRenderer.once('create-udp-replay-' + eventId, (arg, item) => {
        //获取回复
        console.log('创建回复')
        store.dispatch({
            type: 'SET_MAIN_SOCKET',
            id: item.id
        });
    })
}
//接收到udp的消息
ipcRenderer.on('udp-msg', function(msg) {
    console.log(msg)
})

// 发送数据
function mainSend(msg) {
    //将数据进行发送，自行获取主数据
    console.log(state);
    let index = store.getState().socket.main_socket;
    let sockets = store.getState().socket.sockets;
    let socket = sockets.find(item => {
        return item.id == index
    })
    console.log(index)
    ipcRenderer.send('udp-enum', {
        id: index,
        msg: msg
    })
    console.log('当前的主id数据')
}
export default {
    createUdpClient,
    mainSend
}