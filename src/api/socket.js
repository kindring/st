import store from '../store/index';
import tps from '../store/types.js';
let { ipcRenderer } = window.electron;
console.log('-----')
console.log(store.getState());

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
function createTcpClient(sid, opt) {
    let defaultOpt = {
        protocol: 'tcp', //连接协议
        model: 'server', //连接模式
        remoteAddress: '', //服务端地址
        remotePort: '', //服务端端口
        localPort: '', //本地端口
        sid: null, //只有这几个数据
    }
    let finalOpt = {...defaultOpt, ...opt, sid };
    ipcRenderer.send('create-socket', finalOpt);

    // 回复监听,即创建连接成功的监听数据
    handelCreated(finalOpt, function(event, arg) {
        console.log('成功创建了tcp客户端的连接');
    });
}
/** 创建tcp服务端 */
function createTcpServer(sid, opt) {
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

/**
 * 生成一个sid,根据store里面的
 */
function createSid() {
    let socket = store.getState().socket;
    let n = socket.sockets.length;
    return n;
}

/**
 * 保存socket连接信息
 * @param {*} options 
 */
function saveSocket(options) {
    // 默认配置
    let defaultOption = {
        protocol: 'tcp', //连接协议
        model: 'server', //连接模式
        remoteAddress: '', //服务端地址
        remotePort: '', //服务端端口
        localPort: '', //本地端口
        state: '0', //连接状态,  0->已经本地创建,但是没有远程创建连接  1->已经远程创建  2->暂定
        sid: null, //与后端通信用的id,由前端生成,后端创建连接时以此为根据来生成id
        history: [], // 历史消息数组,用来存储对话信息,比如发送的信息,以及收到的消息 本地化存储 obj
    };
    //生成 s_id 
    let sid = createSid();
    // 生成用来保存的数据
    let finalOption = {...defaultOption, ...options, sid };
    // 保存数据到本地
    store.dispatch({
        type: tps.socket.saveSocket,
        socket: finalOption
    });
    return sid;
}

/**
 * 创建socket服务成功的处理函数
 * @param {*} opt 
 * @param {*} cb 
 */
function handelCreated(opt, cb) {
    // 自动注册一次接受响应事件,默认当成完成
    ipcRenderer.on('create-socket-reply-' + opt.sid, (event, arg) => {
        cb(event, arg);
    });
}


/**
 * 尝试创建socket连接
 * @param {*} data 
 */
function tryConnect(data) {
    //先看创建什么服务,然后看连接类型
    let defaultOpt = {
        protocol: 'tcp', //连接协议
        model: 'server', //连接模式
        remoteAddress: '', //服务端地址
        remotePort: '', //服务端端口
        localPort: '', //本地端口
        sid: null, //socket的唯一标识,由前端生成
    }
    let finalOpt = {...defaultOpt, ...data };
    ipcRenderer.send('create-socket', finalOpt);
    //创建id 前端存储数据.
    let sid = saveSocket(finalOpt);

    //发送创建数据的操作
    ipcRenderer.send('create-socket', {...finalOpt, sid });

    // 回复监听,即创建连接成功的监听数据
    handelCreated({...finalOpt, sid }, function(event, arg) {
        console.log(`成功创建了${finalOpt.protocol} ${finalOpt.model}`);
    });
}

export default {
    mainSend,
    tryConnect,
}