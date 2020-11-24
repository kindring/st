let net = require('net')
let dgram = require('dgram');
const { ipcMain } = require('electron');
const { mainWindow } = require('../main');
let sockets = []; //udp客户端
let socketsTotal = 0;
/** 创建udp服务，我自定义的对象
 * @param {*} remoteAddress 
 * @param {*} remotePort 
 * @param {*} localPort 
 */
function createUdp(type = 'client', remoteAddress, remotePort, localPort) {
    let udp = dgram.createSocket('udp4');
    let id = socketsTotal + 1;
    // console.log(arguments)
    let udpObject = {
        id,
        type: 'udp',
        model: type,
        remoteAddress,
        remotePort,
        localPort,
        socket: udp,
        state: 0, //状态
        connects: [] //通信过的客户端
    }
    sockets.push(udpObject)
    socketsTotal++;
    return udpObject;
}

/** 创建udp服务,客户端和服务端 */
function createUdpClient(event, remoteAddress, remotePort, localPort, type, eventId) {
    //创建一个连接,存储在socket里面存储
    // console.log(arguments)
    let obj = createUdp(type, remoteAddress, remotePort, localPort);
    console.log(obj)
    let socket = obj.socket
    console.log(type)
    if (type == 'server') {
        socket.bind(localPort);
    } else {
        if (localPort) {
            socket.bind(localPort)
        }
    }
    console.log(obj)
    console.log(obj.id)
    console.log(eventId)
    event.reply('create-udp-reply-' + eventId, {
        state: 0,
        id: obj.id,
        msg: '成功'
    });
    socket.on('message', (msg, rinfo) => {
        if (type == 'server') {
            console.log('服务端的连接')
                //查看当前对象是否存在于连接对象中
            let item = obj.connects.find(item => {
                item.address == rinfo.address && item.port == rinfo.port
            })
            if (item) {
                //当前对象存在于连接对象中,不处理
            } else {
                let data = {
                        id: obj.connects.length == 0 ? 1 : obj.connects.length,
                        address: rinfo.address,
                        port: rinfo.port
                    }
                    //当前连接对象不存在此客户端,处理
                obj.connects.push(data)
                    //对象连接上来了,所以需要对其进行数据发送
                event.reply('connect', {

                })
            }
        }
        let msgObject = {
            socketId: obj.id, //对象
            rinfo, //发送消息者的基本信息
            hex: msg.toString('hex'), //16进制解码
            msg: msg.toString(), //消息

        }
        event.reply('msg', msgObject)

    });

}

function createTcpClient(event, arg) {
    let tcp = net.Socket();
    console.log('尝试开启tcp客户端连接');
    tcp.connect(arg.remotePort, arg.remoteAddress, function() {
        //成功连接到服务端，可以开始进行通信了
        let id = socketsTotal + 1;
        socketsTotal++;
        let tcpObject = {
            id,
            type: 'tcp',
            model: 'client',
            remotePort: arg.remotePort,
            remoteAddress: arg.remoteAddress,
            socket: tcp,
            state: 1, //套接字状态， 0 未连接 1 连接  2 错误
            connects: []
        }
        console.log('创建成功');
        event.reply('create-tcp-reply-' + arg.eventId, {
            state: 0,
            id: tcpObject.id,
            msg: '成功'
        })
    })
    tcp.on('error', (err) => {
        tcpObject.state = 2;
        event.reply('create-tcp-reply-' + arg.eventId, {
            state: 2,
            id: null,
            msg: err.message
        })
    })


}

function createTcpServer(event, arg) {
    const id = socketsTotal + 1;
    let tcp = net.createServer(function(socket) {
        //接受到客户端的连接
        // 存储连接对象
        let soc = sockets.find(item => item.id == id)
        console.log(socket)
        const connectId = soc.connects.length + 1
        if (soc) {
            soc.connects.push({
                    id: connectId,
                    socket: socket,
                    state: 1, //0 未连接 1已经连接 2彻底断开连接
                    dataState: 0, //传输数据中 0false 1true
                })
                // 接听socket的数据
        }
        //开始接收信息
        socket.on('close', () => {
                //从数组中移除某个值
                soc = null;
                soc.connects = soc.connects.filter(item => item.id !== connectId)
            })
            // let data = [];
        socket.on('data', (data) => {
            let msgObject = {
                socketId: id, //对象
                //发送消息者的基本信息
                hex: data.toString('hex'), //16进制解码
                msg: data.toString(), //消息
            }
            event.reply('msg', msgObject)
        })
    });
    tcp.listen(arg.localPort, () => {
        socketsTotal++;
        //创建成功
        let tcpObject = {
            id,
            type: 'tcp',
            model: 'server',
            remoteAddress: null,
            remotePort: null,
            socket: tcp,
            connects: []
        }
        sockets.push(tcpObject);
        event.reply('create-tcp-replay-' + arg.eId, {
            state: 0,
            id: tcpObject.id,
            msg: 'ok'
        })
    })
}

function send(event, arg) {
    let id = arg.id,
        msg = arg.msg;
    let arr = sockets.find(item => item.id == id);
    console.log(arr)
    if (!arr) {
        console.log('未能找到socket对象')
    }
    //查看是什么样的socket对象,好找对应的方法去发送数据
    if (arr.type == 'udp') {
        if (arr.model == 'client') {
            arr.socket.send(msg, arr.remotePort, arr.remoteAddress, (err, bytes) => {
                if (err) throw err;
            })
        } else {
            //查看是否有指定客户端id,如果没有则进行瞎发送
            if (arg.clientId) {
                let clientData = arr.connects.find(item => item.id == arg.clientId);
                arr.socket.send(msg, clientData.port, clientData.address, (err, bytes) => {
                    if (err) throw err;
                })
            } else {
                arr.connects.forEach(item => {
                    arr.socket.send(msg, item.port, item.address, (err, bytes) => {
                        if (err) throw err;
                    })
                });
            }
        }
    } else {
        if (arr.model == 'client') {

        } else {

        }
    }


}

function createTcp(event, arg) {
    if (arg.type == 'server') {
        createTcpServer(event, arg)
    } else {
        createTcpClient(event, arg)
    }
}


//主动发消息给渲染进程.目前只设置为一个前端进程,所以为
function sendRender(event, arg) {
    mainWindow.webContents.send(event, arg)
}

/**
 * 创建socket服务的接口
 * @param {*} event 事件句柄,创建成功后将会event.reply函数进行相关的回复
 * @param {*} arg 
 */
function createSocket(event, arg) {
    let defaultOpt = {
        protocol: 'tcp', //连接协议
        model: 'server', //连接模式
        remoteAddress: '', //服务端地址
        remotePort: '', //服务端端口
        localPort: '', //本地端口
        sid: null, //socket的唯一标识,由前端生成
    }
    let finalOpt = {...defaultOpt, ...arg };
    //判断是否有sid,如果没有sid则不管他
    if (finalOpt.sid == null) {
        console.error('没有获取到sid');
        console.log(finalOpt);
        console.log('----上面是设置默认值之后的参数---');
        return false;
    }
    //尝试连接
    switch (finalOpt.protocol) {
        case 'tcp':
            createTcp();
            break;
        case 'udp':
            createUdp();
            break;
        default:
            console.error('未知的协议类型,暂时不支持此类型');
    }
}

exports.createUdp = createUdpClient;
exports.createTcp = createTcp;
exports.udpSend = send;