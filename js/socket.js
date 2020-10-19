let net = require('net');

const readline = require('readline');
let dgram = require('dgram');
const { connect } = require('http2');

/**生成udp客户端 */
function createUdpClient(ip,port,localPort){
    let udpclient = dgram.createSocket('udp4');
    udpclient.on('message',(msg,rinfo)=>{
        console.log(`收到${rinfo.address}:${rinfo.port}的回复:   ${msg}`)
    })
    udpclient.bind(localPort,()=>{
        console.log('绑定本地端口成功')
    })
    /** 发送数据
     * 
     * @param {*} msg 
     * @param {*} hexModel 
     */
    udpclient.Msend = function(msg,hexModel){
        udpclient.send(msg,port,ip,()=>{
            console.log('已经向主机发送数据')
        })
    }
    return udpclient;
}

// let udp = createUdpClient('192.168.1.20',12345,10000);
// console.log(udp)

// udp.Msend(`AT+STACH1=1\n`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let udpCli;
  rl.on('line', (input) => {
    if(input == 'connect'){
        udpCli = createUdpClient('192.168.1.20',12345,10000);
       
    }else if(input == 'open'){
        if(udpCli.Msend !== null){
            udpCli.Msend(`AT+STACH1=1\n`)
        }       
    }else if(input == 'close'){
        if(udpCli.Msend !== null){
            udpCli.Msend(`AT+STACH1=0\n`)
        }
    }
  });