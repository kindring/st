import React from 'react'

function tcpClientPage(){
    return (
        <div className="tc">
            <div className="configBox">
                <div className="address-box">
                    <div className="address-input"></div>
                    
                </div>
                <div className="port-box">
                    
                </div>
                <div className="quick-config">
                    <div className="nav">
                        <div className="tips-text">快捷配置</div>
                        <div className="control-btn">
                            <div className="add-quick-config">新增</div>
                            <div className="remove-quick-config">删除选中项</div>
                        </div>
                    </div>
                    <div className="quick-config-lists">
                        <div className="quick-config">
                            <div className="tips">
                                <div className="name">网关模块</div>
                                <div className="descript">
                                    <div className="address">
                                        <div className="name">
                                            address:
                                        </div>
                                        <div className="config">
                                            192.168.1.35
                                        </div>
                                    </div>
                                    <div className="port">
                                        <div className="name">
                                            port:
                                        </div>
                                        <div className="config">
                                            35888
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="control">
                                <div className="edit-btn">编辑</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="msg-box">
                {/* 可以在此处进行创建文件夹,用来将一些指令进行分组 */}
                <div className="nav">
                    <div className="tips-text">快捷任务列表</div>
                    <div className="control-btn">
                        <div className="add-btn">新增指令</div>
                        <div className="add-group-btn">新增分组</div>
                        <div className="dis-btn">禁用指令</div>
                        <div className="remove-btn">删除选中的指令或者分组</div>
                    </div>
                </div>
                <div className="msg-task-list">
                    {/* 用于存放需要依次发送的任务列表,比如需要进行延时发送时的操作 */}
                    <div className="task">
                        <div className="state">
                            是否参加任务 参加/不参加
                        </div>
                        <div className="lay-time">
                            等待时间 1000ms
                            {/* 执行当前任务时的延迟开始时间 */}
                        </div>
                        {/* <div className="type">
                            联合指令 单独指令
                        </div> */}
                        <div className="task-name">
                            顺序调用指令
                        </div>
                        <div className="run-model">
                            <div className="model time-model">
                                任务执行模式,执行当前任务组时强行等待内部任务进行执行,
                                在内部任务全部执行完毕之后在进行下一个任务
                            </div>
                        </div>
                        <div className="control">
                            <div className="bg-color"></div>
                            <div className="more-task-btn"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default tcpClientPage