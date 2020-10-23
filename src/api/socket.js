let { ipcRenderer } = window.electron;
import store from '../store';
//创建socket服务等操作异步

function createUdpClient(remoteAddress, remotePort, localPort) {
    //使用ipc进行数据获取
    ipcRenderer.sendSync('create-udp', { remoteAddress, remotePort, localPort }).then(
        (result) => {

        }
    )
}