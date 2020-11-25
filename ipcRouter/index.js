let net = require('net')
let dgram = require('dgram');
const { ipcMain } = require('electron');
const publicS = require('../publicS');
let sockets = []; //udp客户端
let socketsTotal = 0;



/**
 * socket连接的列表
 */
let socketList = []; //socket连接列表

/**
 * 尝试保存socket数据
 * @param {Object} arg 参数
 * @param {Number} arg.sid id
 * @param {'tcp'|'udp'} arg.protocol 连接协议
 * @param {'server'|'client'} arg.model 连接模式
 * @param {Number} [arg.localPort] 本地端口
 * @param {String} [arg.remoteAddress] 远程地址
 * @param {String} [arg.remotePort] 本机地址
 * @param {Array} [arg.connects] 连接的socket数组
 * @param {'0','1','2'} state=0 连接状态 未连接,已连接,连接错误
 * @return {Object} 初始化后的本地数据
 */
function saveSocket(arg) {
    let defaultSocket = {
        sid: 1, //id,唯一
        protocol: 'tcp', //协议 tcp or udp
        model: 'server', //模式
        localPort: 3080, //本地监听的端口  可以为空
        remoteAddress: null, //远程的地址,只用来记录数据
        remotePort: null, //
        connects: [], //连接过的socket数组
        state: 0, //未连接状态,
        cid: 0, //连接的客户端id
    };
    /**
     * 最终的socket对象
     */
    let finalSocket = {...defaultSocket, ...arg };
    socketList.push(finalSocket);
    return finalSocket;
}

/**
 * 新增socket连接的客户端
 * @param {*} sid 
 * @param {*} connectObj 
 * @return {Number} cid 当前连接在客户端中的socketid 
 */
function addSocketConnect(sid, connectObj) {
    let soc = socketList.find(item => item.sid == sid);
    /**
     * 连接的客户端id
     */
    let c_id = soc.cid + 1;
    soc.cid = c_id + 1;
    soc.push({
        ...connectObj,
        c_id,
        history: []
    });
    return c_id;
}

/**
 * 存储socket连接发过来的信息
 * @param {*} sid 
 * @param {*} cid 
 * @param {*} msg 
 */
function saveSocketConnectMsg(sid, cid, msg) {
    //找到soc
    let soc = socketList.find(item => item.sid == sid);
    let c = soc.connect.find(item => item.cid == cid);
    c.history.push(msg);
}
/**
 * 设置socket连接状态
 * @param {*} sid 
 * @param {*} state 
 */
function setSocketState(sid, state) {
    let soc = socketList.find(item => item.sid == sid);
    soc.state = state;
}

/**移除指定连接*/
function removeSocketConnet(sid, cid) {
    let soc = socketList.find(item => item.sid == sid);
    soc.connects = soc.connects.arr.filter(item => { item.cid != cid });
}

/**
 * 回复客户端数据
 * @param {1|2|3} code 错误码 正常|错误
 * @param {Number} sid socketid
 * @param {String} msg 告知客户端的错误信息
 */
function socketReply(code, sid, msg) {
    let event = `create-socket-reply-${sid}`
    sendMsg(event, {
        code: code,
        sid,
        message: msg
    })
}

/**
 * 发送指定数据给前端
 * @param {string} event 事件句柄
 * @param {*} arg 数据参数
 */
function sendMsg(event, arg) {
    // console.log(mainWindow)
    publicS.getMainwindow().webContents.send(event, arg);
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







//主动发消息给渲染进程.目前只设置为一个前端进程,所以为
function sendRender(event, arg) {
    mainWindow.webContents.send(event, arg)
}




/** 创建udp服务
 * @param {Number} sid id
 * @param {*} arg 配置信息
 */
function createUdp(sid, arg) {
    let udp = dgram.createSocket('udp4');
    let defaultOpt = {
        protocol: 'udp', //连接协议
        model: 'server', //连接模式
        remoteAddress: '', //服务端地址
        remotePort: '', //服务端端口
        localPort: '', //本地端口
        sid: null, //socket的唯一标识,由前端生成
    };
    if (arg.model == 'server') {
        udp.bind(arg.localPort);
    };
    udp.on('message', (msg, rinfo) => {
        //收到客户端信息
        let cid = addSocketConnect(sid, rinfo);
        console.log(msg);
        saveSocketConnectMsg(sid, cid, msg);
    });
}

// tcp相关

/**
 * 创建tcp的客户端
 * @param {Number} sid id
 * @param {} remoteAddress 远程服务地址
 * @param {*} remotePort 远程服务端口
 */
function createTcpClient(sid, remoteAddress, remotePort) {
    let tcp = net.Socket();
    console.log('开启tcp客户端连接');
    tcp.connect(remotePort, remoteAddress, function() {
        //成功连接到服务端，可以开始进行通信了
        socketReply(1, sid)
    });
    tcp.on('error', (error) => {
        socketReply(2, sid, error.message);
        console.error('创建tcp客户端错误');
        console.log(error.message);
    })


}

/**
 * 创建tcp服务
 * @param {*} sid socket连接的id信息 
 * @param {*} prot 监听的本地端口
 */
function createTcpServer(sid, port) {
    console.log('---------')
    let tcp = net.createServer(function(socket) {
        //从数组中找到自己,将这个socket信息进行保存
        let socketOption = socketList.find(item => item.sid == sid);
        //连接信息保存
        let cid = addSocketConnect(sid, { socket });
        //通知前端有客户端连接上来了
        console.log('tcp服务收到了本地的连接');
        console.table(socket);
        socket.on('data', (data) => {
            let msg = data.toString();
            console.log(msg);
            // 存储消息
            saveSocketConnectMsg(sid, cid);
            // 通知前端接收到信息
        });
        socket.on('close', () => {
            //客户端主动断开连接,移除客户端连接
            removeSocketConnet(sid, cid);
        })
    });
    tcp.on('error', (error) => {
        socketReply(2, sid, error.message);
        console.error('创建tcp服务端错误');
        console.log(error.message);
    })
    tcp.listen(port, () => {
        //修改连接状态
        setSocketState(sid, 1);
        console.log('成功创建tcpServe服务');
        // 告知前端已经创建完成
        socketReply(1, sid)
    })
}

/**
 * 尝试保存socket数据
 * @param {*} event 事件句柄
 * @param {Object} arg 参数
 * @param {Number} arg.sid id
 * @param {'tcp'|'udp'} arg.protocol 连接协议
 * @param {'server'|'client'} arg.model 连接模式
 * @param {Number} [arg.localPort] 本地端口
 * @param {String} [arg.remoteAddress] 远程地址
 * @param {String} [arg.remotePort] 本机地址
 * @param {Array} [arg.connects] 连接的socket数组
 */
function createTcp(event, arg) {
    switch (arg.model) {
        case 'server':
            //创建服务端,不需要连接...
            createTcpServer(arg.sid, arg.localPort);
            break;
        case 'client':
            //创建客户端
            createTcpClient(arg.sid, arg.remoteAddress, arg.remotePort);
            break;
    }
}

// 总入口

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
    // 存储socket数据
    finalOpt = saveSocket(finalOpt);
    //尝试连接
    switch (finalOpt.protocol) {
        case 'tcp':
            createTcp(event, finalOpt);
            break;
        case 'udp':
            createUdp(event, finalOpt);
            break;
        default:
            console.error('未知的协议类型,暂时不支持此类型');
    }
}

exports.createUdp = createUdpClient;
// exports.createTcp = createTcp;


exports.udpSend = null;


exports.createSocket = createSocket;