let net = require('net')
let dgram = require('dgram');


function createTcpServer(localPort) {
    let tcpServer = net.createServer()
    tcpServer.sockets = {};
    tcpServer.socketLength = 1;
    //监听事件
    tcpServer.on('listening', () => {
            if (tcpServer.onListen && typeof tcpServer.onListen == 'function') {
                tcpServer.onListen()
            }
        })
        //连接事件绑定触发
    tcpServer.on('connection', (socket) => {
            if (tcpServer.onConnect && typeof tcpServer.onConnect == 'function') {
                // 将连接上来的socket数据进行数据监听
                DealConnect(socket)
                tcpServer.onConnect(socket, tcpServer.socketLength)
            }
        })
        //
    tcpServer.on('error', (err) => {
            if (tcpServer.onError && typeof tcpServer.onError == 'function') {
                tcpServer.onError(err)
            }
        })
        //
    tcpServer.on('close', () => {
            if (tcpServer.onClose && typeof tcpServer.onClose == "function") {
                tcpServer.onClose();
            }
        })
        //广播消息函数
    tcpServer.enum = function(str) {
            // 使用for循环遍历socket数组进行数据发送
            for (let i in tcpServer.sockets) {
                tcpServer.sockets[i].write(str)
            }
        }
        //处理客户端发送过来的消息
    function DealConnect(socket) {
        tcpServer.sockets[tcpServer.socketLength] = socket;
        // 将客户端发来的数据进行处理
        // ((socket)=>{
        //     console.log(socket)
        // })(socket)
        (
            (socket, tcpServer, socketLength) => {
                socket.on('data', (data) => {
                    // 转交给事件处理函数
                    if (tcpServer.onClientData && typeof tcpServer.onClientData == "function") {
                        tcpServer.onClientData(data, socket, tcpServer, socketLength);
                    }
                })
            }
        )(socket, tcpServer, tcpServer.socketLength);

        //客户端关闭连接事件处理
        ((socket, tcpServer, socketLength) => {
            console.log('关闭连接事件绑定')
            socket.on('close', () => {
                tcpServer[socketLength] = undefined;
                if (tcpServer.onClientClose && typeof tcpServer.onClientClose == "function") {
                    tcpServer.onClientClose(socket);
                }
            })
        })(socket, tcpServer.socketLength);
        //客户端异常关闭
        ((socket, tcpServer, socketLength) => {
            socket.on('error', (err) => {
                // 从库里面将当前的socket对象移除
                tcpServer[socketLength] = undefined;
                socket = undefined;
                if (tcpServer.onClientError && typeof tcpServer.onClientError == "function") {
                    tcpServer.onClientError(err, socket);
                }
            })
        })(socket, tcpServer.socketLength)
    }
    tcpServer.socketLength = parseInt(tcpServer.socketLength) + 1;

    return tcpServer
}



function createTcpClient(remoteHost, remotePort) {
    let tcpClient = net.Socket()
    let option = {
        port: remotePort,
        host: remoteHost
    }
    tcpClient.connect(option, () => {
        if (tcpServer.onConnect && typeof tcpServer.onConnect == 'function') {
            tcpServer.onConnect()
        }
    })
    tcpClient.
    return tcpClient
}

function createUdpServer() {
    let udpServer = dgram.createSocket('udp4');
    return udpServer
}


function createUdpClient() {
    let udpClient = dgram.createSocket('udp4');
    return udpClient
}

let ts = createTcpServer()

ts.listen(3000, () => {
    console.log(123)
})

ts.onConnect = function(socket, key) {
    console.log(`客户端连接,已经自动分配key值${key}`)
        // console.log(socket)
}

ts.onClientData = function(data, socket) {
    console.log('收到数据')
    console.log(data)
    console.log(data.toString())
    console.log('---')
    socket.write('01 16 00 00 00 01 07 AA')
}