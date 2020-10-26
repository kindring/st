let net = require('net')
let dgram = require('dgram');

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
    console.log(arguments)
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

function createUdpClient(event, remoteAddress, remotePort, localPort, type, eventId) {
    //创建一个连接,存储在socket里面存储
    let obj = createUdp(type, remoteAddress, remotePort, localPort);
    let socket = obj.socket
    if (type == 'server') {
        socket.bind(localPort);
    }
    socket.on('message', (msg, rinfo) => {
        console.log(msg)
        console.log(rinfo)
        event.reply('udp-msg', msg.toString())
    })
    event.reply('create-udp-replay-' + eventId, {
        state: 1,
        id: obj.id,
        msg: '成功'
    });
}

function createTcpClient(event, arg) {
    let tcp = net.Socket();
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
        event.replay('create-tcp-replay-' + eventId, {
            state: 1,
            id: tcpObject.id,
            msg: '成功'
        })
    })
    tcp.on('error', (err) => {
        tcpObject.state = 2;
        event.replay('create-tcp-replay-' + eventId, {
            state: 2,
            id: null,
            msg: err.message
        })
    })


}

function createTcpServer(event, arg) {
    let tcp = net.createServer(function(socket) {
        let id = socketsTotal + 1;
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
        event.replay('create-tcp-replay-' + eventId, {
            state: 1,
            id: tcpObject.id,
            msg: 'ok'
        })
    })
    tcp.listen(arg.localPort, () => {
        console.log('成功开启tcp监听服务')
    })
}

function send(event, arg) {
    let id = arg.id,
        msg = arg.msg;
    console.log(arg)
    let arr = udps.find(item => item.id == id);
    if (!arr) {
        console.log('未能找到socket对象')
    }
    arr.socket.send(msg, arr.remotePort, arr.remoteAddress, (err, bytes) => {
        if (err) throw err;
    })

}

function createTcp(event, arg) {
    if (arg.type == 'server') {
        createTcpServer(event, arg)
    } else {
        createTcpClient(event, arg)
    }
}
//数据推送服务

exports.createUdp = createUdpClient;
exports.createTcp = createTcp;
exports.udpSend = send;