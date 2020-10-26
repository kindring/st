import store from '../store/index';
import tps from '../store/types.js';
let { ipcRenderer } = window.electron;
console.log(store)
    //创建socket服务等操作异步
let state = store.getState();
/** socket异步创建的事件id */
let eventId = 1;

// 创建客户端
function createUdpClient(remoteAddress, remotePort, localPort) {
    console.log(arguments)
    let eId = eventId;
    eventId++;
    //使用ipc进行数据获取
    ipcRenderer.send('create-udp', {
        remoteAddress: remoteAddress,
        remotePort: remotePort,
        localPort: localPort,
        type: 'client',
        eventId: eId
    });

    ipcRenderer.once('create-udp-replay-' + eId, (arg, item) => {
        //获取回复
        let eId = eventId;
        eventId++;
        if (item.state == 0) {
            //成功创建
            store.dispatch({
                type: tps.socket.set_main_socket,
                id: item.id
            });
            //往数组里面添加数据
            let obj = {
                id: item.id,
                type: 'udp',
                model: 'client',
                remoteAddress: remoteAddress,
                remotePort: remotePort,
                localPort: localPort,
                messages: [],
            }
            store.dispatch({
                type: tps.socket.add_socket,
                socket: obj,
            })
        } else {
            console.log('创建失败' + item.msg)
        }

    })
}
//创建服务的
function createUdpServe(localPort) {
    console.log(arguments)
    let eId = eventId;
    eventId++;
    ipcRenderer.send('create-udp', {
        remoteAddress: null,
        remotePort: null,
        localPort: localPort,
        type: 'client',
        eventId: eventId
    });

    ipcRenderer.once('create-udp-replay-' + eId, (arg, item) => {
        //获取回复
        console.log('创建回复')
        if (item.state == 0) {
            //成功创建
            store.dispatch({
                type: tps.socket.set_main_socket,
                id: item.id
            });
            //往数组里面添加数据
            let obj = {
                id: item.id,
                type: 'udp',
                model: 'server',
                remoteAddress: null,
                remotePort: null,
                localPort: localPort,
                messages: [],
            }
            store.dispatch({
                type: tps.socket.add_socket,
                socket: obj,
            })
        } else {
            console.log('创建失败' + item.msg)
        }

    })
}
/** 创建tcp客户端 */
function createTcpClient(remoteAddress, remotePort, localPort) {
    let eId = eventId;
    eventId++;
    ipcRenderer.send('create-tcp', {
        type: client,
        localPort: localPort,
        eventId: eId
    })
    ipcRenderer.on('create-tcp-replay', (event, arg) => {
        console.log('创建tcp回复')
        if (item.state == 0) {
            //成功创建
            store.dispatch({
                type: tps.socket.set_main_socket,
                id: item.id
            });
            //往数组里面添加数据
            let obj = {
                id: item.id,
                type: 'tcp',
                model: 'client',
                remoteAddress: null,
                remotePort: null,
                localPort: localPort,
                messages: [],
            }
            store.dispatch({
                type: tps.socket.add_socket,
                socket: obj,
            })
        } else {
            console.log('创建失败' + item.msg)
        }
    })
}
//接收到udp的消息
ipcRenderer.on('msg', function(event, item) {
    //根据id来确定数据
    store.dispatch({
        type: tps.socket.set_msg,
        obj: item
    })
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