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
    console.log('--- 尝试创建数据 ---')
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
        console.log(item)
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
        type: 'server',
        eventId: eId
    });
    console.log(eId)
    ipcRenderer.once('create-udp-replay-' + eId, (arg, item) => {
        //获取回复
        console.log('创建udp回复')
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
        type: 'client',
        localPort: localPort,
        remoteAddress: remoteAddress,
        remotePort: remotePort,
        eventId: eId
    })
    ipcRenderer.on('create-tcp-reply', (event, item) => {
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
/** 创建tcp服务端 */
function createTcpServer(localPort) {
    let eId = eventId;
    eventId++;
    ipcRenderer.send('create-tcp', {
        type: 'server',
        localPort: localPort,
        eventId: eId
    })
    ipcRenderer.on('create-tcp-reply', (event, item) => {
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
//接收到主进的socket消息
ipcRenderer.on('msg', function(event, item) {
    //根据id来确定数据
    console.log(item)
        // store.dispatch({
        //     type: tps.socket.set_msg,
        //     obj: item
        // })
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
    console.log(`id为${index}的socket对象发送消息:${msg}`)
    console.log(sockets)
    ipcRenderer.send('udp-enum', {
        id: index,
        msg: msg
    })
}
export default {
    createUdpServe,
    createUdpClient,
    createTcpServer,
    createTcpClient,
    mainSend
}