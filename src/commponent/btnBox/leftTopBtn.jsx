import React, { useState } from 'react';

import leftTopBtnCss from './leftTopBtn.css'

import api from '../../api';
//无状态组件
function leftTopBtn(){
    let fullFlag = false;
    return (
        <div className="rightTopBtn" >
            <div className="drag">
                {/* 用于拖拽窗口用 */}
                
            </div>
            <div className="btns">
                <div className="btn min" onClick={min}></div>
                <div className="btn full" onClick={full}></div>
                <div className="btn close" onClick={exit}></div>
            </div>
        </div>
    )
    function min(){
        api.win.minWin()
    }
    function full(){
        return alert('我不想给你这个功能')
        if(fullFlag){
            api.win.maxWin()
        }else{
            api.win.noWin()
        }
        fullFlag = !fullFlag;
    }
    function exit(){
        api.win.closeWin()
    }
}

export default leftTopBtn;