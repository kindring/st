const crc = require('./crc');

/** 终端地址 默认为广播模式 */
// let address = 1;
/** 通道数组,用于快捷显示状态 */
// let channel_state = [1, 0, 1, 0, 1, 0, 1, 0];
/** 生成联合指令 */
function comInstruct(address, channel_state) {
    let str_state = channel_state.join('');
    str_state = parseInt(str_state, 2).toString(16)
    let tArr = [address, 15, 0, 0, 0, 8, 1, str_state];
    let str = computeCrc(tArr);
    return str
}
/** 生成断开指令
 */
function breakInstruct(address, channel_state) {
    //找出闭合项进行数据生成
    let arr = '';
    channel_state.forEach((item, i) => {
        let a = item == 0 ? 1 : 0;
        arr += a;
    })
    arr = parseInt(arr, 2).toString(16)
    let tArr = [address, '10', 4, '1e', 0, 2, 4, 0, arr, 0, 0];
    let str = computeCrc(tArr);
    return str
}
/** 生成闭合指令
 */
function closeInstruct(address, channel_state) {
    //找出闭合项进行数据生成
    let arr = '';
    channel_state.forEach((item, i) => {
        let a = item == 1 ? 1 : 0;
        arr += a;
    })
    arr = parseInt(arr, 2).toString(16)
    let tArr = [address, '10', 4, '1a', 0, 2, 4, 0, arr, 0, 0];
    let str = computeCrc(tArr);
    return str
}

/** 将数组计算后crc校验码后生成字符串
 * 
 * @param {*} arr 
 */
function computeCrc(arr) {
    //自动计算转化为16进制l
    let str = ''
    for (var i in arr) {
        let item = arr[i].toString(16)
        let line = ''
        if (i != 0) {
            line += ' '
        }
        if (item.length < 2) {
            str = str + line + '0' + item
        } else {
            str = str + line + item
        }
    }
    let crc16 = crc.ToModbusCRC16(str, true)
    let newStr = '';
    let z = ''
    for (var i = 0; i < crc16.length; i++) {
        if (((i + 1) % 2) == 0) {
            newStr += z + crc16[i] + ' '
            z = ''
        } else {
            z += crc16[i]
        }
    }

    //生成scr16的指令
    return `${str} ${newStr}`
}


function createCom(event, arg) {
    let value = comInstruct(arg.address, arg.state);
    event.reply('createCalclatorCom-reply', value)
}

function createClose(event, arg) {
    let value = closeInstruct(arg.address, arg.state);
    event.reply('createCalclatorClose-reply', value)
}

function createOpen(event, arg) {
    let value = breakInstruct(arg.address, arg.state);
    event.reply('createCalclatorOpen-reply', value)
}
module.exports = {
    createCom,
    closeInstruct,
    breakInstruct
}