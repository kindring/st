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
    let soc = socketList.find(item => {
        console.log(item);
        return item.sid == sid
    });

    let c = soc.connects.find(item => {
        if (item.address == connectObj.address && item.port == connectObj.port) {
            return item;
        }
    })
    if (c) {
        // 旧连接发消息过来了
        return c.cid;
    }
    /**
     * 连接的客户端id
     */
    let c_id = soc.cid + 1;
    soc.cid = c_id + 1;
    soc.connects.push({
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
    let soc = socketList.find(item => { return item.sid == sid });
    let c = soc.connect.find(item => { item.cid == cid });
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
    console.log(event);
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





//主动发消息给渲染进程.目前只设置为一个前端进程,所以为
function sendRender(event, arg) {
    mainWindow.webContents.send(event, arg)
}




/** 创建udp服务
 * @param {Number} sid id
 * @param {*} arg 配置信息
 */
function createUdp(event, arg) {
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
        //指定监听端口
        udp.bind(arg.localPort);
    } else {
        addSocketConnect(arg.sid, {
            address: arg.remoteAddress,
            port: arg.remotePort,
            socket: udp,
        })
    }
    udp.on('message', (msg, rinfo) => {
        //收到客户端信息
        let cid = addSocketConnect(arg.sid, {...rinfo, socket: udp });
        console.log(msg);
        console.log(rinfo);
        saveSocketConnectMsg(arg.sid, cid, msg);
    });
    socketReply(1, arg.sid);
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
        socketReply(1, sid);
        //存储当前实例到数组中去
        //将当前对象添加到连接中去
        addSocketConnect(sid, {
            address: remoteAddress,
            port: remotePort,
            socket: tcp
        })
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


/**
 * 发送socket消息
 * @param {*} event 
 * @param {*} arg
 * @param {String} arg.msg 要发送的具体消息
 * @param {Number} arg.sid socket的id 
 * @param {Number} [arg.cid] 连接的id
 * @param {Boolean} arg.space 是否删除空格
 * @param {Boolean} arg.hex 是否为16进制发送
 */
function socketSend(event, arg) {
    let defaultArg = {
        msg: '',
        sid: null,
        cid: null,
        space: false,
        hex: false,
    }
    console.log('传入的信息');
    console.table(arg);
    let finalArg = {...defaultArg, ...arg }
    console.log('当前的消息');
    console.log(finalArg);

    finalArg.msg = finalArg.space ? finalArg.msg.replace(/' '/, '') : finalArg.msg;
    //判断是否需要进行16进制的消息处理
    if (finalArg.hex) {
        let strs = finalArg.msg.split(' ');
        if (strs.length == 1) {
            strs = strs[0];
            //无法自动切割
            let str = '';
            for (var x = 0; x < strs.length; x++) {
                str += strs[x];
                if ((x + 1) % 2 == 0) {
                    str += ' '
                }
            }
            strs = str.split(' ');
        }
        console.log(strs);
        for (let i = 0; i < strs.length; i++) {
            strs[i] = "0x" + strs[i];
        } //每个字符加上0x

        let buffer = Buffer.from(strs);
        console.log(buffer);

        console.log('0-0-0--00-')
        console.log(buffer.toString('hex'));
        finalArg.msg = buffer; //将数组放到buffer
    }
    console.log('要发送的socket消息');
    console.log(finalArg.msg);
    // 根据协议来发送消息
    let socket = socketList.find(item => {
        return item.sid == finalArg.sid
    });
    if (!socket) {
        return console.error('未能找到响应的数据');
    }
    switch (socket.protocol) {
        case "tcp":
            // 查看协议
            if (!finalArg.cid) {
                for (var i in socket.connects) {
                    let cli = socket.connects[i];
                    cli.socket.write(finalArg.msg);
                }
            }

            break;

        case 'udp':
            if (!finalArg.cid) {
                console.log(socket);
                for (var i in socket.connects) {
                    let cli = socket.connects[i];
                    cli.socket.send(finalArg.msg, cli.port, cli.address);
                }
            }
            break;
    }
}

// exports.createUdp = createUdpClient;
// exports.createTcp = createTcp;


exports.udpSend = null;


exports.send = socketSend;

exports.createSocket = createSocket;