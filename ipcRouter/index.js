let net = require('net')
let dgram = require('dgram');

let udps = []; //udp客户端
let udpTotal = 0;
/** 创建udp服务，我自定义的对象
 * @param {*} remoteAddress 
 * @param {*} remotePort 
 * @param {*} localPort 
 */
function createUdp(type = udp, remoteAddress, remotePort, localPort) {
    let udp = dgram.createSocket('udp4');
    let id = udpTotal + 1;
    let udpObject = {
        id,
        type: type,
        remoteAddress,
        remotePort,
        localPort,
        socket: udp,
    }
    udps.push(udpObject)
    udpTotal++;
    return udpObject;
}

function createUdpClient(event, remoteAddress, remotePort, localPort) {
    //创建一个连接,存储在socket里面存储
    let obj = createUdp('client', remoteAddress, remotePort, localPort);
    let socket = obj.socket
    socket.bind(localPort);
    socket.on('message', (msg, rinfo) => {
        console.log(msg)
        console.log(rinfo)
        event.reply('udpClient-msg', msg.toString())
    })
    event.reply('udpClient-created', obj.id);
}

function send(event, arg) {
    let id = arg.id,
        msg = arg.msg;
    let arr = udps.find(item => item.id == id);
    arr.socket.send(msg, arr.remotePort, arr.remoteAddress, (err, bytes) => {
        if (err) throw err;
    })

}
//数据推送服务

exports.createUdpClient = createUdpClient;
exports.udpSend = send;