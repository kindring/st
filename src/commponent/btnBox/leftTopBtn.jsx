import React, { useState } from 'react';

import leftTopBtnCss from './leftTopBtn.css'
//无状态组件
function leftTopBtn(){
    
    return (
        <div className="rightTopBtn" >
            <div className="drag">
                {/* 用于拖拽窗口用 */}
                
            </div>
            <div className="btns">
                <div className="btn min"></div>
                <div className="btn full"></div>
                <div className="btn close"></div>
            </div>
        </div>
    )
}

export default leftTopBtn;