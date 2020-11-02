import React, { useState,useSelect,useRef} from 'react'
import './calculator.css'

let CRC = {};
/** 计算器页面 */
function Calculator(props) {
    let a = '12';
    /** input输入框的快捷控制 */
    let [inputValue,setInputValue] = useState('');
    /** 结果列表 */
    let [results,setResult] = useState([]);
    /** 选择控制的项 */
    let [comList,setComList] = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]);
    /** 终端地址 */
    let [address,setAddress] = useState(0);
    const inputEl = useRef(null);
    let addressArr = [
        {
            title:'0(广播地址)',
            value:'0'
        },
        {
            title:'端口1',
            value:'1'
        },
        {
            title:'端口2',
            value:'2'
        },
        {
            title:'端口3',
            value:'3'
        },
        {
            title:'端口4',
            value:'4'
        },
        {
            title:'端口5',
            value:'5'
        },
        {
            title:'端口6',
            value:'6'
        },
        {
            title:'端口7',
            value:'7'
        },
        {
            title:'端口8',
            value:'8'
        },
        {
            title:'254广播地址',
            value:'fe'
        }
    ]
    let finalValue = ''
    return (
        <div className="calculator">
            <div className="title">
                网关指令生成器
            </div>
            
            <div className="row first">
                <div className="chunk">
                    <div className="select">
                        终端地址:
                        <select 
                        onChange={(e)=>{
                            setAddress(e.target.value)
                        }}>
                            {
                                addressArr.map(item=>{
                                    return <option value={item.value}>
                                        {item.title}
                                    </option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="chunk">
                    <input 
                    type="text" 
                    className="input"
                    placeholder="输入需要控制的路"
                    onChange={saveValue}
                    // value={inputValue}
                    />
                </div>
                <div className="chunk">
                    <div className="btn" onClick={openThis}>
                        开启这些端口
                        <button></button>
                    </div>
                    <div className="btn" onClick = {closeThis}>
                        关闭这些端口
                        <button></button>
                    </div>
                </div>
            </div>
            <div className="row">
                <ul className="ul">
                    {
                        comList.map((item,i)=>{
                            return (
                                <li 
                                className={item?'li checked':'li '} 
                                onClick={()=>{changeItem(i)}}
                                >
                                    <div className="text">{i+1}</div>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="btn all" onClick={allSelect}>全选</div>
                <div className="btn reverse"  onClick={reverse}>反选</div>
            </div>
            <div className="row">
                <div className="line-box">
                    <div className="line">
                        <div className="num">No</div>
                        <div className="text">指令类型</div>
                        <div className="value">
                            <input 
                            type="text" 
                            className="input"
                            readOnly="true"
                            value="指令"
                            />
                        </div>
                        <div className="copy">按钮</div>
                    </div>
                    {
                        results.map((item,i)=>{
                            return (
                                <div className="line" key={i}>
                                    <div className="num">{i}</div>
                                    <div className="text">{item.model}</div>
                                    <div className="value">
                                        <input 
                                        type="text" 
                                        className="input"
                                        readOnly
                                        value={item.value}
                                        />
                                    </div>
                                    <div className="copy" onClick={e=>{copyValue(item.value)}}>复制</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="control">
                    <div className="btns">
                        <div className="btn" onClick={createCom}>生成联合指令</div>
                        <div className="btn" onClick={createOpen}>只生成闭合项</div>
                        <div className="btn" onClick={createClose}>只生成关闭项</div>
                    </div>
                </div>
            </div>
            <br/>
            <div className="row">
            <input type="text" className="hidevalue" ref={inputEl}/>
                <div className="btn">空格格式化</div>
                <div className="btn" onClick={()=>{
                    setResult([])
                }}>清空</div>
            </div>
        </div>
    )
    /** 直接修改值 */
    function saveValue(e){
        let value = e.target.value;
        // console.log(value)
        let numberArr = []
        for(var i in value){
            let item = value[i]
            let num;
            // console.log(item)
            if(typeof (item-0) == 'number'){
                num = (item-0);
                if(num > 0 && num <9){
                    num = parseInt(num)
                    numberArr.push(num)
                }
            }
        }
        quick(numberArr)
        //保证数字只出现一次
       numberArr = Array.from(new Set(numberArr))
        //    对元素进行排序
       e.target.value = numberArr.join('');
    //    数组本身进行存储
        setInputValue(numberArr)
    }
    /** 选择某项数据 */
    function changeItem(index ){
        //从数组中找到相关的数值
        setComList(comList.map(
            (item,i)=>{
                if(i == index){
                    return !item
                }else{
                    return item
                }
            }
        ))
    }
    /** 全选 */
    function allSelect(){
        setComList(comList.map(
            (item,i)=>{
                return true
            }
        ))
    }
    /** 反选当前项 */
    function reverse(){
        setComList(comList.map(item=> !item))
    }
    /** 快速排序 */
    function quick(array){
        quicksort(array)
        function quicksort(arr){
            sort(arr,0,arr.length-1)
        }
        function sort(arr,l,r){
            if(l<r){
                let index = patition(arr,l,r);
                sort(arr,l,index-1);
                sort(arr,index +1,r);
            }
        }
        function patition(arr,l,r){
            let p = arr[l]
            let i = l
            let j = r
            while(i < j){
                while(arr[j] >= p && i <j){
                    j--;
                }
                swap(arr,i,j)
            }
            swap(arr,l,i)
            return i
        }
        function swap(arr,i,j){
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    function copyValue(str){
        var input = inputEl.current;
        input.value = str;
        console.log(str)
        console.log(input)
        input.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        // alert("内容复制成功！");
    }
    function openThis(){
        console.log(inputValue);
        let newarr = comList.map(item=>item)

        for(var i in inputValue)
        {
            newarr[inputValue[i] -1] = true 
        }
        setComList(newarr)
    }
    function closeThis(){
        let newarr = comList.map(item=>item)

        for(var i in inputValue)
        {
            newarr[inputValue[i] -1] = false 
        }
        setComList(newarr)
    }
    /** 生成联合项 */
    function createCom(){
        let arr = []
        for(var i= comList.length-1;i>=0;i--){
            arr.push(comList[i]?'1':'0')
        }
        let result = comInstruct(address,arr)
        let a = results.map(item=>item)
        a.push({
            model:'联合指令',
            value:result
        })
        setResult(a)
    }
    /** 只生成闭合项 */
    function createClose(){
        let arr = []
        for(var i= comList.length-1;i>0;i--){
            arr.push(comList[i]?'1':'0')
        }
        let result = closeInstruct(address,arr)
        let a = results.map(item=>item)
        a.push({
            model:'联合指令',
            value:result
        })
        setResult(a)
    }
    /** 只生成开启项 */
    function createOpen(){
        let arr = []
        for(var i= comList.length-1;i>0;i--){
            arr.push(comList[i]?'1':'0')
        }
        let result = breakInstruct(address,arr)
        let a = results.map(item=>item)
        a.push({
            model:'联合指令',
            value:result
        })
        setResult(a)
    }
}
CRC.CRC16 = function(data) {
    var len = data.length;
    if (len > 0) {
        var crc = 0xFFFF;

        for (var i = 0; i < len; i++) {
            crc = (crc ^ (data[i]));
            for (var j = 0; j < 8; j++) {
                crc = (crc & 1) != 0 ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
            }
        }
        var hi = ((crc & 0xFF00) >> 8); //高位置
        var lo = (crc & 0x00FF); //低位置

        return [hi, lo];
    }
    return [0, 0];
};

CRC.isArray = function(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};

CRC.ToCRC16 = function(str, isReverse) {
    return CRC.toString(CRC.CRC16(CRC.isArray(str) ? str : CRC.strToByte(str)), isReverse);
};

CRC.ToModbusCRC16 = function(str, isReverse) {
    return CRC.toString(CRC.CRC16(CRC.isArray(str) ? str : CRC.strToHex(str)), isReverse);
};

CRC.strToByte = function(str) {
    var tmp = str.split(''),
        arr = [];
    for (var i = 0, c = tmp.length; i < c; i++) {
        var j = encodeURI(tmp[i]);
        if (j.length == 1) {
            arr.push(j.charCodeAt());
        } else {
            var b = j.split('%');
            for (var m = 1; m < b.length; m++) {
                arr.push(parseInt('0x' + b[m]));
            }
        }
    }
    return arr;
};

CRC.convertChinese = function(str) {
    var tmp = str.split(''),
        arr = [];
    for (var i = 0, c = tmp.length; i < c; i++) {
        var s = tmp[i].charCodeAt();
        if (s <= 0 || s >= 127) {
            arr.push(s.toString(16));
        } else {
            arr.push(tmp[i]);
        }
    }
    return arr;
};

CRC.filterChinese = function(str) {
    var tmp = str.split(''),
        arr = [];
    for (var i = 0, c = tmp.length; i < c; i++) {
        var s = tmp[i].charCodeAt();
        if (s > 0 && s < 127) {
            arr.push(tmp[i]);
        }
    }
    return arr;
};

CRC.strToHex = function(hex, isFilterChinese) {
    hex = isFilterChinese ? CRC.filterChinese(hex).join('') : CRC.convertChinese(hex).join('');

    //清除所有空格
    hex = hex.replace(/\s/g, "");
    //若字符个数为奇数，补一个0
    hex += hex.length % 2 != 0 ? "0" : "";

    var c = hex.length / 2,
        arr = [];
    for (var i = 0; i < c; i++) {
        arr.push(parseInt(hex.substr(i * 2, 2), 16));
    }
    return arr;
};

CRC.padLeft = function(s, w, pc) {
    if (pc == undefined) {
        pc = '0';
    }
    for (var i = 0, c = w - s.length; i < c; i++) {
        s = pc + s;
    }
    return s;
};

CRC.toString = function(arr, isReverse) {
    if (typeof isReverse == 'undefined') {
        isReverse = true;
    }
    var hi = arr[0],
        lo = arr[1];
    return CRC.padLeft((isReverse ? hi + lo * 0x100 : hi * 0x100 + lo).toString(16).toUpperCase(), 4, '0');
};

/** 终端地址 默认为广播模式 */
// let address = 1;
/** 通道数组,用于快捷显示状态 */
// let channel_state = [1, 1, 0, 1, 0, 1, 1, 1];

let crc = CRC;
/** 生成联合指令 */
function comInstruct(address,channel_state) {
    let str_state = channel_state.join('');
    str_state = parseInt(str_state, 2).toString(16)
    let tArr = [address, 15, 0, 0, 0, 8, 1, str_state];
    let str = computeCrc(tArr);
    return str
}
/** 生成断开指令
 */
function breakInstruct(address,channel_state) {
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
function closeInstruct(address,channel_state) {
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
            if(i == 1){
                newStr +=  ''+z + crc16[i] 
            }else{   
                newStr +=  ' '+z + crc16[i] 
            }
            z = ''
        } else {
            z += crc16[i]
        }
    }

    //生成scr16的指令
    return `${str} ${newStr}`
}


export default Calculator