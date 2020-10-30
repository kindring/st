import React, { useSelect } from 'react'

/** 计算器页面 */
function Calculator(props) {
    let a = '12'
    return (
        <div className="calculator">
            <div className="title">
                网关指令生成器
            </div>
            
            <div className="row">
                <div className="chunk">
                    <div className="select">
                        终端地址:
                        <select name="" id="">
                            <option value="0">0(广播地址)</option>
                            <option value="1">终端1</option>
                            <option value="8">终端8</option>
                            <option value="254">254 广播地址</option>
                        </select>
                    </div>
                </div>
                <div className="chunk">
                    <input 
                    type="text" 
                    className="input"
                    placeholder="输入需要控制的路"
                    />
                </div>
                <div className="chunk">
                    <div className="btn">开启这些端口</div>
                    <div className="btn">关闭这些端口</div>
                </div>
            </div>
            <div className="row">
                <ul className="ul">
                    <li className="li"></li>
                    <li className="li"></li>
                    <li className="li"></li>
                    <li className="li"></li>
                    <li className="li"></li>
                    <li className="li"></li>
                    <li className="li"></li>
                    <li className="li"></li>
                </ul>
            </div>
        </div>
    )
}



export default Calculator